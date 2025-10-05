# GEMINI Project Context

This document provides AI assistants with a comprehensive overview of the `termux-dev-essentials` project.

## Project Overview

This project, `termux-dev-essentials`, is a toolkit for bootstrapping a development environment within Termux on Android. It is designed to simplify fresh installations by providing essential packages, scripts for automation, and integrations with services like GitHub, Twilio, and Vonage.

The core of the project is a Node.js application that includes:
- An SMS management system supporting both Twilio and Vonage for sending messages.
- An Express.js server for handling webhooks from these SMS providers.
- Automation scripts for setting up the development environment and syncing with GitHub.
- A suite of pre-configured development tools for linting, formatting, and testing.

**Key Technologies:**
- **Backend:** Node.js, Express.js
- **SMS Providers:** Twilio, Vonage
- **CLI:** Commander.js, Inquirer.js, Chalk
- **Development Tools:** ESLint, Prettier, Jest, Mocha
- **Environment:** Termux

## Building and Running

### Dependencies

Install all project dependencies using npm:
```bash
npm install
```

### Key Commands

The following scripts are available in `package.json`:

- **`npm run setup`**: Initializes the Termux development environment. While the script currently echoes a simple message, it is intended to create directories and set up `.gitignore`.
- **`npm test`**: Currently configured to output "No tests specified". The project includes testing frameworks like Jest and Mocha, but no tests have been implemented yet.
- **`npm run sync`**: A convenience script to add, commit ("Auto-sync"), and push all local changes to the remote Git repository.
- **`npm run update-all`**: Updates all npm dependencies to their latest versions and runs `npm audit fix` to resolve any vulnerabilities.
- **`npm run codespace`**: Executes a script presumably for connecting to a GitHub Codespace.

### Executable Scripts

The project contains a binary script accessible via `npx`:
- `termux-setup`: Executes `./scripts/setup.js` to perform initial environment setup.

## Development Conventions

- **Code Style:** The project is configured to use **ESLint** for linting and **Prettier** for code formatting. Configuration files for these tools are present in the repository.
- **Environment Variables:** Sensitive information like API keys and tokens for Twilio, Vonage, and GitHub are managed via a `.env` file using the `dotenv` package.
- **Testing:** The project includes **Jest**, **Mocha**, and **Chai** for testing, but a formal test suite has not yet been created. The `examples/example-usage.js` file serves as the primary source for usage demonstration.
- **Documentation:** The `docs/` directory is intended for comprehensive documentation. The `CLAUDE.md` file provides detailed, albeit potentially outdated, context on the project's architecture and features.