# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Termux development essentials toolkit - a comprehensive collection of npm packages and tools specifically designed for setting up fresh Termux installations with Claude and GitHub integration. The project focuses on providing SMS/messaging capabilities through multiple providers (Twilio, Vonage) and includes automation scripts for development environment setup.

## Key Architecture Components

### Core SMS Management System
- **`termux-dev-tools/src/sms-manager.js`** - Main SMS management class supporting both Twilio and Vonage providers
- Implements provider abstraction pattern allowing easy switching between SMS services
- Provides unified API for sending SMS, checking status, and handling webhooks
- Includes Express.js middleware for webhook handling

### Setup and Automation Scripts
- **`termux-dev-tools/scripts/setup.js`** - Environment setup automation for Termux
- **`termux-dev-tools/scripts/github-sync.js`** - Interactive GitHub repository setup and sync
- Both scripts use chalk for colorized terminal output and include comprehensive error handling

## Development Commands

### Environment Setup
```bash
# Setup development environment (creates directories, .gitignore, etc.)
npm run setup

# Interactive GitHub repository setup and sync
node scripts/github-sync.js
# OR
npm run sync
```

### Package Management
```bash
# Install dependencies
npm install

# Update all packages and fix vulnerabilities
npm run update-all
```

### Available CLI Tools
After installation, these tools are available via `npx` or from `node_modules/.bin/`:
- `codex` - Generate code documentation
- `mocha` - Run JavaScript tests
- `eslint` - Lint JavaScript code
- `prettier` - Format code
- `jest` - Run tests
- `nodemon` - Development server with auto-restart

## Provider Configuration

### SMS Provider Setup
The project supports two SMS providers that require different initialization:

**Twilio Configuration:**
```javascript
const smsManager = new AndroidMessageManager('twilio');
smsManager.initTwilio('ACCOUNT_SID', 'AUTH_TOKEN');
```

**Vonage Configuration:**
```javascript
const smsManager = new AndroidMessageManager('vonage');
smsManager.initVonage('API_KEY', 'API_SECRET');
```

## Environment Variables

The project expects these environment variables (create `.env` file):
```env
# SMS Provider Credentials
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret

# GitHub Integration
GITHUB_TOKEN=your_github_token

# Development Settings
NODE_ENV=development
PORT=3000
```

## Code Style and Patterns

### SMS Manager Class Pattern
- Uses factory pattern for provider initialization
- Implements async/await for all API calls
- Returns standardized response objects with `success`, `messageId`, `status`, `provider` fields
- Includes comprehensive error handling with try/catch blocks

### Script Architecture
- All scripts include `#!/usr/bin/env node` shebang for direct execution
- Use `execSync` for shell command execution with proper error handling
- Implement colored terminal output using chalk library
- Include interactive prompts using readline interface

## Project Structure

```
termux-dev-tools/
├── src/
│   └── sms-manager.js          # Core SMS management class
├── scripts/
│   ├── setup.js                # Environment setup automation
│   └── github-sync.js          # GitHub integration script
├── examples/
│   └── example-usage.js        # Usage examples for SMS manager
├── docs/
│   ├── README.md               # Comprehensive documentation
│   └── CLAUDE.md               # Previous version (outdated)
├── package.json                # Dependencies and npm scripts
└── package-lock.json           # Dependency lock file
```

## Dependencies

### Core Dependencies
- **axios, lodash, moment** - Utility libraries for HTTP requests, data manipulation, and date handling
- **chalk, inquirer, commander** - CLI interaction and formatting
- **express, cors** - Web server framework and CORS handling
- **@vonage/server-sdk, twilio** - SMS provider SDKs
- **github** - GitHub API client
- **dotenv** - Environment variable management

### Development Dependencies
- **eslint, prettier** - Code linting and formatting
- **jest, mocha, chai, supertest** - Testing frameworks and utilities
- **typescript, ts-node, @types/node** - TypeScript support
- **nodemon** - Development server with auto-restart

## Termux-Specific Considerations

- The setup script detects Termux environment via `process.env.PREFIX`
- Automatically installs essential Termux packages: `git`, `nodejs`, `python`
- Creates standard project directories: `src`, `test`, `docs`, `.github/workflows`
- Generates comprehensive `.gitignore` for Node.js projects
- Includes Termux-specific package management commands using `pkg`

## Testing and Examples

- **`examples/example-usage.js`** demonstrates both Twilio and Vonage implementations
- Includes Express.js webhook server example for receiving SMS
- Examples show proper initialization, sending SMS, status checking, and message listing
- No formal test suite currently implemented (test commands output "No tests specified")