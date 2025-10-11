#!/usr/bin/env node

/**
 * Test suite for menu-install.js
 * Tests menu logic, dependency validation, and component execution order
 */

const { COMPONENTS, EXECUTION_ORDER, validateDependencies, sortByExecutionOrder } = require('../scripts/menu-install.js');

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

console.log('Running tests for menu-install.js...\n');

// Test 1: Component definitions exist
console.log('--- Test 1: Component Definitions ---');
assert(COMPONENTS.length === 10, 'Should have 10 components defined');
assert(COMPONENTS[0].id === 'termux-prep', 'First component should be termux-prep');
assert(COMPONENTS[9].id === 'uninstallation', 'Last component should be uninstallation');

// Test 2: All components have required fields
console.log('\n--- Test 2: Component Structure ---');
COMPONENTS.forEach(component => {
  assert(component.id, `Component ${component.name} has id`);
  assert(component.name, `Component ${component.id} has name`);
  assert(component.description, `Component ${component.id} has description`);
  assert(component.script, `Component ${component.id} has script`);
  assert(component.estimatedTime, `Component ${component.id} has estimatedTime`);
  assert(Array.isArray(component.dependencies), `Component ${component.id} has dependencies array`);
});

// Test 3: Execution order is complete
console.log('\n--- Test 3: Execution Order ---');
assert(EXECUTION_ORDER.length === 10, 'Execution order has all 10 components');
assertEqual(
  EXECUTION_ORDER[0],
  'termux-prep',
  'First in execution order is termux-prep'
);
assertEqual(
  EXECUTION_ORDER[EXECUTION_ORDER.length - 1],
  'uninstallation',
  'Last in execution order is uninstallation'
);

// Test 4: Dependency graph is valid
console.log('\n--- Test 4: Dependency Graph ---');
COMPONENTS.forEach(component => {
  component.dependencies.forEach(depId => {
    const depExists = COMPONENTS.find(c => c.id === depId);
    assert(
      depExists !== undefined,
      `Dependency '${depId}' for '${component.id}' exists`
    );
  });
});

// Test 5: Sort by execution order
console.log('\n--- Test 5: Sort by Execution Order ---');
const unsorted = ['repo-cloning', 'termux-prep', 'cli-tools', 'prerequisites'];
const sorted = sortByExecutionOrder(unsorted);
assertEqual(
  sorted,
  ['termux-prep', 'prerequisites', 'cli-tools', 'repo-cloning'],
  'Components sorted in correct execution order'
);

// Test 6: Dependency validation - Prerequisites required for CLI tools
console.log('\n--- Test 6: Dependency Validation ---');
const test6Selection = ['cli-tools'];
const cliToolsComponent = COMPONENTS.find(c => c.id === 'cli-tools');
assert(
  cliToolsComponent.dependencies.includes('prerequisites'),
  'CLI tools depend on prerequisites'
);

// Test 7: Chain dependencies (repo-cloning -> github-setup -> prerequisites)
console.log('\n--- Test 7: Chain Dependencies ---');
const repoCloningComponent = COMPONENTS.find(c => c.id === 'repo-cloning');
const githubSetupComponent = COMPONENTS.find(c => c.id === 'github-setup');
assert(
  repoCloningComponent.dependencies.includes('github-setup'),
  'Repo cloning depends on github-setup'
);
assert(
  githubSetupComponent.dependencies.includes('prerequisites'),
  'GitHub setup depends on prerequisites'
);

// Test 8: Termux prep has no dependencies
console.log('\n--- Test 8: Root Dependencies ---');
const termuxPrepComponent = COMPONENTS.find(c => c.id === 'termux-prep');
assertEqual(
  termuxPrepComponent.dependencies,
  [],
  'Termux prep has no dependencies'
);

// Test 9: Uninstallation is standalone
console.log('\n--- Test 9: Standalone Components ---');
const uninstallComponent = COMPONENTS.find(c => c.id === 'uninstallation');
assert(
  uninstallComponent.standalone === true,
  'Uninstallation is marked as standalone'
);
assertEqual(
  uninstallComponent.dependencies,
  [],
  'Uninstallation has no dependencies'
);

// Test 10: Shim generation auto-select
console.log('\n--- Test 10: Auto-Select Components ---');
const shimComponent = COMPONENTS.find(c => c.id === 'shim-generation');
assert(
  shimComponent.autoSelect === true,
  'Shim generation is marked as auto-select'
);
assert(
  shimComponent.dependencies.includes('proot-setup') &&
    shimComponent.dependencies.includes('cli-tools'),
  'Shim generation depends on both proot-setup and cli-tools'
);

// Test 11: All scripts exist (verify file naming)
console.log('\n--- Test 11: Script Naming ---');
const expectedScripts = [
  'prepare-termux.sh',
  'install-prereqs.sh',
  'setup-proot.sh',
  'install-cli-suite.js',
  'generate-shims.js',
  'setup-github.js',
  'clone-repo.js',
  'apply-shell-config.sh',
  'verify-installation.sh',
  'uninstall.sh',
];
expectedScripts.forEach(script => {
  const component = COMPONENTS.find(c => c.script === script);
  assert(component !== undefined, `Component exists for script: ${script}`);
});

// Test 12: No circular dependencies
console.log('\n--- Test 12: Circular Dependencies ---');
function hasCircularDependency(componentId, visited = new Set(), stack = new Set()) {
  if (stack.has(componentId)) return true;
  if (visited.has(componentId)) return false;
  
  visited.add(componentId);
  stack.add(componentId);
  
  const component = COMPONENTS.find(c => c.id === componentId);
  if (component && component.dependencies) {
    for (const depId of component.dependencies) {
      if (hasCircularDependency(depId, visited, stack)) {
        return true;
      }
    }
  }
  
  stack.delete(componentId);
  return false;
}

let hasCircular = false;
COMPONENTS.forEach(component => {
  if (hasCircularDependency(component.id)) {
    hasCircular = true;
  }
});
assert(!hasCircular, 'No circular dependencies in component graph');

// Summary
console.log('\n' + '='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);

if (testsFailed === 0) {
  console.log('\n✅ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n❌ ${testsFailed} test(s) failed`);
  process.exit(1);
}
