#!/usr/bin/env node

/**
 * Test suite for corrected CLI tools list (Story 3.1)
 * Verifies all package names and installation methods
 */

const { CLI_TOOLS, SPECIAL_INSTALLERS } = require('../scripts/install-cli-suite.js');

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    testsFailed++;
  }
}

function assertEqual(actual, expected, testName) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log(`✅ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    console.error(`  Expected: ${JSON.stringify(expected)}`);
    console.error(`  Actual: ${JSON.stringify(actual)}`);
    testsFailed++;
  }
}

console.log('Running tests for corrected CLI tools (Story 3.1)...\n');

// Test 1: Verify corrected package count
console.log('--- Test 1: Package Count ---');
assert(CLI_TOOLS.length === 4, 'Should have 4 npm-based tools');
assert(SPECIAL_INSTALLERS.length === 1, 'Should have 1 special installer');

// Test 2: Verify corrected package names
console.log('\n--- Test 2: Corrected Package Names ---');
const expectedNames = ['claude-code', 'gemini-cli', 'codex', 'opencode'];
const actualNames = CLI_TOOLS.map(t => t.name);
assertEqual(actualNames, expectedNames, 'All npm package names are corrected');

// Test 3: Verify no old incorrect packages
console.log('\n--- Test 3: Old Packages Removed ---');
const oldPackages = ['cloud-code', 'codec-cli', 'open-core-cli', 'factory-ai', 'droid-cli'];
oldPackages.forEach(oldName => {
  const exists = CLI_TOOLS.some(t => t.name === oldName);
  assert(!exists, `Old package '${oldName}' should be removed`);
});

// Test 4: Verify correct npm package names
console.log('\n--- Test 4: NPM Package Names ---');
const packageChecks = [
  { name: 'claude-code', expectedPkg: '@anthropic-ai/claude-code' },
  { name: 'gemini-cli', expectedPkg: '@google/gemini-cli' },
  { name: 'codex', expectedPkg: '@openai/codex' },
  { name: 'opencode', expectedPkg: 'opencode-ai' },
];

packageChecks.forEach(({ name, expectedPkg }) => {
  const tool = CLI_TOOLS.find(t => t.name === name);
  assert(
    tool && tool.installCmd.includes(expectedPkg),
    `${name} uses correct package: ${expectedPkg}`
  );
});

// Test 5: Verify correct CLI command names
console.log('\n--- Test 5: CLI Command Names ---');
const commandChecks = [
  { name: 'claude-code', expectedCmd: 'claude' },
  { name: 'gemini-cli', expectedCmd: 'gemini' },
  { name: 'codex', expectedCmd: 'codex' },
  { name: 'opencode', expectedCmd: 'opencode' },
];

commandChecks.forEach(({ name, expectedCmd }) => {
  const tool = CLI_TOOLS.find(t => t.name === name);
  assert(
    tool && tool.verifyCmd.includes(expectedCmd),
    `${name} uses correct command: ${expectedCmd}`
  );
});

// Test 6: Verify API key metadata
console.log('\n--- Test 6: API Key Metadata ---');
CLI_TOOLS.forEach(tool => {
  assert(
    tool.requiresApiKey === true,
    `${tool.name} has requiresApiKey flag`
  );
  assert(
    tool.apiKeyVar && tool.apiKeyVar.length > 0,
    `${tool.name} has apiKeyVar defined`
  );
  assert(
    tool.description && tool.description.length > 0,
    `${tool.name} has description`
  );
});

// Test 7: Verify Factory Droid special installer
console.log('\n--- Test 7: Factory Droid Special Installer ---');
const droidTool = SPECIAL_INSTALLERS.find(t => t.name === 'droid');
assert(droidTool !== undefined, 'Factory Droid exists in SPECIAL_INSTALLERS');
assert(
  droidTool && droidTool.installMethod === 'curl',
  'Factory Droid uses curl installer'
);
assert(
  droidTool && droidTool.installCmd.includes('curl'),
  'Factory Droid install command uses curl'
);
assert(
  droidTool && droidTool.installCmd.includes('factory.ai'),
  'Factory Droid uses official factory.ai installer'
);
assert(
  droidTool && droidTool.verifyCmd === 'droid --version',
  'Factory Droid uses correct verify command'
);

// Test 8: Verify droid-cli is NOT in CLI_TOOLS
console.log('\n--- Test 8: Incorrect droid-cli Removed ---');
const hasDroidCli = CLI_TOOLS.some(t => t.name === 'droid-cli');
assert(!hasDroidCli, 'droid-cli (Android tool) removed from CLI_TOOLS');

// Test 9: Verify all tools have required fields
console.log('\n--- Test 9: Required Fields ---');
CLI_TOOLS.forEach(tool => {
  assert(tool.name, `${tool.name || 'unknown'} has name`);
  assert(tool.installCmd, `${tool.name} has installCmd`);
  assert(tool.verifyCmd, `${tool.name} has verifyCmd`);
});

SPECIAL_INSTALLERS.forEach(tool => {
  assert(tool.name, `${tool.name || 'unknown'} has name`);
  assert(tool.installCmd, `${tool.name} has installCmd`);
  assert(tool.verifyCmd, `${tool.name} has verifyCmd`);
  assert(tool.installMethod, `${tool.name} has installMethod`);
});

// Test 10: Verify correct API key variables
console.log('\n--- Test 10: API Key Variables ---');
const apiKeyChecks = [
  { name: 'claude-code', expectedVar: 'ANTHROPIC_API_KEY' },
  { name: 'gemini-cli', expectedVar: 'GOOGLE_API_KEY' },
  { name: 'codex', expectedVar: 'OPENAI_API_KEY' },
  { name: 'opencode', expectedVar: 'OPENAI_API_KEY' },
  { name: 'droid', expectedVar: 'FACTORY_API_KEY' },
];

apiKeyChecks.forEach(({ name, expectedVar }) => {
  const tool = CLI_TOOLS.find(t => t.name === name) || 
                SPECIAL_INSTALLERS.find(t => t.name === name);
  assert(
    tool && tool.apiKeyVar === expectedVar,
    `${name} uses correct API key variable: ${expectedVar}`
  );
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);

if (testsFailed === 0) {
  console.log('\n✅ All tests passed! CLI tools list is corrected.');
  process.exit(0);
} else {
  console.log(`\n❌ ${testsFailed} test(s) failed`);
  process.exit(1);
}
