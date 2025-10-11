#!/usr/bin/env bash
# ZhipuAI GLM-4.6 Configuration for Gemini CLI
# This script configures environment variables to use ZhipuAI's API with Gemini CLI

set -euo pipefail

# Load environment variables from .env file
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

# ZhipuAI API Configuration
export GEMINI_BASE_URL="https://api.z.ai/api/paas/v4"
export GOOGLE_GEMINI_BASE_URL="https://api.z.ai/api/paas/v4"
export GEMINI_BASEURL="https://api.z.ai/api/paas/v4"

# Set the API key from environment variable
if [ -n "${ZHIPUAI_API_KEY:-}" ]; then
    export GOOGLE_API_KEY="$ZHIPUAI_API_KEY"
fi

# Default model configuration
export GEMINI_MODEL="glm-4.6"

echo "✓ ZhipuAI GLM-4.6 configuration loaded"
echo "  Base URL: $GEMINI_BASE_URL"
echo "  Model: $GEMINI_MODEL"
echo ""
echo "Usage:"
echo "  source config/zhipuai-gemini.config.sh"
echo "  npx @google/gemini-cli -m glm-4.6 'Your prompt here'"
