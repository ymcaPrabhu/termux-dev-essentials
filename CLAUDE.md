# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Termux Development Essentials is a comprehensive toolkit designed for fresh Termux installations, providing SMS/messaging capabilities through multiple providers (Twilio, Vonage), error tracking with Sentry, and automation scripts for GitHub integration and development environment setup.

## Development Commands

### Running the Application
```bash
# Start Express server with Sentry integration
npm start

# Development mode with auto-reload
npm run dev

# Run comprehensive test suite
node tests/run-all-tests.js
```

### Utility Scripts
```bash
# Quick git sync (add, commit, push)
npm run sync

# Update all dependencies and fix vulnerabilities
npm run update-all

# Connect to GitHub Codespaces interactively
npm run codespace

# Purge cache and temporary files
npm run purge
# OR
npm run clean
```

### Testing Individual Components
```bash
# Test Sentry integration
node examples/sentry-test.js

# Test SMS functionality
node examples/example-usage.js

# Run all tests with Sentry logging
node tests/run-all-tests.js
```

## Key Architecture Components

### SMS Provider Abstraction (src/sms-manager.js)
- **Design Pattern**: Provider abstraction with factory initialization
- Supports both **Twilio** and **Vonage** providers through unified API
- Key methods: `sendSMS()`, `checkStatus()`, `listMessages()`, `handleWebhook()`
- Returns standardized response objects: `{success, messageId, status, provider}`
- All API calls use async/await with comprehensive error handling

**Usage Pattern**:
```javascript
const smsManager = new AndroidMessageManager('twilio');
smsManager.initTwilio(accountSid, authToken);
// OR
smsManager.initVonage(apiKey, apiSecret);
```

### Sentry Integration (src/sentry-config.js)
- **Critical**: Must initialize Sentry BEFORE requiring any other modules
- Centralized error tracking and performance monitoring
- Exports: `initSentry()`, `captureError()`, `captureMessage()`, `setUser()`, `addBreadcrumb()`
- Integrated throughout examples and tests for comprehensive error tracking

### Interactive CLI Tools (scripts/)
All scripts use:
- **chalk** for colored terminal output
- **readline** for interactive prompts
- **execSync** with proper error handling
- `#!/usr/bin/env node` shebang for direct execution

**repo-manager.js**: GitHub repository management (list, create, delete)
**codespace-connect.js**: GitHub Codespaces connection with SSH, port forwarding
**purge-cache.js**: Multi-level cache cleaning (pkg, npm, pip, logs, node_modules)

### Testing Infrastructure (tests/run-all-tests.js)
- Comprehensive test suite covering project structure, dependencies, modules
- All test failures automatically logged to Sentry
- Tests run with 3-second delay for Sentry event collection
- Exit code indicates pass/fail status

## Environment Variables

Required variables in `.env` file (see `.env.example`):

```env
# Sentry (required for error tracking)
SENTRY_DSN=your_sentry_dsn_here

# Twilio (for SMS functionality)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_API_KEY=your_twilio_api_key_sid      # For MCP server
TWILIO_API_SECRET=your_twilio_api_secret     # For MCP server

# Vonage (alternative SMS provider)
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret

# GitHub Integration
GITHUB_TOKEN=your_github_token

# Server Configuration
NODE_ENV=development
PORT=3000
```

## Termux-Specific Considerations

- **Environment Detection**: Scripts detect Termux via `process.env.PREFIX`
- **Package Manager**: Uses `pkg` command for Termux package management
- **Paths**: Uses `$PREFIX` (`/data/data/com.termux/files/usr`) and `$HOME` (`/data/data/com.termux/files/home`)
- **Core Packages**: git, nodejs, python are prerequisites for most functionality
- **Cache Locations**: Special handling for Termux cache directories in purge script

## Code Patterns and Conventions

### Error Handling Pattern
All async operations follow this pattern:
```javascript
try {
  const result = await operation();
  if (!result.success) {
    captureMessage('Operation failed', 'warning');
  }
  return result;
} catch (error) {
  captureError(error, { context: 'additional context' });
  throw error; // or handle gracefully
}
```

### Script Execution Pattern
Interactive scripts use class-based architecture:
```javascript
class ToolName {
  constructor() {
    this.rl = readline.createInterface({...});
  }

  async run() {
    // Main execution loop
    while (running) {
      const action = await this.promptAction();
      // Handle actions
    }
    this.rl.close();
  }
}
```

### Express.js Middleware
- Request breadcrumbs added automatically for debugging
- Centralized error handler captures all errors to Sentry
- All routes include try/catch with Sentry integration

## Coding Standards

### Shell Scripts
- Use `set -euo pipefail` for safety
- Follow Google Shell Style Guide
- Must pass `shellcheck` without warnings

### JavaScript/Node.js
- Modern ES6+ features (const/let, arrow functions, async/await)
- JSDoc comments for public functions
- Format with **prettier**, lint with **eslint**
- Avoid `var`, use `const` by default

### Testing
- No formal test framework currently configured (mocha/jest available but not set up)
- Example-based testing in `examples/` directory
- Manual test suite in `tests/run-all-tests.js`

## Important Notes

- **Sentry First**: Always initialize Sentry before other modules in entry points
- **Provider Credentials**: SMS functionality requires valid Twilio or Vonage credentials
- **GitHub CLI**: Several scripts depend on `gh` CLI being installed and authenticated
- **Async Patterns**: All SMS operations are async - always use await or .then()
- **Webhook Middleware**: Express middleware available for SMS webhook handling
