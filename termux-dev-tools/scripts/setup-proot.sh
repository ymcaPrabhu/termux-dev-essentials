#!/bin/bash
set -euo pipefail

echo "Setting up proot-distro Ubuntu environment..."

# Task 1: Check/Install proot-distro
if ! command -v proot-distro >/dev/null 2>&1; then
  echo "🔄 proot-distro not found. Installing..."
  if pkg install -y proot-distro; then
    echo "✅ Successfully installed proot-distro."
  else
    echo "❌ Failed to install proot-distro. Please install it manually."
    exit 1
  fi
else
  echo "✅ proot-distro is already installed."
fi

# Task 2: Check for Existing Ubuntu Instance
echo "Checking for existing Ubuntu installation..."
if proot-distro list | grep -q "ubuntu"; then
  echo "✅ Ubuntu is already installed."
else
  # Task 3: Install Ubuntu
  echo "🔄 Ubuntu not found. Installing..."
  if proot-distro install ubuntu; then
    echo "✅ Successfully installed Ubuntu."
  else
    echo "❌ Failed to install Ubuntu."
    exit 1
  fi
fi

# Task 4: Verify Ubuntu Accessibility
echo "Verifying Ubuntu accessibility..."
if proot-distro login ubuntu -- echo "Success" | grep -q "Success"; then
  echo "✅ Ubuntu is accessible."
else
  echo "❌ Could not verify Ubuntu accessibility."
  exit 1
fi

echo "Proot-distro Ubuntu setup is complete."
