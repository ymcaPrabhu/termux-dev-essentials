#!/bin/bash
set -euo pipefail

# BMad Epic 001: MVP Core Installer - Main Orchestration Script
# One-shot installer for Termux development environment

# Task 1: Argument Parsing (Story 1.9)
DRY_RUN=false
VERBOSE=false
SKIP_CONFIRM=false

usage() {
    cat << EOF
Usage: $0 [OPTIONS]

One-shot installer for Termux development environment.

OPTIONS:
    --dry-run       Show what would be done without making changes
    --verbose       Enable verbose output for debugging
    --yes           Skip confirmation prompts (use with caution)
    -h, --help      Show this help message

EXAMPLES:
    $0                    # Normal installation
    $0 --dry-run          # Preview what will be installed
    $0 --verbose          # Detailed logging
    $0 --yes --dry-run    # Auto-approve with dry-run

EOF
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --yes)
            SKIP_CONFIRM=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Export flags for child scripts
export DRY_RUN
export VERBOSE
export SKIP_CONFIRM

# Task 2: Wrapper function for dry-run mode
execute_command() {
    local cmd="$1"
    local description="${2:-Executing command}"
    
    if [ "$VERBOSE" = true ]; then
        echo "[VERBOSE] $description"
    fi
    
    if [ "$DRY_RUN" = true ]; then
        echo "[DRY-RUN] Would execute: $cmd"
        return 0
    else
        if [ "$VERBOSE" = true ]; then
            echo "[EXEC] $cmd"
            eval "$cmd"
        else
            eval "$cmd" 2>&1
        fi
    fi
}

# Task 3: Verbose logging function
log_verbose() {
    if [ "$VERBOSE" = true ]; then
        echo "[VERBOSE] $1"
    fi
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================================"
echo "  BMad Termux Development Environment Installer"
echo "========================================================"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}🔍 DRY-RUN MODE: No changes will be made${NC}"
    echo ""
fi

if [ "$VERBOSE" = true ]; then
    echo -e "${BLUE}📢 VERBOSE MODE: Detailed logging enabled${NC}"
    echo ""
fi

# User confirmation
if [ "$SKIP_CONFIRM" = false ]; then
    echo "This installer will:"
    echo "  1. Prepare your Termux environment"
    echo "  2. Install prerequisite packages (nodejs, npm, git, python, etc.)"
    echo "  3. Set up proot-distro Ubuntu (if needed)"
    echo "  4. Install CLI development tools"
    echo "  5. Set up GitHub authentication"
    echo "  6. Clone your project repository"
    echo "  7. Apply shell customizations"
    echo "  8. Run verification checks"
    echo ""
    read -p "Do you want to continue? (y/N): " confirm
    
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi
fi

echo ""
echo "🚀 Starting installation..."
echo ""

# Story 1.1: Termux Preparation
echo "=== Step 1/8: Termux Environment Preparation ==="
log_verbose "Running prepare-termux.sh"
execute_command "bash '$SCRIPT_DIR/prepare-termux.sh'" "Preparing Termux environment"
echo -e "${GREEN}✅ Termux preparation complete${NC}"
echo ""

# Story 1.2: Prerequisite Installation
echo "=== Step 2/8: Installing Prerequisites ==="
log_verbose "Running install-prereqs.sh"
execute_command "bash '$SCRIPT_DIR/install-prereqs.sh'" "Installing prerequisite packages"
echo -e "${GREEN}✅ Prerequisites installed${NC}"
echo ""

# Story 1.3: Proot-Distro Setup
echo "=== Step 3/8: Setting up Proot-Distro Ubuntu ==="
log_verbose "Running setup-proot.sh"
if [ "$SKIP_CONFIRM" = true ]; then
    execute_command "bash '$SCRIPT_DIR/setup-proot.sh'" "Setting up proot-distro"
else
    read -p "Do you want to set up proot-distro Ubuntu (needed for incompatible tools)? (y/N): " setup_proot
    if [[ "$setup_proot" =~ ^[Yy]$ ]]; then
        execute_command "bash '$SCRIPT_DIR/setup-proot.sh'" "Setting up proot-distro"
        echo -e "${GREEN}✅ Proot-distro setup complete${NC}"
    else
        echo -e "${YELLOW}⏭️  Skipping proot-distro setup${NC}"
    fi
fi
echo ""

# Story 1.4 & 1.5: CLI Installation with Shim Generation
echo "=== Step 4/8: Installing CLI Development Tools ==="
log_verbose "Running install-cli-suite.js"
if [ "$SKIP_CONFIRM" = true ]; then
    execute_command "node '$SCRIPT_DIR/install-cli-suite.js'" "Installing CLI tools"
else
    read -p "Do you want to install CLI development tools? (y/N): " install_cli
    if [[ "$install_cli" =~ ^[Yy]$ ]]; then
        execute_command "node '$SCRIPT_DIR/install-cli-suite.js'" "Installing CLI tools"
        echo -e "${GREEN}✅ CLI tools installed${NC}"
    else
        echo -e "${YELLOW}⏭️  Skipping CLI tools installation${NC}"
    fi
fi
echo ""

# Story 1.6: GitHub Automation
echo "=== Step 5/8: GitHub Setup ==="
log_verbose "Running setup-github.js"
if [ "$SKIP_CONFIRM" = true ]; then
    execute_command "node '$SCRIPT_DIR/setup-github.js'" "Setting up GitHub"
else
    read -p "Do you want to set up GitHub authentication? (y/N): " setup_gh
    if [[ "$setup_gh" =~ ^[Yy]$ ]]; then
        execute_command "node '$SCRIPT_DIR/setup-github.js'" "Setting up GitHub"
        echo -e "${GREEN}✅ GitHub setup complete${NC}"
    else
        echo -e "${YELLOW}⏭️  Skipping GitHub setup${NC}"
    fi
fi
echo ""

# Story 1.7: Repository Cloning
echo "=== Step 6/8: Clone Project Repository ==="
log_verbose "Running clone-repo.js"
if [ "$SKIP_CONFIRM" = true ]; then
    echo -e "${YELLOW}⏭️  Skipping repository clone (requires interactive input)${NC}"
else
    read -p "Do you want to clone a project repository? (y/N): " clone_repo
    if [[ "$clone_repo" =~ ^[Yy]$ ]]; then
        execute_command "node '$SCRIPT_DIR/clone-repo.js'" "Cloning repository"
        echo -e "${GREEN}✅ Repository cloned${NC}"
    else
        echo -e "${YELLOW}⏭️  Skipping repository clone${NC}"
    fi
fi
echo ""

# Story 1.8: Shell Customization
echo "=== Step 7/8: Shell Customization ==="
log_verbose "Running apply-shell-config.sh"
execute_command "bash '$SCRIPT_DIR/apply-shell-config.sh'" "Applying shell customizations"
echo -e "${GREEN}✅ Shell customization complete${NC}"
echo ""

# Story 1.10: Verification
echo "=== Step 8/8: Verification ==="
log_verbose "Running verify-installation.sh"
if [ "$DRY_RUN" = true ]; then
    echo "[DRY-RUN] Would run verification checks"
else
    bash "$SCRIPT_DIR/verify-installation.sh"
fi
echo ""

# Final summary
echo "========================================================"
echo "  ✅ Installation Complete!"
echo "========================================================"
echo ""
echo "Next steps:"
echo "  1. Restart your shell: exec \$SHELL"
echo "  2. Verify everything works: bash $SCRIPT_DIR/verify-installation.sh"
echo ""
echo "To uninstall everything:"
echo "  bash $SCRIPT_DIR/uninstall.sh"
echo ""
echo "Happy coding! 🚀"
echo ""
