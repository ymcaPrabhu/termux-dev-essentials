# Termux Development Essentials

A comprehensive one-shot installer for setting up a complete development environment in Termux on Android. Includes SMS/messaging capabilities, error tracking, GitHub integration, and automated CLI tool installation with intelligent proot-distro fallback.

## 🚀 Quick Start - One-Shot Installation

### Method 1: Run the Full Installer (Recommended)

```bash
# 1. Install prerequisites
pkg update && pkg upgrade
pkg install nodejs git python

# 2. Clone this repository
git clone <your-repo-url>
cd termux-dev-tools

# 3. Install npm dependencies
npm install

# 4. Run the one-shot installer
bash scripts/install.sh

# Or with options:
bash scripts/install.sh --verbose           # Detailed logging
bash scripts/install.sh --dry-run           # Preview without changes
bash scripts/install.sh --yes --dry-run     # Auto-approve preview
```

### Method 2: Use NPM Global Install (After setup)

```bash
npm install -g .
termux-dev-install              # Run full installation
termux-dev-verify               # Verify installation
termux-dev-uninstall            # Uninstall everything
```

## 📋 What Gets Installed

The one-shot installer performs these steps automatically:

1. **Termux Preparation** - Environment detection, storage permissions, PATH configuration
2. **Prerequisite Installation** - nodejs, npm, git, openssh, curl, python
3. **Proot-Distro Setup** - Ubuntu container for incompatible tools (optional)
4. **CLI Tools** - Development CLIs with automatic native/proot fallback
5. **GitHub Setup** - SSH key generation, authentication, git configuration
6. **Repository Cloning** - Your project repository in ~/projects
7. **Shell Customization** - Helpful aliases and informative PS1 prompt
8. **Verification** - Comprehensive health checks

## 📦 Included Packages

### Core Dependencies
- **axios** - HTTP client for API requests
- **lodash** - Utility library for data manipulation
- **moment** - Date/time manipulation
- **chalk** - Terminal string styling
- **inquirer** - Interactive command line prompts
- **commander** - Command-line interface framework
- **express** - Web application framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable loading
- **fs-extra** - Extended file system operations
- **glob** - File pattern matching
- **cross-env** - Cross-platform environment scripts
- **concurrently** - Run multiple commands concurrently

### Communication & APIs
- **github** - GitHub API client
- **@vonage/server-sdk** - Vonage/Nexmo API
- **twilio** - Twilio API for SMS/voice

### Documentation & Code Tools
- **codex** & **codex-cli** - Code documentation generation

### Development Tools (DevDependencies)
- **nodemon** - Auto-restart development server
- **eslint** - JavaScript linting
- **prettier** - Code formatting
- **jest** & **mocha** - Testing frameworks
- **chai** & **supertest** - Testing utilities
- **typescript** & **ts-node** - TypeScript support
- **@types/node** - Node.js type definitions

## 🛠️ Available Scripts

### Installer Scripts

```bash
# Full one-shot installation
bash scripts/install.sh
bash scripts/install.sh --dry-run --verbose

# Individual components
bash scripts/prepare-termux.sh       # Step 1: Termux prep
bash scripts/install-prereqs.sh      # Step 2: Prerequisites
bash scripts/setup-proot.sh          # Step 3: Proot setup
node scripts/install-cli-suite.js    # Step 4: CLI tools
node scripts/setup-github.js         # Step 5: GitHub auth
node scripts/clone-repo.js           # Step 6: Clone repo
bash scripts/apply-shell-config.sh   # Step 7: Shell config
bash scripts/verify-installation.sh  # Step 8: Verification

# Utility scripts
bash scripts/uninstall.sh            # Complete uninstallation
node scripts/generate-shims.js       # Manage proot shims
```

### NPM Scripts

```bash
# Start Sentry-enabled Express server
npm start

# Development mode with auto-reload
npm run dev

# Run all tests
node tests/run-all-tests.js

# Quick sync to GitHub
npm run sync

# Update all packages
npm run update-all

# GitHub Codespaces connection
npm run codespace

# Clean cache
npm run clean
```

## 🔧 CLI Tools

After installation, these tools are available via `npx` or from `node_modules/.bin/`:

- `codex` - Generate code documentation
- `mocha` - Run JavaScript tests
- `eslint` - Lint JavaScript code
- `prettier` - Format code
- `jest` - Run tests
- `nodemon` - Development server with auto-restart

## 📱 Termux-Specific Features

### Storage Access
```bash
# Allow Termux to access device storage
termux-setup-storage
```

### Useful Termux Packages
```bash
# Additional useful packages for development
pkg install vim curl wget openssh rsync zip unzip
```

### SSH Key Generation
```bash
# Generate SSH key for GitHub
ssh-keygen -t ed25519 -C "your.email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copy the output and add to GitHub SSH keys
```

## 🔗 GitHub Integration

### Initial Repository Setup
1. Create a new repository on GitHub
2. Run the GitHub sync script:
   ```bash
   node scripts/github-sync.js
   ```
3. Follow the prompts to connect your local repository

### Authentication Options

#### Option 1: SSH (Recommended)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Test connection
ssh -T git@github.com
```

#### Option 2: GitHub CLI
```bash
# Install GitHub CLI (if available)
pkg install gh

# Authenticate
gh auth login
```

#### Option 3: Personal Access Token
1. Create a Personal Access Token on GitHub
2. Use HTTPS URLs with token authentication
3. Store token in `.env` file (never commit this!)

## 🌟 Claude Integration

This setup is optimized for working with Claude Code. The package.json includes:

- **Comprehensive tooling** for modern JavaScript/TypeScript development
- **API clients** for external services integration
- **Testing frameworks** for reliable code
- **Code quality tools** for maintainable code
- **Build utilities** for deployment

### Environment Variables

Create a `.env` file for sensitive configuration:

```env
# API Keys (never commit this file!)
GITHUB_TOKEN=your_github_token
VONAGE_API_KEY=your_vonage_key
TWILIO_ACCOUNT_SID=your_twilio_sid

# Development settings
NODE_ENV=development
PORT=3000
```

## 📁 Project Structure

```
termux-dev-essentials/
├── scripts/
│   ├── setup.js           # Environment setup script
│   └── github-sync.js     # GitHub integration script
├── src/                   # Source code directory
├── test/                  # Test files
├── docs/                  # Documentation
├── .github/workflows/     # GitHub Actions
├── package.json           # Dependencies and scripts
├── .gitignore            # Git ignore patterns
├── .env.example          # Environment template
└── README.md             # This file
```

## 🔍 Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   ```bash
   chmod +x scripts/*.js
   ```

2. **Git Authentication Issues**
   ```bash
   # Check your SSH key
   ssh -T git@github.com

   # Or use HTTPS with token
   git remote set-url origin https://token@github.com/username/repo.git
   ```

3. **Package Installation Failures**
   ```bash
   # Clear npm cache
   npm cache clean --force

   # Update npm
   npm install -g npm@latest
   ```

4. **Termux Storage Issues**
   ```bash
   # Allow storage access
   termux-setup-storage

   # Check available space
   df -h
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own Termux setups!

---

**Happy coding in Termux! 🎉**