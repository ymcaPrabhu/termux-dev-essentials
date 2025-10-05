# Termux Development Essentials

A comprehensive collection of npm packages and tools for setting up a fresh Termux installation with Claude and GitHub integration.

## 🚀 Quick Start

### Fresh Termux Installation

1. **Install Node.js and Git in Termux:**
   ```bash
   pkg update && pkg upgrade
   pkg install nodejs git python
   ```

2. **Clone and setup this project:**
   ```bash
   git clone <your-repo-url>
   cd termux-dev-essentials
   npm install
   npm run setup
   ```

3. **Configure Git (if not already done):**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

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

```bash
# Setup development environment
npm run setup

# Quick sync to GitHub
npm run sync

# Update all packages and fix vulnerabilities
npm run update-all

# Run interactive GitHub setup
node scripts/github-sync.js
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