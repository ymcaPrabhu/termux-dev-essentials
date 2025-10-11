#!/data/data/com.termux/files/usr/bin/env bash

# ==============================================================================
# BMad Story 1.1: Termux Environment Preparation
#
# Task 1: Environment Verification
# This script prepares the Termux environment for the installer.
# ==============================================================================

set -euo pipefail

# --- Task 1: Environment Verification --- 
if [ -z "${PREFIX:=""}" ]; then
    echo "[ERROR] This script appears to be running outside of the Termux environment. The \$PREFIX variable is not set."
    echo "Please run this installer within the Termux app."
    exit 1
fi

echo "[SUCCESS] Termux environment verified."

# --- Task 2: Storage Permission Check ---
if [ ! -d "$HOME/storage" ]; then
    echo "[ERROR] Termux storage permission not granted."
    echo "Please run 'termux-setup-storage' and grant permission, then re-run this script."
    exit 1
fi

echo "[SUCCESS] Storage permissions verified."

# --- Task 3: Shell Detection ---
SHELL_CONFIG=""
if [[ "$SHELL" == *"bash"* ]]; then
    SHELL_CONFIG="$HOME/.bashrc"
    echo "[INFO] Bash shell detected."
elif [[ "$SHELL" == *"zsh"* ]]; then
    SHELL_CONFIG="$HOME/.zshrc"
    echo "[INFO] Zsh shell detected."
else
    echo "[ERROR] Unsupported shell detected: $SHELL. This script supports bash and zsh."
    exit 1
fi

# --- Task 4: Configuration Backup ---
if [ -f "$SHELL_CONFIG" ]; then
    TIMESTAMP=$(date +%Y%m%d%H%M%S)
    BACKUP_FILE="${SHELL_CONFIG}.${TIMESTAMP}.bak"
    echo "[INFO] Backing up existing configuration to $BACKUP_FILE..."
    cp "$SHELL_CONFIG" "$BACKUP_FILE"
    echo "[SUCCESS] Backup created."
fi

# --- Task 5: PATH Modification ---
INSTALL_DIR="$(pwd)" # Assuming the script is run from the project root
BMAD_PATH_LINE="export PATH=\"$INSTALL_DIR/scripts:\$PATH\" # Added by BMad Installer"

if ! grep -q "# Added by BMad Installer" "$SHELL_CONFIG"; then
    echo "[INFO] Adding BMad scripts to PATH in $SHELL_CONFIG..."
    echo -e "\n# --- BMad Installer ---
$BMAD_PATH_LINE" >> "$SHELL_CONFIG"
    echo "[SUCCESS] PATH updated. Please restart your shell or source the config file."
else
    echo "[INFO] BMad PATH already configured."
fi
