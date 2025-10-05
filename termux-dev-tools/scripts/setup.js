#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue.bold('🚀 Termux Development Environment Setup'));
console.log(chalk.gray('Setting up essential tools for Claude and GitHub integration...\n'));

// Check if we're in Termux
const isTermux = process.env.PREFIX && process.env.PREFIX.includes('com.termux');
if (isTermux) {
    console.log(chalk.green('✓ Termux environment detected'));
} else {
    console.log(chalk.yellow('⚠ Not running in Termux - some features may not work'));
}

// Function to run command safely
function runCommand(command, description) {
    try {
        console.log(chalk.cyan(`Running: ${description}`));
        execSync(command, { stdio: 'inherit' });
        console.log(chalk.green(`✓ ${description} completed\n`));
    } catch (error) {
        console.log(chalk.red(`✗ ${description} failed: ${error.message}\n`));
    }
}

// Update package database (Termux specific)
if (isTermux) {
    runCommand('pkg update -y', 'Updating Termux packages');
    runCommand('pkg install -y git nodejs python', 'Installing essential packages');
}

// Setup git if not configured
try {
    execSync('git config --global user.name', { stdio: 'pipe' });
} catch {
    console.log(chalk.yellow('Setting up Git configuration...'));
    console.log('Please run: git config --global user.name "Your Name"');
    console.log('Please run: git config --global user.email "your.email@example.com"');
}

// Create common directories
const dirs = ['src', 'test', 'docs', '.github/workflows'];
dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(chalk.green(`✓ Created directory: ${dir}`));
    }
});

// Create .gitignore if it doesn't exist
const gitignorePath = path.join(process.cwd(), '.gitignore');
if (!fs.existsSync(gitignorePath)) {
    const gitignoreContent = `
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Build directories
dist/
build/
`.trim();

    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log(chalk.green('✓ Created .gitignore file'));
}

console.log(chalk.blue.bold('\n🎉 Setup completed!'));
console.log(chalk.gray('Your Termux development environment is ready for Claude and GitHub integration.'));
console.log(chalk.gray('\nUseful commands:'));
console.log(chalk.cyan('  npm run sync    - Quick git add, commit, and push'));
console.log(chalk.cyan('  npm run update-all - Update all packages and fix vulnerabilities'));