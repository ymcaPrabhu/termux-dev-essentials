#!/bin/sh
set -euo pipefail

# Define the list of prerequisite packages
PREREQS=('nodejs' 'npm' 'git' 'openssh' 'curl' 'python')

echo "Checking for prerequisite packages..."

for pkg in "${PREREQS[@]}"; do
  if command -v "$pkg" >/dev/null 2>&1; then
    echo "✅ '$pkg' is already installed."
  else
    echo "🔄 '$pkg' not found. Attempting to install..."
    if pkg install -y "$pkg"; then
      if command -v "$pkg" >/dev/null 2>&1; then
        echo "✅ Successfully installed '$pkg'."
      else
        echo "❌ ERROR: Installation of '$pkg' reported success, but the command is still not found." >&2
        exit 1
      fi
    else
      echo "❌ ERROR: Failed to install '$pkg'." >&2
      exit 1
    fi
  fi
done

echo "All prerequisite checks passed."