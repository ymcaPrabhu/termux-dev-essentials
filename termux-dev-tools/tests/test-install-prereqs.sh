#!/bin/sh
set -euo pipefail

# The script to be tested
TEST_SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
SCRIPT_UNDER_TEST="$TEST_SCRIPT_DIR/../scripts/install-prereqs.sh"
if [ ! -f "$SCRIPT_UNDER_TEST" ]; then
    echo "❌ ERROR: Test script cannot find the script to test: $SCRIPT_UNDER_TEST" >&2
    exit 1
fi

# Create a temporary directory for our test environment and mocks
TEST_DIR=$(mktemp -d)
# Ensure cleanup happens on exit
trap 'rm -rf "$TEST_DIR"' EXIT

# Create a mock bin directory and add it to the PATH
MOCK_BIN_DIR="$TEST_DIR/bin"
mkdir -p "$MOCK_BIN_DIR"
export PATH="$MOCK_BIN_DIR:$PATH"

# Create a mock 'pkg' command that we can control
MOCK_PKG="$MOCK_BIN_DIR/pkg"
touch "$MOCK_PKG"
chmod +x "$MOCK_PKG"

echo "Running tests for install-prereqs.sh..."

# --- Test 1: All packages are already installed ---
echo -e "\n--- Test 1: All packages already installed ---"
# Create dummy executables for all prereqs
for pkg in nodejs npm git openssh curl python; do
    touch "$MOCK_BIN_DIR/$pkg"
    chmod +x "$MOCK_BIN_DIR/$pkg"
done
# The mock pkg command should fail the test if it's called
echo '#!/bin/sh\necho "ERROR: pkg should not have been called!" >&2; exit 1' > "$MOCK_PKG"
chmod +x "$MOCK_PKG"

# Run the script and capture output
output=$(sh "$SCRIPT_UNDER_TEST")

# Verify the output
if echo "$output" | grep -c "is already installed" | grep -q 6; then
    echo "✅ PASSED: Correctly identified all 6 existing packages."
else
    echo "❌ FAILED: Did not correctly report existing packages."
    echo "$output"
    exit 1
fi
# Clean up for next test
rm "$MOCK_BIN_DIR"/*

# --- Test 2: One package is missing and installs successfully ---
echo -e "\n--- Test 2: One package missing, successful install ---"
# Create all prereqs except one (python)
for pkg in nodejs npm git openssh curl; do
    touch "$MOCK_BIN_DIR/$pkg"
    chmod +x "$MOCK_BIN_DIR/$pkg"
done
# The mock pkg should succeed and create the 'missing' command
echo '#!/bin/sh\necho "Mock pkg: Installing python..."\ntouch '$MOCK_BIN_DIR'/python\nchmod +x '$MOCK_BIN_DIR'/python' > "$MOCK_PKG"
chmod +x "$MOCK_PKG"

output=$(sh "$SCRIPT_UNDER_TEST")
if echo "$output" | grep "Attempting to install... 'python'" && echo "$output" | grep "Successfully installed 'python'"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    echo "$output"
    exit 1
fi
rm "$MOCK_BIN_DIR"/*

# --- Test 3: A package is missing and fails to install ---
echo -e "\n--- Test 3: One package missing, failed install ---"
# The mock pkg command will fail
echo '#!/bin/sh\necho "Mock pkg: Simulating failure..." >&2; exit 1' > "$MOCK_PKG"
chmod +x "$MOCK_PKG"

# We expect the script to fail, so we check its exit code
if sh "$SCRIPT_UNDER_TEST" >/dev/null 2>&1; then
    echo "❌ FAILED: Script did not exit with an error on installation failure."
    exit 1
else
    echo "✅ PASSED: Script correctly exited with an error."
fi

echo -e "\nAll tests for install-prereqs.sh completed successfully."
