# ZhipuAI GLM-4.6 Integration Guide

This guide explains how to use ZhipuAI's GLM-4.6 model with this project, both through the Gemini CLI and programmatically via Node.js.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Usage Methods](#usage-methods)
  - [Method 1: Gemini CLI](#method-1-gemini-cli)
  - [Method 2: Node.js Client](#method-2-nodejs-client)
- [Configuration](#configuration)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

**GLM-4.6** is ZhipuAI's advanced language model featuring:
- 200K input context window
- 128K maximum output tokens
- Enhanced coding capabilities
- Reasoning and agentic AI features
- OpenAI-compatible API

This integration allows you to use GLM-4.6 through:
1. **Gemini CLI** - Command-line interface for interactive and one-shot queries
2. **Node.js Client** - Programmatic API for integration into your applications

## Setup

### 1. Get Your API Key

1. Visit [ZhipuAI Open Platform](https://open.bigmodel.cn/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key

### 2. Configure Environment Variables

Add your API key to the `.env` file:

```bash
# Copy the example file if you haven't already
cp .env.example .env

# Edit .env and add your API key
nano .env
```

Add the following to your `.env`:

```bash
# ZhipuAI GLM-4.6 Configuration
ZHIPUAI_API_KEY=your_actual_api_key_here
ZHIPUAI_BASE_URL=https://api.z.ai/api/paas/v4
ZHIPUAI_MODEL=glm-4.6
```

### 3. Install Dependencies

If you haven't already installed dependencies:

```bash
npm install
```

## Usage Methods

### Method 1: Gemini CLI

The Gemini CLI can be configured to use ZhipuAI's API endpoint instead of Google's Gemini API.

#### Quick Start

```bash
# One-shot query
./examples/gemini-cli-zhipuai.sh "Write a Python function to sort a list"

# Interactive mode
./examples/gemini-cli-zhipuai.sh -i

# Using the config file
source config/zhipuai-gemini.config.sh
npx @google/gemini-cli -m glm-4.6 "Your prompt here"
```

#### Advanced Usage

```bash
# Enable thinking mode (for complex reasoning)
GEMINI_BASE_URL="https://api.z.ai/api/paas/v4" \
GOOGLE_API_KEY="$ZHIPUAI_API_KEY" \
npx @google/gemini-cli -m glm-4.6 \
  "Solve this complex algorithm problem..."

# Custom temperature (0.0-1.0)
# Note: Temperature control depends on CLI support
npx @google/gemini-cli -m glm-4.6 \
  --temperature 0.3 \
  "Explain what is Docker"
```

### Method 2: Node.js Client

Use the programmatic API for integration into your applications.

#### Basic Usage

```javascript
const ZhipuAIClient = require('./src/zhipuai-client');

// Initialize the client
const client = new ZhipuAIClient();

// Simple completion
const response = await client.complete('Write a haiku about coding');
console.log(response);
```

#### Chat with Conversation History

```javascript
const client = new ZhipuAIClient();

// Start a conversation
let conversation = [];

const turn1 = await client.chat(
  conversation,
  'What are the main features of Node.js?'
);

console.log('Assistant:', turn1.response);
conversation = turn1.conversation;

// Continue the conversation
const turn2 = await client.chat(
  conversation,
  'Can you give me an example?'
);

console.log('Assistant:', turn2.response);
```

#### Advanced Options

```javascript
const client = new ZhipuAIClient();

const response = await client.chatCompletion({
  messages: [
    { role: 'user', content: 'Write a JavaScript sorting function' }
  ],
  thinking: { type: 'enabled' },  // Enable thinking mode
  temperature: 0.5,                // Lower = more deterministic
  maxTokens: 2000                  // Limit response length
});

console.log(response.message);
console.log('Usage:', response.usage);
```

#### CLI Usage

The Node.js client can also be used as a CLI tool:

```bash
# Direct execution
node src/zhipuai-client.js "Your prompt here"

# With thinking
ZHIPUAI_THINKING=enabled node src/zhipuai-client.js "Complex prompt"
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ZHIPUAI_API_KEY` | Your ZhipuAI API key | - | ✅ Yes |
| `ZHIPUAI_BASE_URL` | API base endpoint | `https://api.z.ai/api/paas/v4` | No |
| `ZHIPUAI_MODEL` | Model name | `glm-4.6` | No |

### Configuration Files

#### Shell Configuration (`config/zhipuai-gemini.config.sh`)

This script sets up environment variables for Gemini CLI usage:

```bash
source config/zhipuai-gemini.config.sh
npx @google/gemini-cli -m glm-4.6 "Your prompt"
```

#### Programmatic Configuration

```javascript
const client = new ZhipuAIClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.z.ai/api/paas/v4',
  model: 'glm-4.6'
});
```

## Examples

### Run the Test Suite

```bash
# Run comprehensive tests
node examples/zhipuai-test.js
```

This test suite demonstrates:
- ✅ Simple text completion
- ✅ Multi-turn conversations
- ✅ Code generation with thinking mode
- ✅ Factual responses with low temperature

### Example 1: Code Generation

```bash
./examples/gemini-cli-zhipuai.sh \
  "Write a Node.js function to validate email addresses"
```

### Example 2: Explain Complex Concepts

```javascript
const client = new ZhipuAIClient();

const explanation = await client.complete(
  'Explain event-driven architecture in simple terms',
  { temperature: 0.7, maxTokens: 500 }
);

console.log(explanation);
```

### Example 3: Code Review

```javascript
const client = new ZhipuAIClient();

const code = `
function add(a, b) {
  return a + b;
}
`;

const review = await client.complete(
  `Review this code and suggest improvements:\n\n${code}`,
  { temperature: 0.3 }
);

console.log(review);
```

## Troubleshooting

### Issue: "API key is required"

**Solution**: Ensure `ZHIPUAI_API_KEY` is set in your `.env` file.

```bash
# Check if it's loaded
node -e "require('dotenv').config(); console.log(process.env.ZHIPUAI_API_KEY)"
```

### Issue: "Connection timeout" or "Network error"

**Possible causes**:
1. Invalid API key
2. Network connectivity issues
3. API endpoint is down

**Solutions**:
- Verify your API key at [ZhipuAI platform](https://open.bigmodel.cn/)
- Check your internet connection
- Try increasing the timeout in the client configuration

### Issue: Gemini CLI not using ZhipuAI endpoint

**Solution**: Ensure environment variables are exported before running the CLI:

```bash
# Use the provided wrapper script
./examples/gemini-cli-zhipuai.sh "Your prompt"

# OR manually export variables
export GEMINI_BASE_URL="https://api.z.ai/api/paas/v4"
export GOOGLE_API_KEY="$ZHIPUAI_API_KEY"
npx @google/gemini-cli -m glm-4.6 "Your prompt"
```

### Issue: "Model not found" error

**Solution**: Ensure you're using the correct model name `glm-4.6` (not `glm-4` or `GLM-4.6`).

### Rate Limiting

If you encounter rate limit errors:
- GLM-4.6 has usage quotas based on your subscription plan
- Implement exponential backoff for retries
- Consider upgrading your plan for higher limits

## Best Practices

### Temperature Settings

- **Low (0.0-0.3)**: Factual, deterministic responses
  - Code generation
  - Technical documentation
  - Factual queries

- **Medium (0.4-0.7)**: Balanced creativity and coherence
  - General chat
  - Explanations
  - Problem-solving

- **High (0.8-1.0)**: Creative, diverse responses
  - Creative writing
  - Brainstorming
  - Story generation

### Token Management

```javascript
// Monitor token usage
const response = await client.chatCompletion({
  messages: [...],
  maxTokens: 1000
});

console.log('Tokens used:', response.usage);
// Output: { prompt_tokens: 50, completion_tokens: 200, total_tokens: 250 }
```

### Error Handling

```javascript
try {
  const response = await client.complete('Your prompt');
  console.log(response);
} catch (error) {
  if (error.message.includes('API key')) {
    console.error('Invalid API key');
  } else if (error.message.includes('rate limit')) {
    console.error('Rate limit exceeded, wait before retrying');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Resources

- [ZhipuAI Official Documentation](https://docs.z.ai/guides/llm/glm-4.6)
- [GLM-4.6 API Reference](https://open.bigmodel.cn/dev/api)
- [ZhipuAI Platform](https://open.bigmodel.cn/)
- [Gemini CLI Documentation](https://github.com/google-gemini/gemini-cli)

## Support

For issues specific to:
- **ZhipuAI API**: Contact [ZhipuAI Support](https://open.bigmodel.cn/)
- **This Integration**: Open an issue in this repository
- **Gemini CLI**: Check [Gemini CLI GitHub](https://github.com/google-gemini/gemini-cli)

---

**Note**: This integration is compatible with GLM-4.6 and may work with future models from ZhipuAI. Always refer to the official API documentation for the latest features and updates.
