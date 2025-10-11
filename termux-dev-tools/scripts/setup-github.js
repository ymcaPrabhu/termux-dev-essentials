#!/usr/bin/env node

/**
 * BMad Story 1.6: GitHub Automation
 * 
 * Automates GitHub setup including SSH key generation, GitHub authentication,
 * and git configuration for immediate repository interaction.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const HOME = process.env.HOME || process.env.USERPROFILE;
const SSH_DIR = path.join(HOME, '.ssh');
const SSH_KEY_ED25519 = path.join(SSH_DIR, 'id_ed25519');
const SSH_KEY_RSA = path.join(SSH_DIR, 'id_rsa');
const SSH_KEY_PUB_ED25519 = `${SSH_KEY_ED25519}.pub`;
const SSH_KEY_PUB_RSA = `${SSH_KEY_RSA}.pub`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Task 1: Check for Existing SSH Key
 */
function checkExistingSSHKey() {
  console.log('\n=== Checking for existing SSH keys ===');
  
  if (fs.existsSync(SSH_KEY_ED25519)) {
    console.log(`✅ Found existing Ed25519 SSH key: ${SSH_KEY_ED25519}`);
    return SSH_KEY_ED25519;
  }
  
  if (fs.existsSync(SSH_KEY_RSA)) {
    console.log(`✅ Found existing RSA SSH key: ${SSH_KEY_RSA}`);
    return SSH_KEY_RSA;
  }
  
  console.log('ℹ️  No existing SSH key found.');
  return null;
}

/**
 * Task 2: Generate SSH Key
 */
async function generateSSHKey() {
  console.log('\n=== Generating new SSH key ===');
  
  // Ensure .ssh directory exists
  if (!fs.existsSync(SSH_DIR)) {
    fs.mkdirSync(SSH_DIR, { mode: 0o700 });
  }
  
  const email = await prompt('Enter your email for the SSH key: ');
  
  try {
    execSync(
      `ssh-keygen -t ed25519 -C "${email}" -N "" -f "${SSH_KEY_ED25519}"`,
      { stdio: 'inherit' }
    );
    console.log(`✅ Successfully generated SSH key at ${SSH_KEY_ED25519}`);
    return SSH_KEY_ED25519;
  } catch (error) {
    console.error('❌ Failed to generate SSH key:', error.message);
    process.exit(1);
  }
}

/**
 * Task 3: Display Public Key and Instructions
 */
async function displayPublicKeyInstructions(keyPath) {
  console.log('\n=== GitHub SSH Key Setup ===');
  
  const pubKeyPath = `${keyPath}.pub`;
  const pubKey = fs.readFileSync(pubKeyPath, 'utf8').trim();
  
  console.log('\n📋 Your public SSH key:');
  console.log('─'.repeat(60));
  console.log(pubKey);
  console.log('─'.repeat(60));
  
  console.log('\n📝 To add this key to GitHub:');
  console.log('   1. Copy the key above');
  console.log('   2. Go to: https://github.com/settings/ssh/new');
  console.log('   3. Paste the key and give it a title (e.g., "Termux Device")');
  console.log('   4. Click "Add SSH key"');
  
  await prompt('\n✋ Press Enter after you have added the key to GitHub...');
}

/**
 * Task 4: Verify SSH Connection to GitHub
 */
function verifyGitHubConnection() {
  console.log('\n=== Verifying GitHub SSH connection ===');
  
  try {
    const output = execSync('ssh -T git@github.com -o StrictHostKeyChecking=no 2>&1', {
      encoding: 'utf8',
      timeout: 10000,
    });
    
    if (output.includes('successfully authenticated')) {
      console.log('✅ GitHub SSH authentication successful!');
      return true;
    } else {
      console.log('⚠️  Unexpected response from GitHub:');
      console.log(output);
      return false;
    }
  } catch (error) {
    const output = error.stdout?.toString() || '';
    
    if (output.includes('successfully authenticated')) {
      console.log('✅ GitHub SSH authentication successful!');
      return true;
    } else {
      console.error('❌ GitHub SSH authentication failed.');
      console.error('Error output:', output || error.message);
      return false;
    }
  }
}

/**
 * Task 5: Configure Git User
 */
async function configureGitUser() {
  console.log('\n=== Configuring Git user ===');
  
  // Check if already configured
  let existingName, existingEmail;
  try {
    existingName = execSync('git config --global user.name', { encoding: 'utf8' }).trim();
    existingEmail = execSync('git config --global user.email', { encoding: 'utf8' }).trim();
  } catch {
    // Not configured yet
  }
  
  if (existingName && existingEmail) {
    console.log(`ℹ️  Git already configured:`);
    console.log(`   Name: ${existingName}`);
    console.log(`   Email: ${existingEmail}`);
    
    const update = await prompt('Do you want to update this configuration? (y/N): ');
    if (update.toLowerCase() !== 'y') {
      console.log('✅ Keeping existing Git configuration.');
      return;
    }
  }
  
  const name = await prompt('Enter your Git name (e.g., "John Doe"): ');
  const email = await prompt('Enter your Git email: ');
  
  try {
    execSync(`git config --global user.name "${name}"`, { stdio: 'inherit' });
    execSync(`git config --global user.email "${email}"`, { stdio: 'inherit' });
    console.log('✅ Git user configured successfully.');
  } catch (error) {
    console.error('❌ Failed to configure Git user:', error.message);
  }
}

/**
 * Main setup flow
 */
async function setupGitHub() {
  console.log('='.repeat(60));
  console.log('GitHub Setup - BMad Story 1.6');
  console.log('='.repeat(60));
  
  try {
    // Task 1 & 6: Check for existing key (idempotency)
    let keyPath = checkExistingSSHKey();
    
    if (!keyPath) {
      // Task 2: Generate new key
      keyPath = await generateSSHKey();
    }
    
    // Task 3: Display key and instructions
    await displayPublicKeyInstructions(keyPath);
    
    // Task 4: Verify connection
    const authenticated = verifyGitHubConnection();
    
    if (!authenticated) {
      console.log('\n⚠️  GitHub authentication failed. Please check the following:');
      console.log('   - The SSH key was correctly added to GitHub');
      console.log('   - Your internet connection is working');
      console.log('   - You can manually test with: ssh -T git@github.com');
      const retry = await prompt('\nDo you want to retry verification? (y/N): ');
      if (retry.toLowerCase() === 'y') {
        verifyGitHubConnection();
      }
    }
    
    // Task 5: Configure Git user
    await configureGitUser();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ GitHub setup complete!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run if called directly
if (require.main === module) {
  setupGitHub();
}

module.exports = { setupGitHub, checkExistingSSHKey, verifyGitHubConnection };
