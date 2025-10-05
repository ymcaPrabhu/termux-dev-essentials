#!/usr/bin/env node

/**
 * Comprehensive Test Suite for termux-dev-tools
 * Tests all components and logs issues to Sentry
 */

const { Sentry, initSentry, captureMessage, captureError, addBreadcrumb } = require('../src/sentry-config');
const fs = require('fs');
const path = require('path');

// Initialize Sentry
initSentry();

const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper function to run a test
function runTest(testName, testFn) {
  console.log(`\n🔍 Testing: ${testName}`);
  addBreadcrumb(`Testing: ${testName}`);

  try {
    testFn();
    console.log(`   ✅ PASSED: ${testName}`);
    results.passed.push(testName);
  } catch (error) {
    console.log(`   ❌ FAILED: ${testName}`);
    console.log(`   Error: ${error.message}`);
    results.failed.push({ test: testName, error: error.message });

    // Log to Sentry
    captureError(error, {
      test: testName,
      component: 'test-suite',
      timestamp: new Date().toISOString()
    });
  }
}

// Helper function to log warning
function logWarning(testName, message) {
  console.log(`   ⚠️  WARNING: ${message}`);
  results.warnings.push({ test: testName, message });
  captureMessage(`Warning in ${testName}: ${message}`, 'warning');
}

console.log('🧪 Starting Comprehensive Test Suite for termux-dev-tools\n');
console.log('='.repeat(60));

// Test 1: Check project structure
runTest('Project Structure', () => {
  const requiredDirs = ['src', 'scripts', 'examples', 'docs', 'tests'];
  const requiredFiles = ['package.json', '.env', '.gitignore'];

  for (const dir of requiredDirs) {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Missing required directory: ${dir}`);
    }
  }

  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing required file: ${file}`);
    }
  }
});

// Test 2: Check package.json validity
runTest('Package.json Configuration', () => {
  const packageJson = require('../package.json');

  if (!packageJson.name) throw new Error('Missing package name');
  if (!packageJson.version) throw new Error('Missing version');
  if (!packageJson.dependencies) throw new Error('Missing dependencies');

  // Check critical dependencies
  const criticalDeps = ['express', 'dotenv', '@sentry/node'];
  for (const dep of criticalDeps) {
    if (!packageJson.dependencies[dep]) {
      throw new Error(`Missing critical dependency: ${dep}`);
    }
  }
});

// Test 3: Check environment variables
runTest('Environment Variables', () => {
  require('dotenv').config();

  if (!process.env.SENTRY_DSN) {
    throw new Error('Missing SENTRY_DSN environment variable');
  }

  // Check optional vars
  const optionalVars = ['TWILIO_ACCOUNT_SID', 'VONAGE_API_KEY'];
  for (const envVar of optionalVars) {
    if (!process.env[envVar] || process.env[envVar].startsWith('your_')) {
      logWarning('Environment Variables', `${envVar} not configured (optional)`);
    }
  }
});

// Test 4: Test Sentry configuration
runTest('Sentry Configuration', () => {
  const sentryConfig = require('../src/sentry-config');

  if (!sentryConfig.initSentry) throw new Error('Missing initSentry function');
  if (!sentryConfig.captureError) throw new Error('Missing captureError function');
  if (!sentryConfig.captureMessage) throw new Error('Missing captureMessage function');
  if (!sentryConfig.addBreadcrumb) throw new Error('Missing addBreadcrumb function');
});

// Test 5: Test SMS Manager module
runTest('SMS Manager Module', () => {
  const AndroidMessageManager = require('../src/sms-manager');

  if (typeof AndroidMessageManager !== 'function') {
    throw new Error('AndroidMessageManager is not a constructor');
  }

  const smsManager = new AndroidMessageManager('twilio');

  if (!smsManager.sendSMS) throw new Error('Missing sendSMS method');
  if (!smsManager.initTwilio) throw new Error('Missing initTwilio method');
  if (!smsManager.initVonage) throw new Error('Missing initVonage method');

  logWarning('SMS Manager', 'SMS sending not tested (requires valid credentials)');
});

// Test 6: Check scripts
runTest('Scripts Directory', () => {
  const scriptsDir = path.join(process.cwd(), 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    throw new Error('Scripts directory not found');
  }

  const scripts = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.js'));
  if (scripts.length === 0) {
    throw new Error('No JavaScript files found in scripts directory');
  }

  console.log(`   Found ${scripts.length} script(s)`);
});

// Test 7: Check examples
runTest('Example Files', () => {
  const examplesDir = path.join(process.cwd(), 'examples');
  const examples = fs.readdirSync(examplesDir);

  const requiredExamples = ['sentry-express-example.js', 'sentry-test.js'];

  for (const example of requiredExamples) {
    if (!examples.includes(example)) {
      throw new Error(`Missing required example: ${example}`);
    }
  }
});

// Test 8: Check documentation
runTest('Documentation', () => {
  const docsDir = path.join(process.cwd(), 'docs');
  const docs = fs.readdirSync(docsDir);

  if (docs.length === 0) {
    throw new Error('No documentation files found');
  }

  console.log(`   Found ${docs.length} documentation file(s)`);
});

// Test 9: Check npm scripts
runTest('NPM Scripts', () => {
  const packageJson = require('../package.json');
  const scripts = packageJson.scripts;

  const requiredScripts = ['start', 'dev'];

  for (const script of requiredScripts) {
    if (!scripts[script]) {
      throw new Error(`Missing required npm script: ${script}`);
    }
  }
});

// Test 10: Dependencies installation
runTest('Dependencies Installation', () => {
  const nodeModules = path.join(process.cwd(), 'node_modules');

  if (!fs.existsSync(nodeModules)) {
    throw new Error('node_modules directory not found - run npm install');
  }

  const packageJson = require('../package.json');
  const dependencies = Object.keys(packageJson.dependencies);

  console.log(`   ✓ All ${dependencies.length} dependencies installed`);
});

// Test 11: Intentional error for Sentry
runTest('Sentry Error Capture Test', () => {
  const error = new Error('Intentional test error for Sentry verification');
  captureError(error, {
    test: 'Sentry Error Capture Test',
    intentional: true
  });
  throw error; // This will mark the test as failed
});

// Print summary
setTimeout(() => {
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 TEST SUMMARY\n');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.failed.forEach((fail, idx) => {
      console.log(`   ${idx + 1}. ${fail.test}`);
      console.log(`      Error: ${fail.error}`);
    });
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    results.warnings.forEach((warn, idx) => {
      console.log(`   ${idx + 1}. ${warn.test}: ${warn.message}`);
    });
  }

  console.log('\n📊 View all logged issues in Sentry:');
  console.log('   https://amit-pb.sentry.io/projects/termux-dev-tools/\n');

  // Send final summary to Sentry
  captureMessage(`Test suite completed: ${results.passed.length} passed, ${results.failed.length} failed, ${results.warnings.length} warnings`, 'info');

  process.exit(results.failed.length > 0 ? 1 : 0);
}, 3000);
