#!/usr/bin/env node

/**
 * BMad Story 3.1: CLI Suite Installation (Corrected)
 * 
 * This script installs a suite of CLI development tools, with automatic
 * fallback to proot-distro Ubuntu for tools that fail native installation.
 * 
 * CORRECTED: All package names verified against npm registry
 * See: docs/CLI-CORRECTIONS.md for research details
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Corrected CLI Tool List - All packages verified on npm
const CLI_TOOLS = [
  {
    name: 'claude-code',
    installCmd: 'npm install -g @anthropic-ai/claude-code',
    verifyCmd: 'claude --version',
    description: 'Anthropic Claude Code - Agentic coding assistant',
    requiresApiKey: true,
    apiKeyVar: 'ANTHROPIC_API_KEY',
  },
  {
    name: 'gemini-cli',
    installCmd: 'npm install -g @google/gemini-cli',
    verifyCmd: 'gemini --version',
    description: 'Google Gemini CLI - Terminal AI assistant',
    requiresApiKey: true,
    apiKeyVar: 'GOOGLE_API_KEY',
  },
  {
    name: 'codex',
    installCmd: 'npm install -g @openai/codex',
    verifyCmd: 'codex --version',
    description: 'OpenAI Codex - AI coding agent',
    requiresApiKey: true,
    apiKeyVar: 'OPENAI_API_KEY',
  },
  {
    name: 'opencode',
    installCmd: 'npm install -g opencode-ai',
    verifyCmd: 'opencode --version',
    description: 'OpenCode AI - Open source coding agent',
    requiresApiKey: true,
    apiKeyVar: 'OPENAI_API_KEY',
  },
];

// Special installers for tools not available via npm
const SPECIAL_INSTALLERS = [
  {
    name: 'droid',
    installCmd: 'curl -fsSL https://static.factory.ai/droid/install.sh | sh',
    verifyCmd: 'droid --version',
    description: 'Factory Droid - AI development agent',
    requiresApiKey: true,
    apiKeyVar: 'FACTORY_API_KEY',
    installMethod: 'curl',
  },
];

const RESULTS_FILE = path.join(__dirname, '../.cli-install-results.json');
const results = {
  native: [],
  proot: [],
  curl: [],
  failed: [],
};

/**
 * Check if a command exists in the system
 */
function commandExists(cmd) {
  try {
    execSync(`command -v ${cmd.split(' ')[0]}`, { 
      stdio: 'ignore',
      encoding: 'utf8',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a command exists in proot-distro Ubuntu
 */
function commandExistsInProot(cmd) {
  try {
    execSync(`proot-distro login ubuntu -- command -v ${cmd.split(' ')[0]}`, {
      stdio: 'ignore',
      encoding: 'utf8',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Task 2: Native Installation
 */
function installNative(tool) {
  console.log(`\n🔄 Attempting native installation of '${tool.name}'...`);
  
  try {
    execSync(tool.installCmd, {
      stdio: 'inherit',
      encoding: 'utf8',
    });
    
    // Task 4: Verification
    if (commandExists(tool.verifyCmd)) {
      console.log(`✅ Successfully installed '${tool.name}' natively.`);
      results.native.push(tool.name);
      return true;
    } else {
      console.log(`⚠️  Installation reported success but command not found.`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Native installation failed for '${tool.name}'.`);
    return false;
  }
}

/**
 * Task 3: Fallback to Proot Installation
 */
function installInProot(tool) {
  console.log(`🔄 Attempting proot installation of '${tool.name}'...`);
  
  try {
    // First ensure npm is available in proot
    execSync('proot-distro login ubuntu -- command -v npm', {
      stdio: 'ignore',
    });
  } catch {
    console.log('📦 Installing Node.js and npm in Ubuntu proot...');
    try {
      execSync('proot-distro login ubuntu -- apt-get update', { stdio: 'inherit' });
      execSync('proot-distro login ubuntu -- apt-get install -y nodejs npm', { stdio: 'inherit' });
    } catch (error) {
      console.log(`❌ Failed to install npm in proot.`);
      return false;
    }
  }
  
  try {
    execSync(`proot-distro login ubuntu -- ${tool.installCmd}`, {
      stdio: 'inherit',
      encoding: 'utf8',
    });
    
    // Verification in proot
    if (commandExistsInProot(tool.verifyCmd)) {
      console.log(`✅ Successfully installed '${tool.name}' in proot.`);
      results.proot.push(tool.name);
      
      // Generate shim for this tool
      const shimScript = path.join(__dirname, 'generate-shims.js');
      if (fs.existsSync(shimScript)) {
        execSync(`node "${shimScript}" "${tool.name}"`, { stdio: 'inherit' });
      }
      
      return true;
    } else {
      console.log(`⚠️  Proot installation reported success but command not found.`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Proot installation failed for '${tool.name}'.`);
    return false;
  }
}

/**
 * Install tool via curl script (Story 3.1 - Task 2)
 * For tools like Factory Droid that are not available on npm
 */
function installViaCurl(tool) {
  console.log(`\n🔄 Installing ${tool.name} via curl...`);
  
  try {
    execSync(tool.installCmd, {
      stdio: 'inherit',
      encoding: 'utf8',
    });
    
    if (commandExists(tool.verifyCmd)) {
      console.log(`✅ Successfully installed '${tool.name}'.`);
      results.curl.push(tool.name);
      return true;
    } else {
      console.log(`⚠️  Installation completed but command not found.`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Curl installation failed for '${tool.name}'.`);
    return false;
  }
}

/**
 * Main installation orchestrator
 */
function installCLITools() {
  console.log('='.repeat(60));
  console.log('CLI Suite Installation - BMad Story 3.1 (Corrected)');
  console.log('='.repeat(60));
  
  // Install npm-based CLI tools
  for (const tool of CLI_TOOLS) {
    console.log(`\nProcessing: ${tool.name}`);
    
    // Display API key requirement
    if (tool.requiresApiKey) {
      console.log(`⚠️  This tool requires ${tool.apiKeyVar} environment variable`);
    }
    
    // Check if already installed natively
    if (commandExists(tool.verifyCmd)) {
      console.log(`✅ '${tool.name}' is already installed natively.`);
      results.native.push(tool.name);
      continue;
    }
    
    // Check if already installed in proot
    if (commandExistsInProot(tool.verifyCmd)) {
      console.log(`✅ '${tool.name}' is already installed in proot.`);
      results.proot.push(tool.name);
      continue;
    }
    
    // Attempt native installation
    if (!installNative(tool)) {
      // Trigger fallback to proot
      console.log(`🔀 Falling back to proot installation for '${tool.name}'...`);
      
      if (!installInProot(tool)) {
        console.log(`❌ All installation methods failed for '${tool.name}'.`);
        results.failed.push(tool.name);
      }
    }
  }
  
  // Install special tools (curl-based installers)
  for (const tool of SPECIAL_INSTALLERS) {
    console.log(`\nProcessing: ${tool.name} (${tool.installMethod})`);
    
    // Display API key requirement
    if (tool.requiresApiKey) {
      console.log(`⚠️  This tool requires ${tool.apiKeyVar} environment variable`);
    }
    
    // Check if already installed
    if (commandExists(tool.verifyCmd)) {
      console.log(`✅ '${tool.name}' is already installed.`);
      results.curl.push(tool.name);
      continue;
    }
    
    // Install via curl
    if (!installViaCurl(tool)) {
      console.log(`❌ Installation failed for '${tool.name}'.`);
      results.failed.push(tool.name);
    }
  }
  
  // Save results
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('Installation Summary');
  console.log('='.repeat(60));
  console.log(`Native installations: ${results.native.length}`);
  if (results.native.length > 0) {
    console.log(`  - ${results.native.join(', ')}`);
  }
  console.log(`Proot installations: ${results.proot.length}`);
  if (results.proot.length > 0) {
    console.log(`  - ${results.proot.join(', ')}`);
  }
  console.log(`Curl installations: ${results.curl.length}`);
  if (results.curl.length > 0) {
    console.log(`  - ${results.curl.join(', ')}`);
  }
  console.log(`Failed installations: ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.log(`  - ${results.failed.join(', ')}`);
  }
  console.log('\n' + `Results saved to: ${RESULTS_FILE}`);
  
  // Exit with error if any tools failed
  if (results.failed.length > 0) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  installCLITools();
}

module.exports = { installCLITools, CLI_TOOLS, SPECIAL_INSTALLERS };
