#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const chalk = require('chalk');

class RepoManager {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async getRepos() {
        try {
            console.log(chalk.blue('🔍 Fetching your GitHub repositories...'));
            const output = execSync('gh repo list --json name,description,url', { encoding: 'utf8' });
            return JSON.parse(output);
        } catch (error) {
            console.error(chalk.red('❌ Error fetching repositories:'), error.message);
            console.log(chalk.yellow('💡 Make sure you have gh CLI installed and authenticated:'));
            console.log(chalk.cyan('   gh auth login'));
            process.exit(1);
        }
    }

    displayRepos(repos) {
        if (repos.length === 0) {
            console.log(chalk.yellow('📭 No repositories found.'));
            return;
        }

        console.log(chalk.green('\n📋 Your GitHub Repositories:'));
        console.log(chalk.gray('─'.repeat(80)));

        repos.forEach((repo, index) => {
            console.log(`${chalk.cyan((index + 1).toString().padStart(2))}. ${chalk.white(repo.name)}`);
            console.log(`    ${chalk.gray('Description:')} ${repo.description || 'N/A'}`);
            console.log(`    ${chalk.gray('URL:')} ${repo.url}`);
            console.log();
        });

        console.log(chalk.gray('─'.repeat(80)));
    }

    async deleteRepo() {
        const repos = await this.getRepos();
        this.displayRepos(repos);

        return new Promise((resolve) => {
            this.rl.question(chalk.cyan('\nEnter the number of the repository to delete: '), async (repoNumber) => {
                const repoIndex = parseInt(repoNumber) - 1;
                if (isNaN(repoIndex) || repoIndex < 0 || repoIndex >= repos.length) {
                    console.log(chalk.red('❌ Invalid repository number.'));
                    resolve();
                    return;
                }

                const repoToDelete = repos[repoIndex];

                this.rl.question(chalk.yellow(`\nAre you sure you want to delete the repository '${repoToDelete.name}'? (y/n): `), async (confirmation) => {
                    if (confirmation.toLowerCase() === 'y') {
                        try {
                            console.log(chalk.blue(`\nDeleting repository '${repoToDelete.name}'...`));
                            execSync(`gh repo delete ${repoToDelete.name} --yes`, { encoding: 'utf8' });
                            console.log(chalk.green('\n✅ Repository deleted successfully!'));
                        } catch (error) {
                            console.error(chalk.red('\n❌ Error deleting repository:'), error.message);
                        }
                    }
                    resolve();
                });
            });
        });
    }

    async promptAction() {
        return new Promise((resolve) => {
            console.log(chalk.cyan('\n🤔 What would you like to do?'));
            console.log('   1. List repositories');
            console.log('   2. Create a new repository');
            console.log('   3. Delete a repository');
            this.rl.question(chalk.cyan('   Select an action (1-3) or \'q\' to quit: '), (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async run() {
        console.log(chalk.bold.cyan('🌟 GitHub Repo Manager'));
        console.log(chalk.gray('Manage your repositories quickly\n'));

        let running = true;
        while (running) {
            const action = await this.promptAction();

            switch (action) {
                case '1':
                    const repos = await this.getRepos();
                    this.displayRepos(repos);
                    break;
                case '2':
                    await this.createRepo();
                    break;
                case '3':
                    await this.deleteRepo();
                    break;
                case 'q':
                    running = false;
                    break;
                default:
                    console.log(chalk.red('❌ Invalid action. Please try again.'));
                    break;
            }
        }

        this.rl.close();
    }
}

if (require.main === module) {
    const manager = new RepoManager();
    manager.run().catch(console.error);
}

module.exports = RepoManager;
