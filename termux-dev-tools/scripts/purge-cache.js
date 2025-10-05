#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const chalk = require('chalk');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(chalk.red.bold('🗑️  Termux Cache & Temporary Files Purge Script'));
console.log(chalk.yellow('This script will help clean up unnecessary files and free up storage\n'));

// Check if we're in Termux
const isTermux = process.env.PREFIX && process.env.PREFIX.includes('com.termux');
if (!isTermux) {
    console.log(chalk.yellow('⚠ Warning: Not running in Termux - some features may not work correctly'));
}

const PREFIX = process.env.PREFIX || '/data/data/com.termux/files/usr';
const HOME = process.env.HOME || '/data/data/com.termux/files/home';

// Track cleaned space
let totalSpaceCleaned = 0;

/**
 * Get directory size in bytes
 */
function getDirectorySize(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) return 0;
        const result = execSync(`du -sb "${dirPath}" 2>/dev/null | cut -f1`, { encoding: 'utf8' });
        return parseInt(result.trim()) || 0;
    } catch (error) {
        return 0;
    }
}

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Safely remove directory or file
 */
function safeRemove(itemPath, description) {
    try {
        if (!fs.existsSync(itemPath)) {
            console.log(chalk.gray(`  ⊘ ${description}: not found`));
            return 0;
        }

        const sizeBefore = getDirectorySize(itemPath);
        execSync(`rm -rf "${itemPath}"`, { stdio: 'pipe' });

        console.log(chalk.green(`  ✓ ${description}: ${formatBytes(sizeBefore)} freed`));
        return sizeBefore;
    } catch (error) {
        console.log(chalk.red(`  ✗ ${description}: failed (${error.message})`));
        return 0;
    }
}

/**
 * Clean package manager cache
 */
function cleanPackageCache() {
    console.log(chalk.cyan.bold('\n📦 Cleaning Package Manager Cache...'));

    let cleaned = 0;

    // APT/pkg cache
    cleaned += safeRemove(`${PREFIX}/var/cache/apt/archives`, 'APT package archives');
    cleaned += safeRemove(`${PREFIX}/var/cache/apt/pkgcache.bin`, 'APT package cache');
    cleaned += safeRemove(`${PREFIX}/var/cache/apt/srcpkgcache.bin`, 'APT source cache');

    // Try to clean with pkg command
    try {
        console.log(chalk.cyan('  Running: pkg clean'));
        execSync('pkg clean -y', { stdio: 'inherit' });
        console.log(chalk.green('  ✓ pkg clean completed'));
    } catch (error) {
        console.log(chalk.red('  ✗ pkg clean failed'));
    }

    return cleaned;
}

/**
 * Clean npm cache and temporary files
 */
function cleanNpmCache() {
    console.log(chalk.cyan.bold('\n📦 Cleaning NPM Cache...'));

    let cleaned = 0;

    // NPM cache directories
    const npmCacheDirs = [
        `${HOME}/.npm`,
        `${HOME}/.npm/_cacache`,
        `${HOME}/.npm/_logs`,
        `${PREFIX}/tmp/npm-*`
    ];

    npmCacheDirs.forEach(dir => {
        if (dir.includes('*')) {
            try {
                const matches = execSync(`ls -d ${dir} 2>/dev/null || true`, { encoding: 'utf8' }).trim().split('\n');
                matches.forEach(match => {
                    if (match) cleaned += safeRemove(match, `NPM temp: ${path.basename(match)}`);
                });
            } catch (error) {
                // Ignore glob errors
            }
        } else {
            cleaned += safeRemove(dir, `NPM cache: ${path.basename(dir)}`);
        }
    });

    // Run npm cache clean
    try {
        console.log(chalk.cyan('  Running: npm cache clean --force'));
        execSync('npm cache clean --force', { stdio: 'pipe' });
        console.log(chalk.green('  ✓ npm cache clean completed'));
    } catch (error) {
        console.log(chalk.yellow('  ⚠ npm cache clean skipped (npm not found)'));
    }

    return cleaned;
}

/**
 * Clean pip cache
 */
function cleanPipCache() {
    console.log(chalk.cyan.bold('\n🐍 Cleaning Python/Pip Cache...'));

    let cleaned = 0;

    const pipCacheDirs = [
        `${HOME}/.cache/pip`,
        `${PREFIX}/tmp/pip-*`
    ];

    pipCacheDirs.forEach(dir => {
        if (dir.includes('*')) {
            try {
                const matches = execSync(`ls -d ${dir} 2>/dev/null || true`, { encoding: 'utf8' }).trim().split('\n');
                matches.forEach(match => {
                    if (match) cleaned += safeRemove(match, `Pip temp: ${path.basename(match)}`);
                });
            } catch (error) {
                // Ignore glob errors
            }
        } else {
            cleaned += safeRemove(dir, `Pip cache: ${path.basename(dir)}`);
        }
    });

    return cleaned;
}

/**
 * Clean shell history and temporary files
 */
function cleanShellHistory() {
    console.log(chalk.cyan.bold('\n🐚 Cleaning Shell History & Temp Files...'));

    let cleaned = 0;

    const tempFiles = [
        `${HOME}/.bash_history`,
        `${HOME}/.zsh_history`,
        `${HOME}/.python_history`,
        `${HOME}/.node_repl_history`,
        `${HOME}/.lesshst`,
        `${HOME}/.viminfo`,
        `${PREFIX}/tmp/*`
    ];

    tempFiles.forEach(file => {
        if (file.includes('*')) {
            try {
                const matches = execSync(`ls ${file} 2>/dev/null || true`, { encoding: 'utf8' }).trim().split('\n');
                matches.forEach(match => {
                    if (match && !match.includes('tmux-') && !match.includes('ssh-')) {
                        cleaned += safeRemove(match, `Temp file: ${path.basename(match)}`);
                    }
                });
            } catch (error) {
                // Ignore glob errors
            }
        } else {
            const sizeBefore = fs.existsSync(file) ? fs.statSync(file).size : 0;
            if (sizeBefore > 0) {
                try {
                    fs.writeFileSync(file, '');
                    console.log(chalk.green(`  ✓ Cleared ${path.basename(file)}: ${formatBytes(sizeBefore)} freed`));
                    cleaned += sizeBefore;
                } catch (error) {
                    // File might not exist
                }
            }
        }
    });

    return cleaned;
}

/**
 * Clean log files
 */
function cleanLogs() {
    console.log(chalk.cyan.bold('\n📝 Cleaning Log Files...'));

    let cleaned = 0;

    const logDirs = [
        `${PREFIX}/var/log`,
        `${HOME}/.npm/_logs`,
        `${HOME}/.config/*/logs`,
        `${HOME}/.local/share/*/logs`
    ];

    logDirs.forEach(dir => {
        if (dir.includes('*')) {
            try {
                const matches = execSync(`find ${dir.replace('*/logs', '')} -type d -name logs 2>/dev/null || true`, { encoding: 'utf8' }).trim().split('\n');
                matches.forEach(match => {
                    if (match) {
                        try {
                            const logFiles = execSync(`find "${match}" -type f -name "*.log" 2>/dev/null || true`, { encoding: 'utf8' }).trim().split('\n');
                            logFiles.forEach(logFile => {
                                if (logFile) cleaned += safeRemove(logFile, `Log file: ${path.basename(logFile)}`);
                            });
                        } catch (error) {
                            // Ignore
                        }
                    }
                });
            } catch (error) {
                // Ignore glob errors
            }
        } else {
            if (fs.existsSync(dir)) {
                try {
                    const logFiles = execSync(`find "${dir}" -type f -name "*.log" 2>/dev/null || true`, { encoding: 'utf8' }).trim().split('\n');
                    logFiles.forEach(logFile => {
                        if (logFile) cleaned += safeRemove(logFile, `Log file: ${path.basename(logFile)}`);
                    });
                } catch (error) {
                    // Ignore
                }
            }
        }
    });

    return cleaned;
}

/**
 * Clean thumbnail and cache directories
 */
function cleanThumbnails() {
    console.log(chalk.cyan.bold('\n🖼️  Cleaning Thumbnails & Cache...'));

    let cleaned = 0;

    const cacheDirs = [
        `${HOME}/.cache`,
        `${HOME}/.thumbnails`,
        `${HOME}/.local/share/Trash`
    ];

    cacheDirs.forEach(dir => {
        cleaned += safeRemove(dir, `Cache: ${path.basename(dir)}`);
    });

    return cleaned;
}

/**
 * Clean node_modules in development directories (optional)
 */
function cleanNodeModules() {
    console.log(chalk.cyan.bold('\n📚 Finding node_modules directories...'));

    try {
        const result = execSync(`find ${HOME} -type d -name "node_modules" 2>/dev/null | head -20`, { encoding: 'utf8' }).trim();
        const nodeModulesDirs = result.split('\n').filter(dir => dir);

        if (nodeModulesDirs.length === 0) {
            console.log(chalk.gray('  No node_modules directories found'));
            return 0;
        }

        console.log(chalk.yellow(`\nFound ${nodeModulesDirs.length} node_modules directories:`));
        nodeModulesDirs.forEach((dir, idx) => {
            const size = getDirectorySize(dir);
            console.log(chalk.gray(`  ${idx + 1}. ${dir} (${formatBytes(size)})`));
        });

        return new Promise((resolve) => {
            rl.question(chalk.yellow('\nDo you want to delete ALL node_modules? (yes/no): '), (answer) => {
                if (answer.toLowerCase() === 'yes') {
                    let cleaned = 0;
                    nodeModulesDirs.forEach(dir => {
                        cleaned += safeRemove(dir, `node_modules: ${dir}`);
                    });
                    resolve(cleaned);
                } else {
                    console.log(chalk.gray('  Skipped node_modules cleanup'));
                    resolve(0);
                }
            });
        });
    } catch (error) {
        console.log(chalk.gray('  No node_modules directories found'));
        return 0;
    }
}

/**
 * Main execution
 */
async function main() {
    console.log(chalk.bold('\nSelect cleaning level:'));
    console.log('1. Quick clean (package cache, npm, pip)');
    console.log('2. Standard clean (Quick + logs, shell history)');
    console.log('3. Deep clean (Standard + thumbnails, cache directories)');
    console.log('4. Nuclear clean (Deep + optional node_modules removal)');
    console.log('5. Custom selection\n');

    rl.question(chalk.yellow('Enter your choice (1-5): '), async (choice) => {
        console.log('');

        switch (choice) {
            case '1':
                totalSpaceCleaned += cleanPackageCache();
                totalSpaceCleaned += cleanNpmCache();
                totalSpaceCleaned += cleanPipCache();
                break;

            case '2':
                totalSpaceCleaned += cleanPackageCache();
                totalSpaceCleaned += cleanNpmCache();
                totalSpaceCleaned += cleanPipCache();
                totalSpaceCleaned += cleanShellHistory();
                totalSpaceCleaned += cleanLogs();
                break;

            case '3':
                totalSpaceCleaned += cleanPackageCache();
                totalSpaceCleaned += cleanNpmCache();
                totalSpaceCleaned += cleanPipCache();
                totalSpaceCleaned += cleanShellHistory();
                totalSpaceCleaned += cleanLogs();
                totalSpaceCleaned += cleanThumbnails();
                break;

            case '4':
                totalSpaceCleaned += cleanPackageCache();
                totalSpaceCleaned += cleanNpmCache();
                totalSpaceCleaned += cleanPipCache();
                totalSpaceCleaned += cleanShellHistory();
                totalSpaceCleaned += cleanLogs();
                totalSpaceCleaned += cleanThumbnails();
                totalSpaceCleaned += await cleanNodeModules();
                break;

            case '5':
                console.log(chalk.cyan('Custom selection - choose what to clean:\n'));
                // TODO: Implement custom selection
                console.log(chalk.yellow('Custom selection not yet implemented. Use options 1-4.'));
                break;

            default:
                console.log(chalk.red('Invalid choice. Exiting.'));
                rl.close();
                return;
        }

        // Final summary
        console.log(chalk.green.bold('\n✨ Cleanup Complete!'));
        console.log(chalk.cyan(`Total space freed: ${formatBytes(totalSpaceCleaned)}`));

        // Show remaining storage
        try {
            const dfOutput = execSync('df -h $PREFIX', { encoding: 'utf8' });
            console.log(chalk.gray('\nCurrent storage status:'));
            console.log(chalk.gray(dfOutput));
        } catch (error) {
            // Ignore if df fails
        }

        rl.close();
    });
}

// Run the script
main().catch(error => {
    console.error(chalk.red('Error:', error.message));
    rl.close();
    process.exit(1);
});
