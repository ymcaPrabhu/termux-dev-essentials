#!/bin/bash
set -euo pipefail

# List of required packages
PREREQS=("nodejs" "npm" "git" "openssh" "curl" "python")

echo "Checking for prerequisites..."

for pkg in "${PREREQS[@]}"; do
  if command -v "$pkg" >/dev/null 2>&1; then
    echo "✅ $pkg is already installed."
  else
    echo "🔄 $pkg not found. Attempting to install..."
    if pkg install -y "$pkg"; then
      echo "✅ Successfully installed $pkg."
    else
      echo "❌ Failed to install $pkg. Please install it manually and re-run the script."
      exit 1
    fi
  fi
done

echo "All prerequisites are satisfied."
