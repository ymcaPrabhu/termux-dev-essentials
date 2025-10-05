#!/usr/bin/env node

/**
 * Simple Sentry test script
 * Tests error tracking and message logging
 */

const { Sentry, initSentry, captureMessage, captureError, addBreadcrumb } = require('../src/sentry-config');

// Initialize Sentry
initSentry();

console.log('🧪 Testing Sentry integration...\n');

// Test 1: Capture a message
console.log('Test 1: Capturing an info message...');
captureMessage('This is a test message from termux-dev-tools', 'info');
console.log('✅ Message sent to Sentry\n');

// Test 2: Add breadcrumbs
console.log('Test 2: Adding breadcrumbs...');
addBreadcrumb('User started test', { testId: '12345' });
addBreadcrumb('Test in progress', { step: 'validation' });
console.log('✅ Breadcrumbs added\n');

// Test 3: Capture a warning
console.log('Test 3: Capturing a warning...');
captureMessage('This is a warning message', 'warning');
console.log('✅ Warning sent to Sentry\n');

// Test 4: Capture an error
console.log('Test 4: Capturing an error...');
try {
  throw new Error('This is a test error for Sentry!');
} catch (error) {
  captureError(error, {
    testName: 'sentry-integration-test',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
  console.log('✅ Error captured and sent to Sentry\n');
}

// Test 5: Capture an error with stack trace
console.log('Test 5: Capturing error with context...');
function causeError() {
  const data = null;
  return data.property; // This will throw
}

try {
  causeError();
} catch (error) {
  captureError(error, {
    function: 'causeError',
    description: 'Testing null pointer error',
  });
  console.log('✅ Error with stack trace sent to Sentry\n');
}

// Wait a moment for events to be sent
console.log('⏳ Waiting for events to be sent to Sentry...');

setTimeout(() => {
  console.log('\n✅ All tests completed!');
  console.log('\n📊 View your errors in Sentry:');
  console.log('   https://amit-pb.sentry.io/projects/termux-dev-tools/\n');
  process.exit(0);
}, 3000);
