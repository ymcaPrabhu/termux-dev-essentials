#!/bin/bash
set -euo pipefail

SCRIPT_PATH="scripts/setup-proot.sh"

echo "Running tests for $SCRIPT_PATH..."

# Test 1: Check if the script file exists
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "TEST FAILED: Script file does not exist at $SCRIPT_PATH"
    exit 1
fi
echo "✅ Test 1/2 Passed: Script file exists."

# Test 2: Check if the script is executable
if [ ! -x "$SCRIPT_PATH" ]; then
    echo "TEST FAILED: Script is not executable at $SCRIPT_PATH"
    exit 1
fi
echo "✅ Test 2/2 Passed: Script is executable."

echo "All basic tests passed!"
