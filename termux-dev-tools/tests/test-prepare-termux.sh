#!/data/data/com.termux/files/usr/bin/env bash

# ==============================================================================
# Tests for Story 1.1: Termux Environment Preparation
# ==============================================================================

set -euo pipefail

# Source the script we are testing
SCRIPT_PATH="./scripts/prepare-termux.sh"

# --- Test Runner --- 

assert_success() {
    if [ $? -eq 0 ]; then
        echo "  ✅ SUCCESS"
    else
        echo "  ❌ FAILED"
        exit 1
    fi
}

assert_failure() {
    if [ $? -ne 0 ]; then
        echo "  ✅ SUCCESS (expected failure)"
    else
        echo "  ❌ FAILED (expected failure, but got success)"
        exit 1
    fi
}

# --- Test Cases ---

# Test 1: Should fail when PREFIX is not set
echo "[TEST] Running test for non-Termux environment..."
if ( unset PREFIX; bash "$SCRIPT_PATH" > /dev/null 2>&1 ); then
    echo "  ❌ FAILED (expected failure, but got success)"
    exit 1
else
    echo "  ✅ SUCCESS (expected failure)"
fi

# Test 2: Should succeed when PREFIX is set
echo "[TEST] Running test for Termux environment..."
if ( export PREFIX="/data/data/com.termux/files/usr"; bash "$SCRIPT_PATH" > /dev/null ); then
    echo "  ✅ SUCCESS"
else
    echo "  ❌ FAILED"
    exit 1
fi

# --- New Tests for Task 2 --- #

# Setup a temporary home directory for these tests
export FAKE_HOME="$(mktemp -d)"

# Test 3: Should fail when ~/storage does not exist
echo "[TEST] Running test for missing storage directory..."
if ( HOME="$FAKE_HOME" bash "$SCRIPT_PATH" > /dev/null 2>&1 ); then
    echo "  ❌ FAILED (expected failure, but got success)"
    rm -rf "$FAKE_HOME"
    exit 1
else
    echo "  ✅ SUCCESS (expected failure)"
fi

# Test 4: Should succeed when ~/storage exists
echo "[TEST] Running test for existing storage directory..."
if ( mkdir -p "$FAKE_HOME/storage"; HOME="$FAKE_HOME" bash "$SCRIPT_PATH" > /dev/null ); then
    echo "  ✅ SUCCESS"
else
    echo "  ❌ FAILED"
    rm -rf "$FAKE_HOME"
    exit 1
fi

# Cleanup
rm -rf "$FAKE_HOME"

# --- New Tests for Task 3 --- #

# Test 5: Should succeed with bash
echo "[TEST] Running test for bash shell detection..."
if ( export SHELL="/bin/bash"; bash "$SCRIPT_PATH" > /dev/null ); then
    echo "  ✅ SUCCESS"
else
    echo "  ❌ FAILED"
    exit 1
fi

# Test 6: Should succeed with zsh
echo "[TEST] Running test for zsh shell detection..."
if ( export SHELL="/bin/zsh"; bash "$SCRIPT_PATH" > /dev/null ); then
    echo "  ✅ SUCCESS"
else
    echo "  ❌ FAILED"
    exit 1
fi


# --- New Tests for Task 4 --- #

# Test 8: Should back up .bashrc
echo "[TEST] Running test for .bashrc backup..."
FAKE_BASH_HOME="$(mktemp -d)"
touch "$FAKE_BASH_HOME/.bashrc"
mkdir -p "$FAKE_BASH_HOME/storage"
( export PREFIX="/dummy"; export HOME="$FAKE_BASH_HOME"; export SHELL="/bin/bash"; bash "$SCRIPT_PATH" > /dev/null )
if ls "$FAKE_BASH_HOME"/.bashrc.*.bak > /dev/null 2>&1; then
    echo "  ✅ SUCCESS"
else
    echo "  ❌ FAILED (backup file not found)"
    rm -rf "$FAKE_BASH_HOME"
    exit 1
fi
rm -rf "$FAKE_BASH_HOME"

# Test 9: Should back up .zshrc
echo "[TEST] Running test for .zshrc backup..."
FAKE_ZSH_HOME="$(mktemp -d)"
touch "$FAKE_ZSH_HOME/.zshrc"
mkdir -p "$FAKE_ZSH_HOME/storage"
( export PREFIX="/dummy"; export HOME="$FAKE_ZSH_HOME"; export SHELL="/bin/zsh"; bash "$SCRIPT_PATH" > /dev/null )
if ls "$FAKE_ZSH_HOME"/.zshrc.*.bak > /dev/null 2>&1; then
    echo "  ✅ SUCCESS"
else
    echo "  ❌ FAILED (backup file not found)"
    rm -rf "$FAKE_ZSH_HOME"
    exit 1
fi
rm -rf "$FAKE_ZSH_HOME"

# --- New Tests for Task 5 --- #

# Test 10: Should add PATH to .bashrc
echo "[TEST] Running test for PATH modification..."
FAKE_PATH_HOME="$(mktemp -d)"
RC_FILE="$FAKE_PATH_HOME/.bashrc"
touch "$RC_FILE"
mkdir -p "$FAKE_PATH_HOME/storage"
( export PREFIX="/dummy"; export HOME="$FAKE_PATH_HOME"; export SHELL="/bin/bash"; bash "$SCRIPT_PATH" > /dev/null )
if grep -q "# Added by BMad Installer" "$RC_FILE"; then
    echo "  ✅ SUCCESS"
else
    echo "  ❌ FAILED (PATH line not found)"
    rm -rf "$FAKE_PATH_HOME"
    exit 1
fi

# Test 11: Should be idempotent
echo "[TEST] Running test for PATH modification idempotency..."
LINE_COUNT_BEFORE=$(wc -l < "$RC_FILE")
( export PREFIX="/dummy"; export HOME="$FAKE_PATH_HOME"; export SHELL="/bin/bash"; bash "$SCRIPT_PATH" > /dev/null )
LINE_COUNT_AFTER=$(wc -l < "$RC_FILE")
if [ "$LINE_COUNT_BEFORE" -eq "$LINE_COUNT_AFTER" ]; then
    echo "  ✅ SUCCESS"
else
    echo "  ❌ FAILED (file was modified a second time)"
    rm -rf "$FAKE_PATH_HOME"
    exit 1
fi
rm -rf "$FAKE_PATH_HOME"


echo "
[OVERALL] All tests passed for prepare-termux.sh"
