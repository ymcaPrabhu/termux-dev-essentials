#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const chalk = require('chalk');

class CodespaceConnector {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async getCodespaces() {
        try {
            console.log(chalk.blue('🔍 Fetching your GitHub Codespaces...'));
            const output = execSync('gh codespace list --json name,state,repository,displayName', { encoding: 'utf8' });
            return JSON.parse(output);
        } catch (error) {
            console.error(chalk.red('❌ Error fetching codespaces:'), error.message);
            console.log(chalk.yellow('💡 Make sure you have gh CLI installed and authenticated:'));
            console.log(chalk.cyan('   gh auth login'));
            process.exit(1);
        }
    }

    displayCodespaces(codespaces) {
        if (codespaces.length === 0) {
            console.log(chalk.yellow('📭 No codespaces found.'));
            console.log(chalk.cyan('💡 Create one at: https://github.com/codespaces'));
            return false;
        }

        console.log(chalk.green('\n📋 Your GitHub Codespaces:'));
        console.log(chalk.gray('─'.repeat(80)));

        codespaces.forEach((codespace, index) => {
            const statusColor = codespace.state === 'Available' ? 'green' :
                               codespace.state === 'Starting' ? 'yellow' : 'red';

            console.log(`${chalk.cyan((index + 1).toString().padStart(2))}. ${chalk.white(codespace.displayName || codespace.name)}`);
            console.log(`    ${chalk.gray('Repository:')} ${codespace.repository}`);
            console.log(`    ${chalk.gray('Status:')} ${chalk[statusColor](codespace.state)}`);
            console.log();
        });

        console.log(chalk.gray('─'.repeat(80)));
        return true;
    }

    async promptSelection(maxOptions) {
        return new Promise((resolve) => {
            this.rl.question(chalk.cyan(`\n🚀 Select a codespace (1-${maxOptions}) or 'q' to quit: `), (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async promptAction() {
        return new Promise((resolve) => {
            console.log(chalk.cyan('\n🤔 What would you like to do?'));
            console.log('   1. Connect via SSH');
            console.log('   2. View forwarded ports');
            this.rl.question(chalk.cyan('   Select an action (1-2) or \'q\' to quit: '), (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async getForwardedPorts(codespace) {
        if (codespace.state !== 'Available') {
            console.log(chalk.yellow(`\n⏳ Codespace is ${codespace.state}. It must be running to view ports.`));
            return null;
        }
        try {
            console.log(chalk.blue(`\n🔍 Fetching ports for: ${codespace.displayName || codespace.name}...`));
            const output = execSync(`gh codespace ports --json --codespace ${codespace.name}`, { encoding: 'utf8' });
            return JSON.parse(output);
        } catch (error) {
            console.error(chalk.red('❌ Error fetching ports:'), error.message);
            return null;
        }
    }

    displayPorts(ports) {
        if (!ports || ports.length === 0) {
            console.log(chalk.yellow('📭 No forwarded ports found for this codespace.'));
            return;
        }

        console.log(chalk.green('\n🔗 Forwarded Ports:'));
        console.log(chalk.gray('─'.repeat(80)));

        ports.forEach(port => {
            console.log(`${chalk.white(port.source_port)} -> ${chalk.cyan(port.url)}`);
            console.log(`    ${chalk.gray('Label:')} ${port.label}`);
            console.log(`    ${chalk.gray('Visibility:')} ${port.visibility}`);
            console.log();
        });

        console.log(chalk.gray('─'.repeat(80)));
    }

    async connectToCodespace(codespace) {
        try {
            console.log(chalk.blue(`\n🔌 Connecting to: ${codespace.displayName || codespace.name}...`));

            if (codespace.state !== 'Available') {
                console.log(chalk.yellow(`⏳ Codespace is ${codespace.state}. Starting it up...`));
            }

            // Reset terminal attributes before SSH connection
            process.stdout.write('\x1b[0m'); // Reset all terminal attributes

            execSync(`gh codespace ssh --codespace ${codespace.name}`, {
                stdio: 'inherit',
                encoding: 'utf8'
            });

            // Reset terminal after SSH session ends
            execSync('reset || tput reset', { stdio: 'inherit' });
        } catch (error) {
            console.error(chalk.red('❌ Error connecting to codespace:'), error.message);
            // Ensure terminal is reset even on error
            try {
                execSync('reset || tput reset', { stdio: 'inherit' });
            } catch (resetError) {
                // Ignore reset errors
            }
            process.exit(1);
        }
    }

    async run() {
        try {
            console.log(chalk.bold.cyan('🌟 GitHub Codespaces Connector'));
            console.log(chalk.gray('Manage your development environments quickly\n'));

            const codespaces = await this.getCodespaces();

            if (!this.displayCodespaces(codespaces)) {
                this.rl.close();
                return;
            }

            let running = true;
            while (running) {
                const selection = await this.promptSelection(codespaces.length);

                if (selection.toLowerCase() === 'q') {
                    console.log(chalk.yellow('👋 Goodbye!'));
                    running = false;
                    continue;
                }

                const index = parseInt(selection) - 1;
                if (isNaN(index) || index < 0 || index >= codespaces.length) {
                    console.log(chalk.red('❌ Invalid selection. Please try again.'));
                    continue;
                }

                const selectedCodespace = codespaces[index];
                let actionRunning = true;

                while(actionRunning) {
                    const action = await this.promptAction();

                    switch (action) {
                        case '1':
                            await this.connectToCodespace(selectedCodespace);
                            actionRunning = false;
                            running = false;
                            break;
                        case '2':
                            const ports = await this.getForwardedPorts(selectedCodespace);
                            this.displayPorts(ports);
                            // We can loop back to the action menu after this
                            break;
                        case 'q':
                             actionRunning = false; // exit action menu, go back to codespace list
                             break;
                        default:
                            console.log(chalk.red('❌ Invalid action. Please try again.'));
                            break;
                    }
                }
            }
        } catch (error) {
            console.error(chalk.red('❌ Unexpected error:'), error.message);
            process.exit(1);
        } finally {
            if (!this.rl.closed) {
                this.rl.close();
            }
        }
    }
}

if (require.main === module) {
    const connector = new CodespaceConnector();
    connector.run().catch(console.error);
}

module.exports = CodespaceConnector;