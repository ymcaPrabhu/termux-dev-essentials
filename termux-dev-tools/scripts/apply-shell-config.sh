#!/bin/bash
set -euo pipefail

# BMad Story 1.8: Shell Customization
# Applies helpful aliases and custom PS1 to user's shell configuration

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CUSTOMIZATIONS_FILE="$SCRIPT_DIR/../assets/shell-customizations.sh"

# Detect shell configuration file
SHELL_CONFIG=""
if [[ "$SHELL" == *"bash"* ]]; then
    SHELL_CONFIG="$HOME/.bashrc"
    echo "[INFO] Bash shell detected."
elif [[ "$SHELL" == *"zsh"* ]]; then
    SHELL_CONFIG="$HOME/.zshrc"
    echo "[INFO] Zsh shell detected."
else
    echo "[ERROR] Unsupported shell: $SHELL"
    exit 1
fi

# Task 4: Verify backup exists
BACKUP_EXISTS=false
for backup in "$SHELL_CONFIG"*.bak; do
    if [ -f "$backup" ]; then
        BACKUP_EXISTS=true
        echo "[INFO] Backup found: $backup"
        break
    fi
done

if [ "$BACKUP_EXISTS" = false ]; then
    echo "[WARNING] No backup found for $SHELL_CONFIG"
    echo "[INFO] Creating backup now..."
    TIMESTAMP=$(date +%Y%m%d%H%M%S)
    cp "$SHELL_CONFIG" "${SHELL_CONFIG}.${TIMESTAMP}.bak"
fi

# Task 2: User Prompt
echo ""
echo "=== Shell Customization ==="
echo "This will add helpful aliases and an informative prompt to your shell."
echo ""
read -p "Do you want to apply shell customizations? (y/N): " apply_custom

if [[ ! "$apply_custom" =~ ^[Yy]$ ]]; then
    echo "[INFO] Shell customizations skipped."
    exit 0
fi

# Task 1: Ensure customizations file exists
if [ ! -f "$CUSTOMIZATIONS_FILE" ]; then
    echo "[ERROR] Customizations file not found: $CUSTOMIZATIONS_FILE"
    exit 1
fi

# Task 3: Apply customizations idempotently
MARKER="# BEGIN BMad Shell Customizations"

if grep -q "$MARKER" "$SHELL_CONFIG"; then
    echo "[INFO] Shell customizations already applied."
else
    echo "[INFO] Applying shell customizations to $SHELL_CONFIG..."
    cat >> "$SHELL_CONFIG" << EOF

$MARKER
source "$CUSTOMIZATIONS_FILE"
# END BMad Shell Customizations
EOF
    echo "[SUCCESS] Shell customizations applied."
    echo "[INFO] Please restart your shell or run: source $SHELL_CONFIG"
fi
