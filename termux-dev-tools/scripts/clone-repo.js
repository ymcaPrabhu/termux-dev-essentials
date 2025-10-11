#!/usr/bin/env node

/**
 * BMad Story 1.7: Repository Cloning
 * 
 * Clones a specified Git repository into a predictable project directory.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const HOME = process.env.HOME || process.env.USERPROFILE;
const PROJECTS_DIR = path.join(HOME, 'projects');

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
 * Task 2: Ensure Projects Directory Exists
 */
function ensureProjectsDirectory() {
  if (!fs.existsSync(PROJECTS_DIR)) {
    console.log(`📁 Creating projects directory: ${PROJECTS_DIR}`);
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
    console.log('✅ Projects directory created.');
  } else {
    console.log(`✅ Projects directory exists: ${PROJECTS_DIR}`);
  }
}

/**
 * Parse repository name from Git URL
 */
function parseRepoName(url) {
  // Handle both SSH and HTTPS URLs
  const match = url.match(/([^/]+?)(?:\.git)?$/);
  return match ? match[1] : null;
}

/**
 * Task 3: Check for Existing Repo Directory
 */
function checkExistingRepo(repoName) {
  const repoPath = path.join(PROJECTS_DIR, repoName);
  return fs.existsSync(repoPath) ? repoPath : null;
}

/**
 * Task 4: Clone Repository
 */
function cloneRepository(repoUrl, repoName) {
  const targetPath = path.join(PROJECTS_DIR, repoName);
  
  console.log(`\n🔄 Cloning repository to ${targetPath}...`);
  
  try {
    execSync(`git clone "${repoUrl}" "${targetPath}"`, {
      stdio: 'inherit',
      cwd: PROJECTS_DIR,
    });
    
    console.log(`✅ Successfully cloned repository to ${targetPath}`);
    return targetPath;
  } catch (error) {
    console.error('❌ Failed to clone repository.');
    console.error('Possible reasons:');
    console.error('  - Invalid repository URL');
    console.error('  - No SSH access (ensure GitHub SSH keys are set up)');
    console.error('  - Network connectivity issues');
    throw error;
  }
}

/**
 * Main cloning flow
 */
async function cloneRepo() {
  console.log('='.repeat(60));
  console.log('Repository Cloning - BMad Story 1.7');
  console.log('='.repeat(60));
  
  try {
    // Task 1: Get Repository URL
    console.log('\n📋 Enter the Git repository you want to clone.');
    console.log('Formats accepted:');
    console.log('  - SSH: git@github.com:username/repo.git');
    console.log('  - HTTPS: https://github.com/username/repo.git');
    
    const repoUrl = await prompt('\nRepository URL: ');
    
    if (!repoUrl || repoUrl.trim() === '') {
      console.log('⚠️  No repository URL provided. Skipping clone.');
      rl.close();
      return;
    }
    
    const repoName = parseRepoName(repoUrl);
    if (!repoName) {
      console.error('❌ Could not parse repository name from URL.');
      process.exit(1);
    }
    
    console.log(`\nRepository name: ${repoName}`);
    
    // Task 2: Ensure projects directory exists
    ensureProjectsDirectory();
    
    // Task 3: Check for existing repository
    const existingPath = checkExistingRepo(repoName);
    if (existingPath) {
      console.log(`\n⚠️  Repository already exists at: ${existingPath}`);
      const overwrite = await prompt('Do you want to delete and re-clone? (y/N): ');
      
      if (overwrite.toLowerCase() === 'y') {
        console.log('🗑️  Removing existing repository...');
        fs.rmSync(existingPath, { recursive: true, force: true });
        console.log('✅ Existing repository removed.');
      } else {
        console.log('✅ Keeping existing repository.');
        rl.close();
        return;
      }
    }
    
    // Task 4: Clone the repository
    const clonedPath = cloneRepository(repoUrl, repoName);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Repository cloning complete!');
    console.log(`📂 Location: ${clonedPath}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Cloning failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run if called directly
if (require.main === module) {
  cloneRepo();
}

module.exports = { cloneRepo, ensureProjectsDirectory, parseRepoName };
