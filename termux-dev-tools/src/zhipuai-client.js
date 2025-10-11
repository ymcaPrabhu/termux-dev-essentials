#!/usr/bin/env node

/**
 * ZhipuAI GLM-4.6 Client
 *
 * A Node.js client for interacting with ZhipuAI's GLM-4.6 model API.
 * This provides a programmatic interface compatible with OpenAI-style APIs.
 *
 * @module zhipuai-client
 */

const axios = require('axios');
require('dotenv').config();

class ZhipuAIClient {
  /**
   * Initialize ZhipuAI client
   * @param {Object} options - Configuration options
   * @param {string} options.apiKey - ZhipuAI API key
   * @param {string} options.baseURL - API base URL (default: https://api.z.ai/api/paas/v4)
   * @param {string} options.model - Model name (default: glm-4.6)
   */
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.ZHIPUAI_API_KEY;
    this.baseURL = options.baseURL || process.env.ZHIPUAI_BASE_URL || 'https://api.z.ai/api/paas/v4';
    this.model = options.model || process.env.ZHIPUAI_MODEL || 'glm-4.6';

    if (!this.apiKey) {
      throw new Error('ZhipuAI API key is required. Set ZHIPUAI_API_KEY in .env or pass apiKey in options.');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 second timeout
    });
  }

  /**
   * Send a chat completion request to GLM-4.6
   * @param {Object} options - Request options
   * @param {Array} options.messages - Array of message objects with role and content
   * @param {number} options.temperature - Temperature for response randomness (0.0-1.0)
   * @param {number} options.maxTokens - Maximum tokens in response
   * @param {boolean} options.stream - Enable streaming response
   * @param {Object} options.thinking - Enable thinking mode {type: "enabled"}
   * @returns {Promise<Object>} API response
   */
  async chatCompletion(options = {}) {
    const {
      messages,
      temperature = 0.7,
      maxTokens = 4096,
      stream = false,
      thinking = null
    } = options;

    if (!messages || !Array.isArray(messages)) {
      throw new Error('messages must be an array of message objects');
    }

    const requestBody = {
      model: this.model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream
    };

    // Add thinking mode if specified
    if (thinking) {
      requestBody.thinking = thinking;
    }

    try {
      const response = await this.client.post('/chat/completions', requestBody);
      return {
        success: true,
        data: response.data,
        usage: response.data.usage,
        message: response.data.choices?.[0]?.message?.content || ''
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data || null
      };
    }
  }

  /**
   * Simple text completion - convenience method
   * @param {string} prompt - Text prompt
   * @param {Object} options - Optional parameters (temperature, maxTokens)
   * @returns {Promise<string>} Generated text response
   */
  async complete(prompt, options = {}) {
    const messages = [
      { role: 'user', content: prompt }
    ];

    const result = await this.chatCompletion({ messages, ...options });

    if (!result.success) {
      throw new Error(`GLM-4.6 API Error: ${result.error}`);
    }

    return result.message;
  }

  /**
   * Chat with conversation history
   * @param {Array} conversationHistory - Array of previous messages
   * @param {string} newMessage - New user message
   * @param {Object} options - Optional parameters
   * @returns {Promise<Object>} Response with updated conversation history
   */
  async chat(conversationHistory, newMessage, options = {}) {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: newMessage }
    ];

    const result = await this.chatCompletion({ messages, ...options });

    if (!result.success) {
      throw new Error(`GLM-4.6 API Error: ${result.error}`);
    }

    return {
      response: result.message,
      conversation: [
        ...messages,
        { role: 'assistant', content: result.message }
      ],
      usage: result.usage
    };
  }
}

// Export the client
module.exports = ZhipuAIClient;

// CLI usage
if (require.main === module) {
  const chalk = require('chalk');

  const client = new ZhipuAIClient();
  const prompt = process.argv.slice(2).join(' ');

  if (!prompt) {
    console.log(chalk.red('Error: Please provide a prompt'));
    console.log(chalk.yellow('\nUsage:'));
    console.log('  node src/zhipuai-client.js "Your prompt here"');
    process.exit(1);
  }

  console.log(chalk.blue('🤖 GLM-4.6 Processing...\n'));

  client.complete(prompt)
    .then(response => {
      console.log(chalk.green('Response:'));
      console.log(response);
    })
    .catch(error => {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    });
}
