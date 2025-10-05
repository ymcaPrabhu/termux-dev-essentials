#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function runCommand(command) {
    try {
        const output = execSync(command, { encoding: 'utf8' });
        return output.trim();
    } catch (error) {
        throw new Error(`Command failed: ${error.message}`);
    }
}

async function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function setupGitHubSync() {
    console.log(chalk.blue.bold('🔗 GitHub Repository Sync Setup'));

    try {
        // Check if we're in a git repository
        const isGitRepo = runCommand('git rev-parse --is-inside-work-tree 2>/dev/null || echo "false"') === 'true';

        if (!isGitRepo) {
            console.log(chalk.yellow('Initializing git repository...'));
            runCommand('git init');
        }

        // Check for existing remote
        let hasRemote = false;
        try {
            runCommand('git remote get-url origin');
            hasRemote = true;
            console.log(chalk.green('✓ GitHub remote already configured'));
        } catch {
            console.log(chalk.yellow('No GitHub remote found'));
        }

        if (!hasRemote) {
            const repoUrl = await promptUser('Enter your GitHub repository URL: ');
            if (repoUrl) {
                runCommand(`git remote add origin ${repoUrl}`);
                console.log(chalk.green('✓ GitHub remote added'));
            }
        }

        // Check for staged changes
        const status = runCommand('git status --porcelain');
        if (status) {
            console.log(chalk.cyan('Staging all changes...'));
            runCommand('git add .');

            const commitMessage = await promptUser('Enter commit message (or press Enter for default): ');
            const message = commitMessage || `Setup: Initial Termux development environment - ${new Date().toISOString()}`;

            runCommand(`git commit -m "${message}"`);
            console.log(chalk.green('✓ Changes committed'));
        }

        // Push to GitHub
        const shouldPush = await promptUser('Push to GitHub now? (y/n): ');
        if (shouldPush.toLowerCase() === 'y' || shouldPush.toLowerCase() === 'yes') {
            try {
                runCommand('git push -u origin main 2>/dev/null || git push -u origin master');
                console.log(chalk.green('✓ Successfully pushed to GitHub'));
            } catch (error) {
                console.log(chalk.red('✗ Push failed. You may need to authenticate with GitHub first.'));
                console.log(chalk.gray('Try: gh auth login (if you have GitHub CLI installed)'));
            }
        }

    } catch (error) {
        console.log(chalk.red(`Error: ${error.message}`));
    } finally {
        rl.close();
    }
}

setupGitHubSync();