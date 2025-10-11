# Technology Stack

This document outlines the key technologies and languages used in the `termux-dev-tools` project.

### Orchestration Language: Shell Script (Bash/Zsh)

-   **Rationale:** Shell scripting is the most direct and native way to perform system-level tasks in a terminal environment, such as managing packages (`pkg`), modifying paths, and creating files. We will ensure compatibility with both Bash and Zsh, the most common shells in this context.

### Complex Logic & Process Management: Node.js

-   **Rationale:** For more complex tasks, such as the logic for the CLI installation matrix (including the native vs. proot fallback) and potential API interactions (e.g., with GitHub), Node.js provides a more robust, maintainable, and testable environment than convoluted shell scripts.

### Containerization: `proot-distro`

-   **Rationale:** `proot-distro` is the ideal choice for running a sandboxed Linux environment (specifically Ubuntu) within Termux. It does not require root access and is the core technology enabling the fallback mechanism for tools that are not natively compatible with the Termux environment.

### Core Dependencies

These are the foundational packages the installer script will manage:

-   `git`: For all version control and repository management tasks.
-   `curl`: For downloading resources from the web.
-   `openssh`: To handle secure authentication with GitHub.
-   `python`: A common runtime dependency for many development tools.
-   `npm`: For managing Node.js packages and installing some of the required CLI tools globally.

### Code Quality & Formatting

To ensure a high-quality and maintainable codebase, we will use the following tools:

-   `eslint`: To enforce consistent JavaScript code standards and catch common errors.
-   `prettier`: To automatically maintain a consistent code format across the project for all relevant file types.
