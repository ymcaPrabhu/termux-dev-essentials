# Project Brief: Termux Dev Tools One-Shot Installer

## Executive Summary

This project aims to create a powerful, one-shot installer script to bootstrap a complete development environment in Termux on Android. It addresses the tedious and error-prone process of manual setup by automating the installation of essential prerequisites, a suite of professional command-line interface (CLI) tools, and all necessary configurations. The target users are developers utilizing Android devices, for whom the script will provide a rapid, idempotent, and robust setup experience. The key value proposition is its intelligence: if a tool fails to install natively in Termux, the script will automatically provision an Ubuntu environment via `proot-distro` and install the tool there, ensuring a seamless user experience through command shims.

## Problem Statement

Setting up a comprehensive development environment within Termux is a significant barrier for developers. The process is manual, time-consuming, and fraught with potential errors. Developers must individually install numerous packages, configure authentication for services like GitHub, manage shell environments, and resolve compatibility issues between native Termux and containerized Linux environments. This initial friction wastes valuable development time, discourages the use of Termux for serious projects, and often results in inconsistent or broken environments, especially when attempting to re-run setup scripts that are not idempotent.

## Proposed Solution

The proposed solution is a single, intelligent, and idempotent installer script, invoked via a command like `termex-dev-tools install`. This script will orchestrate the entire setup process from start to finish. It will begin by preparing the Termux environment and idempotently installing core prerequisites like Node.js, Git, and Python. It will then attempt to install a curated list of modern CLI tools. For any tool that fails, the script will automatically install `proot-distro`, create and configure an Ubuntu instance, and install the problematic tool within that container. To maintain a seamless workflow, it will generate wrapper scripts (shims) allowing these containerized tools to be called directly from the Termux shell. The solution will also fully automate GitHub setup, shell customization, and provide robust logging and operational flags like `--dry-run`.

## Target Users

-   **Primary User Segment: Professional Developers**: Software developers who use Termux on Android as a primary or secondary development environment. They are proficient with the command line but value efficiency and desire a stable, "it-just-works" setup to maximize productivity.
-   **Secondary User Segment: Hobbyists & Students**: Individuals learning to code or working on personal projects on their mobile devices. They may be less experienced with manual environment configuration and would benefit greatly from an automated, guided setup process.

## Goals & Success Metrics

### Business Objectives

-   Reduce the setup and onboarding time for a new developer on Termux by over 90%.
-   Increase the viability and adoption of Termux as a professional development environment.

### User Success Metrics

-   A user can transition from a fresh Termux installation to a fully functional, authenticated development environment in under 10 minutes.
-   The installer achieves a greater than 95% success rate on its first run across a variety of Android devices.

### Key Performance Indicators (KPIs)

-   **Time-to-First-Command**: The total time from invoking the installer to successfully running a command from one of the installed CLIs. (Target: < 10 minutes)
-   **Installation Success Rate**: Percentage of installer runs that complete without critical, user-facing errors. (Target: > 95%)
-   **Idempotency Failures**: The number of critical errors encountered when the script is re-run on an existing installation. (Target: 0)

## MVP Scope

### Core Features (Must Have)

-   **Termux Prep**: Auto-detect Termux, request storage access, and configure `PATH` and shell.
-   **Prerequisite Installation**: Idempotent installation of Node.js, npm/npx, Git, OpenSSH, curl, and Python.
-   **CLI Suite Installation**: Install and validate `cloud-code`, `gemini-cli`, `codec-cli`, `open-core-cli`, `factory-ai`, and `droid-cli`.
-   **Proot-Distro Fallback**: On native installation failure, automatically install `proot-distro`, bootstrap Ubuntu, and install the tool within it.
-   **Command Shims**: Create seamless command wrappers in Termux for any tool installed in Ubuntu.
-   **GitHub Automation**: Automate SSH key generation, GitHub authentication (via device code or PAT), and user configuration (name/email).
-   **Repo Management**: Clone a specified bootstrap repository into a predictable path.
-   **Shell Customization**: Safely apply aliases and a custom PS1 for bash/zsh, with backups and rollback.
-   **Operational Flags**: Include `--dry-run` and `--verbose` for visibility and testing.
-   **Health Checks**: Implement post-install checks to verify tool versions, auth status, and paths.
-   **Uninstall Script**: Provide a script to cleanly remove all installed components and configurations.

### Out of Scope for MVP

-   A graphical user interface (GUI).
-   Support for Linux distributions other than Ubuntu within `proot-distro`.
-   Support for any platform other than Termux on Android.
-   Managing graphical development tools or IDEs.

## Post-MVP Vision

-   **Phase 2 Features**: Introduce a configuration file (`install.json` or similar) to allow users to customize the list of CLIs to be installed. Add support for other Git providers like GitLab.
-   **Long-term Vision**: Evolve the script into a comprehensive package manager for Termux development environments, enabling users to easily install, update, manage, and share complex toolchains.
-   **Expansion Opportunities**: Explore the possibility of adapting the installer for other mobile Linux environments, such as iSH on iOS or other Android-based shell environments.

## Technical Considerations

-   **Platform Requirements**:
    -   **Target Platforms:** Termux on Android (non-root).
    -   **OS Support:** Recent versions of Android.
-   **Technology Preferences**:
    -   **Scripting:** Primarily Bash/Zsh for orchestration, potentially using Node.js for more complex logic, API interactions, or cross-platform compatibility.
    -   **Containerization:** `proot-distro` for lightweight, unprivileged Linux environments.
-   **Architecture Considerations**:
    -   **Repository Structure:** A modular design with separate scripts or functions for each major task (e.g., `install_prereqs.sh`, `setup_github.js`, `install_cli_suite.sh`).
    -   **Integration Requirements:** Requires integration with the GitHub API for authentication.

## Constraints & Assumptions

### Constraints

-   The solution **must not** require root privileges.
-   The solution must be deployable via a single `curl | bash` command or similar one-shot mechanism.
-   The timeline and resources are limited to the scope of this project brief.

### Key Assumptions

-   The user has a stable internet connection during the installation process.
-   The user has installed Termux from F-Droid, which is the recommended source for stability.
-   The user possesses basic familiarity with the command line.

## Risks & Open Questions

### Key Risks

-   **Upstream Breakage:** A future update to Termux, Android, or one of the target CLI tools could break the installation logic. (Impact: High)
-   **Authentication Flow Changes:** Changes to GitHub's device-code or PAT authentication flows could break the GitHub setup module. (Impact: Medium)
-   **Network Instability:** Unreliable networks could cause partial or corrupted installations. (Impact: Medium)

### Open Questions

-   What is the most user-friendly and secure GitHub authentication method to prioritize (device flow vs. PAT)?
-   What should the script's default behavior be upon encountering a non-critical error: halt immediately or continue with the remaining steps?
-   How should the generated command shims handle passing complex arguments and STDIN/STDOUT to the containerized tools?

## Next Steps

The following to-do list, structured using the BMAD method, will guide the implementation of this project.

### BMAD To-Do List

**Brief:** The goal is to build a one-shot, idempotent installer for `termex-dev-tools` that provisions a full development environment in Termux, intelligently using a `proot-distro` Ubuntu fallback for incompatible tools. The installer must be non-root and automate prerequisites, CLI installation, GitHub auth, and shell configuration.

**Enumerate:**

1.  **Termux Preparation**:
    -   Task: Create script module to detect Termux, request storage, set `PATH`, and identify shell (bash/zsh).
    -   Command: `bash scripts/prepare-termux.sh`
2.  **Prerequisite Installation**:
    -   Task: Create an idempotent script module to install Node.js, npm, Git, OpenSSH, curl, and Python.
    -   Command: `bash scripts/install-prereqs.sh`
3.  **Proot-Distro & Ubuntu Bootstrap**:
    -   Task: Create a module to install `proot-distro` and bootstrap a minimal Ubuntu instance if it doesn't exist.
    -   Command: `bash scripts/setup-proot.sh`
4.  **CLI Installation Matrix**:
    -   Task: Develop the core logic to iterate through the list of CLIs, attempt native Termux installation, and on failure, install within the Ubuntu proot.
    -   Command: `node scripts/install-cli-suite.js`
5.  **Shim Generation**:
    -   Task: Create a function that generates a Termux-side shell script (shim) for each tool installed in Ubuntu, passing all arguments transparently.
    -   Command: `node scripts/generate-shims.js`
6.  **GitHub Authentication & Setup**:
    -   Task: Create a module to handle SSH key generation, device-code/PAT auth with GitHub, and configure `git`.
    -   Command: `node scripts/setup-github.js`
7.  **Codespaces/Code-Space Validation**:
    -   Task: Add a step to test the connection to GitHub Codespaces or a similar remote environment.
    -   Command: `bash scripts/test-codespaces.sh`
8.  **Shell Customization**:
    -   Task: Create a script to safely back up and apply `.bashrc`/`.zshrc` aliases and a custom PS1.
    -   Command: `bash scripts/apply-shell-config.sh`
9.  **Final Verification Script**:
    -   Task: Build a comprehensive health-check script that runs after installation to verify all components.
    -   Command: `bash scripts/verify-installation.sh`
10. **Uninstall & Cleanup**:
    -   Task: Create a script to remove all installed tools, shims, configs, and cloned repos.
    -   Command: `bash scripts/uninstall.sh`

**Act:** Execute the enumerated tasks sequentially, running checks at each step.

**Measure:** After execution, run the `verify-installation.sh` script. This script will:
-   Check the version of each installed CLI.
-   Attempt a `git auth` and `gh auth status` to verify GitHub access.
-   Confirm the new `PATH` and aliases are active in a new shell.
-   Run a test command for each Ubuntu-installed tool via its shim.

**Escalate:** If any `Measure` step fails:
-   Log the specific failure.
-   Offer to re-run the failed module.
-   If a native install failed and the Ubuntu fallback also failed, suggest opening a bug report.

**Report:** Upon completion, print a concise summary to the console:
-   List of successfully installed CLIs (and their location: Termux/Ubuntu).
-   Status of GitHub authentication.
-   Path to the cloned repository.
-   Location of the uninstall script.
-   A reminder of the rollback plan (e.g., "Your original shell configs were backed up to ~/.bashrc.bak").
