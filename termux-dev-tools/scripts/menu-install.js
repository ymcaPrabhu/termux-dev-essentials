#!/usr/bin/env node

/**
 * BMad Story 2.1: Interactive Component Selection Menu
 * 
 * Allows users to select individual components for installation
 * via an interactive multi-select menu interface.
 */

const { execSync } = require('child_process');
const inquirer = require('inquirer');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

// Component definitions with descriptions and metadata
const COMPONENTS = [
  {
    id: 'termux-prep',
    name: 'Termux Preparation',
    description: 'Environment detection, storage permissions, PATH configuration',
    script: 'prepare-termux.sh',
    required: false,
    estimatedTime: '30 seconds',
    dependencies: [],
  },
  {
    id: 'prerequisites',
    name: 'Prerequisites',
    description: 'Install nodejs, npm, git, openssh, curl, python',
    script: 'install-prereqs.sh',
    required: false,
    estimatedTime: '2-3 minutes',
    dependencies: ['termux-prep'],
  },
  {
    id: 'proot-setup',
    name: 'Proot-Distro Setup',
    description: 'Ubuntu container for tools incompatible with Termux',
    script: 'setup-proot.sh',
    required: false,
    estimatedTime: '3-5 minutes',
    dependencies: ['prerequisites'],
  },
  {
    id: 'cli-tools',
    name: 'CLI Tools Installation',
    description: 'Install development CLIs with automatic fallback',
    script: 'install-cli-suite.js',
    required: false,
    estimatedTime: '2-4 minutes',
    dependencies: ['prerequisites'],
  },
  {
    id: 'shim-generation',
    name: 'Command Shim Generation',
    description: 'Seamless access to proot-installed tools',
    script: 'generate-shims.js',
    required: false,
    estimatedTime: '10 seconds',
    dependencies: ['proot-setup', 'cli-tools'],
    autoSelect: true, // Auto-selected when dependencies present
  },
  {
    id: 'github-setup',
    name: 'GitHub Automation',
    description: 'SSH key generation, authentication, git config',
    script: 'setup-github.js',
    required: false,
    estimatedTime: '1-2 minutes',
    dependencies: ['prerequisites'],
  },
  {
    id: 'repo-cloning',
    name: 'Repository Cloning',
    description: 'Clone project repository to ~/projects',
    script: 'clone-repo.js',
    required: false,
    estimatedTime: '1-2 minutes',
    dependencies: ['github-setup'],
  },
  {
    id: 'shell-customization',
    name: 'Shell Customization',
    description: 'Helpful aliases, git-aware PS1 prompt',
    script: 'apply-shell-config.sh',
    required: false,
    estimatedTime: '10 seconds',
    dependencies: ['termux-prep'],
  },
  {
    id: 'verification',
    name: 'Verification',
    description: 'Comprehensive health checks for installed components',
    script: 'verify-installation.sh',
    required: false,
    estimatedTime: '30 seconds',
    dependencies: [],
  },
  {
    id: 'uninstallation',
    name: 'Uninstallation',
    description: 'Complete removal of all installed components',
    script: 'uninstall.sh',
    required: false,
    estimatedTime: '1-2 minutes',
    dependencies: [],
    standalone: true,
  },
];

// Execution order for components
const EXECUTION_ORDER = [
  'termux-prep',
  'prerequisites',
  'proot-setup',
  'cli-tools',
  'shim-generation',
  'github-setup',
  'repo-cloning',
  'shell-customization',
  'verification',
  'uninstallation',
];

// Global flags
let DRY_RUN = false;
let VERBOSE = false;
let SKIP_CONFIRM = false;

/**
 * Parse command-line arguments
 */
function parseArguments() {
  const args = process.argv.slice(2);
  
  args.forEach(arg => {
    if (arg === '--dry-run') DRY_RUN = true;
    if (arg === '--verbose') VERBOSE = true;
    if (arg === '--yes') SKIP_CONFIRM = true;
    if (arg === '-h' || arg === '--help') {
      showHelp();
      process.exit(0);
    }
  });
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
${colors.blue}Termux Dev Tools - Interactive Installation Menu${colors.reset}

Usage: node menu-install.js [OPTIONS]

OPTIONS:
  --dry-run       Preview selections without executing
  --verbose       Show detailed output
  --yes           Skip confirmation prompts
  -h, --help      Show this help message

EXAMPLES:
  node menu-install.js
  node menu-install.js --dry-run
  node menu-install.js --verbose --yes
  `);
}

/**
 * Display welcome banner
 */
function displayBanner() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║        Termux Dev Tools - Interactive Installation Menu       ║
╚════════════════════════════════════════════════════════════════╝
`);
  
  if (DRY_RUN) {
    console.log(`${colors.yellow}🔍 DRY-RUN MODE: No changes will be made${colors.reset}\n`);
  }
  if (VERBOSE) {
    console.log(`${colors.blue}📢 VERBOSE MODE: Detailed logging enabled${colors.reset}\n`);
  }
}

/**
 * Create choices array for inquirer
 */
function createChoices() {
  return COMPONENTS.map(component => ({
    name: `${component.name} - ${component.description} (${component.estimatedTime})`,
    value: component.id,
    checked: component.required,
    disabled: component.required ? 'Required' : false,
  }));
}

/**
 * Validate dependencies for selected components
 */
function validateDependencies(selected) {
  const missingDeps = [];
  const autoSelected = [];
  
  selected.forEach(componentId => {
    const component = COMPONENTS.find(c => c.id === componentId);
    if (component && component.dependencies) {
      component.dependencies.forEach(depId => {
        if (!selected.includes(depId)) {
          if (!autoSelected.includes(depId)) {
            autoSelected.push(depId);
          }
        }
      });
    }
  });
  
  return { autoSelected, missingDeps };
}

/**
 * Auto-select dependencies recursively
 */
function autoSelectDependencies(selected) {
  let modified = false;
  const queue = [...selected];
  const result = new Set(selected);
  
  while (queue.length > 0) {
    const componentId = queue.shift();
    const component = COMPONENTS.find(c => c.id === componentId);
    
    if (component && component.dependencies) {
      component.dependencies.forEach(depId => {
        if (!result.has(depId)) {
          result.add(depId);
          queue.push(depId);
          modified = true;
        }
      });
    }
  }
  
  return { selected: Array.from(result), modified };
}

/**
 * Sort components by execution order
 */
function sortByExecutionOrder(componentIds) {
  return componentIds.sort((a, b) => {
    const indexA = EXECUTION_ORDER.indexOf(a);
    const indexB = EXECUTION_ORDER.indexOf(b);
    return indexA - indexB;
  });
}

/**
 * Execute a component script
 */
function executeComponent(component) {
  const scriptPath = path.join(__dirname, component.script);
  const isNode = component.script.endsWith('.js');
  const command = isNode ? `node "${scriptPath}"` : `bash "${scriptPath}"`;
  
  // Build command with flags
  let fullCommand = command;
  if (DRY_RUN) fullCommand += ' --dry-run';
  if (VERBOSE) fullCommand += ' --verbose';
  if (SKIP_CONFIRM) fullCommand += ' --yes';
  
  if (VERBOSE) {
    console.log(`${colors.blue}[VERBOSE] Executing: ${fullCommand}${colors.reset}`);
  }
  
  if (DRY_RUN) {
    console.log(`${colors.yellow}[DRY-RUN] Would execute: ${fullCommand}${colors.reset}`);
    return { success: true, dryRun: true };
  }
  
  try {
    console.log(`\n${colors.green}➤ ${component.name}${colors.reset}`);
    execSync(fullCommand, { stdio: 'inherit' });
    console.log(`${colors.green}✓ ${component.name} completed${colors.reset}`);
    return { success: true };
  } catch (error) {
    console.error(`${colors.red}✗ ${component.name} failed${colors.reset}`);
    return { success: false, error };
  }
}

/**
 * Main menu flow
 */
async function runInteractiveMenu() {
  displayBanner();
  
  // Initial component selection
  const { selected: initialSelection } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selected',
      message: 'Select components to install (Space to toggle, Enter to continue):',
      choices: createChoices(),
      pageSize: 15,
    },
  ]);
  
  // Handle empty selection
  if (initialSelection.length === 0) {
    console.log(`${colors.yellow}No components selected. Exiting.${colors.reset}`);
    process.exit(0);
  }
  
  // Auto-select dependencies
  const { selected: finalSelection, modified } = autoSelectDependencies(initialSelection);
  
  // Show auto-selected dependencies
  if (modified) {
    const autoSelected = finalSelection.filter(id => !initialSelection.includes(id));
    if (autoSelected.length > 0) {
      console.log(`\n${colors.yellow}ℹ  Dependencies auto-selected:${colors.reset}`);
      autoSelected.forEach(id => {
        const component = COMPONENTS.find(c => c.id === id);
        console.log(`   - ${component.name}`);
      });
    }
  }
  
  // Sort by execution order
  const orderedSelection = sortByExecutionOrder(finalSelection);
  
  // Show execution plan
  console.log(`\n${colors.blue}Installation Plan:${colors.reset}`);
  orderedSelection.forEach((id, index) => {
    const component = COMPONENTS.find(c => c.id === id);
    console.log(`${index + 1}. ${component.name} (${component.estimatedTime})`);
  });
  
  // Confirm execution
  if (!SKIP_CONFIRM && !DRY_RUN) {
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Proceed with installation?',
        default: true,
      },
    ]);
    
    if (!confirmed) {
      console.log(`${colors.yellow}Installation cancelled.${colors.reset}`);
      process.exit(0);
    }
  }
  
  // Execute components
  console.log(`\n${'='.repeat(60)}`);
  console.log('Starting installation...');
  console.log('='.repeat(60));
  
  const results = [];
  for (const componentId of orderedSelection) {
    const component = COMPONENTS.find(c => c.id === componentId);
    const result = executeComponent(component);
    results.push({ component: component.name, ...result });
    
    if (!result.success && !DRY_RUN) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: `${component.name} failed. What would you like to do?`,
          choices: [
            { name: 'Retry', value: 'retry' },
            { name: 'Skip and continue', value: 'skip' },
            { name: 'Abort installation', value: 'abort' },
          ],
        },
      ]);
      
      if (action === 'retry') {
        const retryResult = executeComponent(component);
        if (!retryResult.success) {
          console.log(`${colors.red}Retry failed. Skipping component.${colors.reset}`);
        }
      } else if (action === 'abort') {
        console.log(`${colors.red}Installation aborted.${colors.reset}`);
        process.exit(1);
      }
    }
  }
  
  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('Installation Summary');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`${colors.green}✓ Successful: ${successful}${colors.reset}`);
  if (failed > 0) {
    console.log(`${colors.red}✗ Failed: ${failed}${colors.reset}`);
  }
  
  if (DRY_RUN) {
    console.log(`\n${colors.yellow}DRY-RUN MODE: No actual changes were made.${colors.reset}`);
  }
  
  console.log('\nInstallation complete!');
}

/**
 * Main entry point
 */
async function main() {
  try {
    parseArguments();
    await runInteractiveMenu();
  } catch (error) {
    if (error.isTtyError) {
      console.error(`${colors.red}Error: Interactive prompts not supported in this environment${colors.reset}`);
    } else {
      console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { COMPONENTS, EXECUTION_ORDER, validateDependencies, sortByExecutionOrder };
