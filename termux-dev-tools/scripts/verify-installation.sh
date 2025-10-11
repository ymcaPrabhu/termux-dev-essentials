#!/bin/bash
set -euo pipefail

# BMad Story 1.10: Health Checks & Verification
# Comprehensive verification of all installed components

echo "========================================================"
echo "Installation Verification - BMad Story 1.10"
echo "========================================================"

PASS=0
FAIL=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_pass() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
    ((PASS++))
}

print_fail() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    ((FAIL++))
}

print_info() {
    echo -e "${YELLOW}ℹ️  INFO${NC}: $1"
}

# Task 2: Check CLI Versions
echo ""
echo "=== CLI Tools Version Check ==="

# Check prerequisites
for cmd in nodejs npm git curl python openssh; do
    if command -v "$cmd" >/dev/null 2>&1; then
        version=$("$cmd" --version 2>&1 | head -n1 || echo "unknown")
        print_pass "$cmd installed (version: $version)"
    else
        print_fail "$cmd not found"
    fi
done

# Check if CLI installation results exist
RESULTS_FILE="$(dirname "$0")/../.cli-install-results.json"
if [ -f "$RESULTS_FILE" ]; then
    print_info "CLI installation results found"
    
    # Check native installations
    if command -v jq >/dev/null 2>&1; then
        NATIVE_TOOLS=$(jq -r '.native[]' "$RESULTS_FILE" 2>/dev/null || echo "")
        PROOT_TOOLS=$(jq -r '.proot[]' "$RESULTS_FILE" 2>/dev/null || echo "")
        
        if [ -n "$NATIVE_TOOLS" ]; then
            for tool in $NATIVE_TOOLS; do
                if command -v "$tool" >/dev/null 2>&1; then
                    print_pass "$tool (native) is accessible"
                else
                    print_fail "$tool (native) not accessible"
                fi
            done
        fi
        
        if [ -n "$PROOT_TOOLS" ]; then
            for tool in $PROOT_TOOLS; do
                if command -v "$tool" >/dev/null 2>&1; then
                    print_pass "$tool (proot shim) is accessible"
                else
                    print_fail "$tool (proot shim) not accessible"
                fi
            done
        fi
    else
        print_info "jq not available, skipping detailed CLI check"
    fi
else
    print_info "No CLI installation results found (this is OK if you haven't run install-cli-suite.js)"
fi

# Task 3: Verify GitHub Auth
echo ""
echo "=== GitHub Authentication Check ==="

if ssh -T git@github.com -o StrictHostKeyChecking=no 2>&1 | grep -q "successfully authenticated"; then
    print_pass "GitHub SSH authentication working"
else
    print_fail "GitHub SSH authentication not configured or failing"
fi

# Verify git config
if git config --global user.name >/dev/null 2>&1 && git config --global user.email >/dev/null 2>&1; then
    GIT_NAME=$(git config --global user.name)
    GIT_EMAIL=$(git config --global user.email)
    print_pass "Git user configured (Name: $GIT_NAME, Email: $GIT_EMAIL)"
else
    print_fail "Git user not configured"
fi

# Task 4: Verify Shell Config
echo ""
echo "=== Shell Configuration Check ==="

# Check PATH
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if echo "$PATH" | grep -q "$SCRIPT_DIR"; then
    print_pass "BMad scripts directory in PATH"
else
    print_fail "BMad scripts directory not in PATH"
fi

# Check if aliases are loaded (check if ll is defined)
if type ll >/dev/null 2>&1; then
    print_pass "Shell aliases loaded"
else
    print_info "Shell aliases not loaded (may need to restart shell)"
fi

# Task 5: Test Proot Shims
echo ""
echo "=== Proot Environment Check ==="

if command -v proot-distro >/dev/null 2>&1; then
    print_pass "proot-distro is installed"
    
    if proot-distro list 2>&1 | grep -q "ubuntu"; then
        print_pass "Ubuntu proot environment installed"
        
        # Check if we can access Ubuntu
        if proot-distro login ubuntu -- echo "test" 2>/dev/null | grep -q "test"; then
            print_pass "Ubuntu proot environment accessible"
        else
            print_fail "Ubuntu proot environment not accessible"
        fi
    else
        print_info "Ubuntu proot not installed (this is OK if native installations worked)"
    fi
else
    print_info "proot-distro not installed (this is OK if native installations worked)"
fi

# Check shims manifest
SHIMS_MANIFEST="$PROJECT_ROOT/.shims-manifest.json"
if [ -f "$SHIMS_MANIFEST" ]; then
    print_info "Shims manifest found"
    if command -v jq >/dev/null 2>&1; then
        SHIM_COUNT=$(jq 'length' "$SHIMS_MANIFEST" 2>/dev/null || echo "0")
        print_info "Number of shims created: $SHIM_COUNT"
    fi
else
    print_info "No shims manifest (this is OK if all tools installed natively)"
fi

# Task 6: Generate Summary Report
echo ""
echo "========================================================"
echo "Verification Summary"
echo "========================================================"
echo -e "Total Checks: $((PASS + FAIL))"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your environment is ready.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please review the output above.${NC}"
    exit 1
fi
