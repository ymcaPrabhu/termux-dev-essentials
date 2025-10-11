#!/bin/bash
set -euo pipefail

# BMad Story 1.11: Uninstallation
# Clean and comprehensive removal of all installed components

echo "========================================================"
echo "Uninstallation Script - BMad Story 1.11"
echo "========================================================"
echo ""
echo "⚠️  WARNING: This will remove all components installed by the BMad installer."
echo ""
read -p "Are you sure you want to continue? (yes/NO): " confirm

if [[ ! "$confirm" == "yes" ]]; then
    echo "Uninstallation cancelled."
    exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PREFIX="${PREFIX:-/data/data/com.termux/files/usr}"
BIN_DIR="$PREFIX/bin"

# Task 2: Remove CLIs
echo ""
echo "=== Removing CLI Tools ==="

RESULTS_FILE="$PROJECT_ROOT/.cli-install-results.json"
if [ -f "$RESULTS_FILE" ] && command -v jq >/dev/null 2>&1; then
    NATIVE_TOOLS=$(jq -r '.native[]' "$RESULTS_FILE" 2>/dev/null || echo "")
    
    for tool in $NATIVE_TOOLS; do
        echo "🔄 Uninstalling $tool..."
        if npm uninstall -g "$tool" 2>/dev/null; then
            echo "✅ Uninstalled $tool"
        else
            echo "⚠️  Could not uninstall $tool (may not be npm package)"
        fi
    done
else
    echo "ℹ️  No installation results found, skipping CLI removal"
fi

# Task 3: Remove Shims
echo ""
echo "=== Removing Command Shims ==="

SHIMS_MANIFEST="$PROJECT_ROOT/.shims-manifest.json"
if [ -f "$SHIMS_MANIFEST" ]; then
    if command -v jq >/dev/null 2>&1; then
        SHIM_PATHS=$(jq -r '.[].shimPath' "$SHIMS_MANIFEST" 2>/dev/null || echo "")
        
        for shim in $SHIM_PATHS; do
            if [ -f "$shim" ]; then
                echo "🗑️  Removing shim: $shim"
                rm -f "$shim"
                echo "✅ Removed $shim"
            fi
        done
    fi
    
    echo "🗑️  Removing shims manifest"
    rm -f "$SHIMS_MANIFEST"
else
    echo "ℹ️  No shims manifest found"
fi

# Remove results file
if [ -f "$RESULTS_FILE" ]; then
    rm -f "$RESULTS_FILE"
    echo "✅ Removed installation results file"
fi

# Task 4: Restore Shell Config
echo ""
echo "=== Restoring Shell Configuration ==="

SHELL_CONFIG=""
if [[ "$SHELL" == *"bash"* ]]; then
    SHELL_CONFIG="$HOME/.bashrc"
elif [[ "$SHELL" == *"zsh"* ]]; then
    SHELL_CONFIG="$HOME/.zshrc"
fi

if [ -n "$SHELL_CONFIG" ]; then
    # Find most recent backup
    LATEST_BACKUP=$(ls -t "$SHELL_CONFIG"*.bak 2>/dev/null | head -n1 || echo "")
    
    if [ -n "$LATEST_BACKUP" ] && [ -f "$LATEST_BACKUP" ]; then
        echo "🔄 Restoring shell config from: $LATEST_BACKUP"
        cp "$LATEST_BACKUP" "$SHELL_CONFIG"
        echo "✅ Shell configuration restored"
    else
        echo "⚠️  No backup found, removing BMad customizations manually"
        
        # Remove BMad sections from config
        if [ -f "$SHELL_CONFIG" ]; then
            sed -i.uninstall.bak '/# BEGIN BMad/,/# END BMad/d' "$SHELL_CONFIG" || \
            sed -i'' -e '/# BEGIN BMad/,/# END BMad/d' "$SHELL_CONFIG" 2>/dev/null || \
            echo "⚠️  Could not automatically remove BMad sections"
        fi
    fi
else
    echo "ℹ️  Could not detect shell config file"
fi

# Task 5: Remove Cloned Repo
echo ""
echo "=== Removing Project Repository ==="

PROJECTS_DIR="$HOME/projects"
if [ -d "$PROJECTS_DIR" ]; then
    echo "📂 Found projects directory: $PROJECTS_DIR"
    ls -l "$PROJECTS_DIR" 2>/dev/null || true
    echo ""
    read -p "Do you want to remove the entire projects directory? (y/N): " remove_projects
    
    if [[ "$remove_projects" =~ ^[Yy]$ ]]; then
        echo "🗑️  Removing projects directory..."
        rm -rf "$PROJECTS_DIR"
        echo "✅ Projects directory removed"
    else
        echo "ℹ️  Keeping projects directory"
    fi
else
    echo "ℹ️  No projects directory found"
fi

# Task 6: Proot Removal Logic
echo ""
echo "=== Proot Environment Removal ==="

if command -v proot-distro >/dev/null 2>&1; then
    if proot-distro list 2>&1 | grep -q "ubuntu"; then
        echo "⚠️  Ubuntu proot environment found."
        echo "⚠️  WARNING: This will delete the entire Ubuntu installation and all data within it."
        echo ""
        read -p "Do you want to remove the Ubuntu proot environment? (yes/NO): " remove_proot
        
        if [[ "$remove_proot" == "yes" ]]; then
            echo "🗑️  Removing Ubuntu proot environment..."
            if proot-distro remove ubuntu; then
                echo "✅ Ubuntu proot environment removed"
            else
                echo "❌ Failed to remove Ubuntu proot environment"
            fi
        else
            echo "ℹ️  Keeping Ubuntu proot environment"
        fi
    else
        echo "ℹ️  No Ubuntu proot environment found"
    fi
    
    read -p "Do you want to uninstall proot-distro itself? (y/N): " remove_proot_pkg
    if [[ "$remove_proot_pkg" =~ ^[Yy]$ ]]; then
        echo "🗑️  Uninstalling proot-distro..."
        pkg uninstall -y proot-distro 2>/dev/null || echo "⚠️  Could not uninstall proot-distro"
    fi
else
    echo "ℹ️  proot-distro not installed"
fi

# Final cleanup
echo ""
echo "=== Final Cleanup ==="

# Remove asset files if they were copied
if [ -f "$PROJECT_ROOT/assets/shell-customizations.sh" ]; then
    echo "ℹ️  Keeping asset files (they may be part of the installer)"
fi

echo ""
echo "========================================================"
echo "✅ Uninstallation Complete"
echo "========================================================"
echo ""
echo "The following were removed/restored:"
echo "  - CLI tools (native installations)"
echo "  - Command shims"
echo "  - Shell configuration (restored from backup)"
echo ""
echo "You may want to:"
echo "  - Restart your shell"
echo "  - Manually review: $SHELL_CONFIG"
echo "  - Remove this installer directory if no longer needed"
echo ""
