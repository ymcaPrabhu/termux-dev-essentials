#!/usr/bin/env node

/**
 * ZhipuAI GLM-4.6 Test Script
 *
 * This script demonstrates how to use the ZhipuAI client to interact
 * with the GLM-4.6 model for various tasks.
 *
 * Usage:
 *   node examples/zhipuai-test.js
 */

const ZhipuAIClient = require('../src/zhipuai-client');
const chalk = require('chalk');

// Initialize Sentry for error tracking
const { initSentry, captureError, captureMessage } = require('../src/sentry-config');
initSentry();

async function runTests() {
  console.log(chalk.bold.blue('🚀 ZhipuAI GLM-4.6 Integration Test\n'));

  try {
    // Initialize the client
    console.log(chalk.yellow('📋 Initializing ZhipuAI client...'));
    const client = new ZhipuAIClient();
    console.log(chalk.green('✓ Client initialized\n'));

    // Test 1: Simple text completion
    console.log(chalk.bold.cyan('Test 1: Simple Text Completion'));
    console.log(chalk.gray('Prompt: Write a haiku about coding\n'));

    const response1 = await client.complete('Write a haiku about coding');
    console.log(chalk.green('Response:'));
    console.log(response1);
    console.log('');

    captureMessage('ZhipuAI simple completion test passed', 'info');

    // Test 2: Chat with conversation history
    console.log(chalk.bold.cyan('Test 2: Multi-turn Conversation'));
    let conversation = [];

    const turn1 = await client.chat(
      conversation,
      'What are the main features of Termux?',
      { temperature: 0.7 }
    );

    console.log(chalk.green('User:'), 'What are the main features of Termux?');
    console.log(chalk.blue('Assistant:'), turn1.response);
    console.log('');

    conversation = turn1.conversation;

    const turn2 = await client.chat(
      conversation,
      'Can you list 3 essential packages for development?',
      { temperature: 0.7 }
    );

    console.log(chalk.green('User:'), 'Can you list 3 essential packages for development?');
    console.log(chalk.blue('Assistant:'), turn2.response);
    console.log('');

    captureMessage('ZhipuAI conversation test passed', 'info');

    // Test 3: Code generation with thinking mode
    console.log(chalk.bold.cyan('Test 3: Code Generation with Thinking Mode'));
    console.log(chalk.gray('Prompt: Write a JavaScript function to validate email addresses\n'));

    const response3 = await client.chatCompletion({
      messages: [
        {
          role: 'user',
          content: 'Write a JavaScript function to validate email addresses using regex'
        }
      ],
      thinking: { type: 'enabled' },
      temperature: 0.5,
      maxTokens: 2000
    });

    if (response3.success) {
      console.log(chalk.green('Response:'));
      console.log(response3.message);
      console.log('');
      console.log(chalk.gray('Usage:'), JSON.stringify(response3.usage, null, 2));
      console.log('');
    }

    captureMessage('ZhipuAI code generation test passed', 'info');

    // Test 4: Low temperature for factual responses
    console.log(chalk.bold.cyan('Test 4: Factual Response (Low Temperature)'));
    console.log(chalk.gray('Prompt: What is the capital of France?\n'));

    const response4 = await client.complete(
      'What is the capital of France? Answer in one word.',
      { temperature: 0.1, maxTokens: 50 }
    );

    console.log(chalk.green('Response:'), response4);
    console.log('');

    captureMessage('ZhipuAI factual response test passed', 'info');

    // Summary
    console.log(chalk.bold.green('✅ All tests completed successfully!\n'));
    console.log(chalk.yellow('💡 Tips:'));
    console.log('  - Use lower temperature (0.1-0.3) for factual, deterministic responses');
    console.log('  - Use higher temperature (0.7-1.0) for creative, diverse responses');
    console.log('  - Enable thinking mode for complex reasoning tasks');
    console.log('  - The client supports conversation history for multi-turn chats');

  } catch (error) {
    console.error(chalk.red('❌ Test failed:'), error.message);
    captureError(error, { context: 'ZhipuAI integration test' });

    if (error.message.includes('API key')) {
      console.log(chalk.yellow('\n⚠️  Make sure to set ZHIPUAI_API_KEY in your .env file'));
      console.log(chalk.gray('   Example: ZHIPUAI_API_KEY=your_api_key_here'));
    }

    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error(chalk.red('Unhandled error:'), error);
  captureError(error, { context: 'ZhipuAI test runner' });
  process.exit(1);
});
