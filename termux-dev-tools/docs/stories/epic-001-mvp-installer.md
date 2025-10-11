# Epic 1: MVP Core Installer Functionality

## Goal

To build and deliver the Minimum Viable Product of the `termex-dev-tools` one-shot installer. This will provide users with a fully automated, idempotent, and robust development environment setup within Termux, drastically reducing manual configuration and setup time.

## Description

This epic covers the end-to-end creation of the core installer script. It addresses the primary pain point of tedious and error-prone manual setup in Termux. The solution is a single, intelligent script that installs all prerequisites and a suite of CLI tools, with a fallback to a `proot-distro` Ubuntu environment for any incompatible tools. This epic encompasses all functionality required to go from a fresh Termux instance to a ready-to-code environment.

## Core Features (User Stories to be Created)

-   **Story 1: Termux Environment Preparation**: As a user, I want the installer to automatically detect my Termux environment, request necessary permissions (like storage), and configure my shell environment (`PATH`) so that the installer can run correctly.
-   **Story 2: Prerequisite Installation**: As a user, I want the installer to idempotently install all necessary prerequisite tools (Node.js, npm, Git, OpenSSH, curl, Python) so that the core CLI tools can be installed.
-   **Story 3: Proot-Distro & Ubuntu Bootstrap**: As a user, I want the installer to automatically set up a `proot-distro` Ubuntu instance if it's needed as a fallback, so that incompatible tools have a place to be installed.
-   **Story 4: CLI Suite Installation**: As a user, I want the installer to install a specific suite of CLI tools (`cloud-code`, `gemini-cli`, etc.), so that I have my required development tools available.
-   **Story 5: Command Shim Generation**: As a user, if a tool is installed in Ubuntu, I want a seamless command shim created in my Termux environment, so that I can call the tool directly without entering the proot shell.
-   **Story 6: GitHub Automation**: As a user, I want the installer to automate my GitHub setup (SSH keys, auth, git config), so that I can immediately interact with my repositories.
-   **Story 7: Repository Cloning**: As a user, I want the installer to clone my specified bootstrap repository, so that my project files are in a predictable location.
-   **Story 8: Shell Customization**: As a user, I want the installer to safely apply helpful aliases and a custom shell prompt (PS1), so that my shell is more informative and user-friendly.
-   **Story 9: Operational Flags**: As a developer running the installer, I want `--dry-run` and `--verbose` flags so that I can test and debug the installation process.
-   **Story 10: Health Checks & Verification**: As a user, I want the installer to run a final health check, so that I can be confident that all components were installed and configured correctly.
-   **Story 11: Uninstallation**: As a user, I want a clean uninstall script, so that I can easily remove the installed environment if I need to.

## Definition of Done

-   [ ] All user stories listed above are completed and meet their individual acceptance criteria.
-   [ ] The installer script runs from start to finish without critical errors on a fresh Termux instance.
-   [ ] All specified CLI tools are executable from the Termux prompt.
-   [ ] GitHub authentication is successful.
-   [ ] The entire process is idempotent and can be re-run without causing errors.
-   [ ] The uninstall script successfully removes all created files, configurations, and shims.
