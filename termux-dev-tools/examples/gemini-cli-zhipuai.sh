#!/usr/bin/env bash

##
# Gemini CLI with ZhipuAI GLM-4.6
#
# This script demonstrates how to use the Gemini CLI tool to interact
# with ZhipuAI's GLM-4.6 model by setting custom environment variables.
#
# Usage:
#   ./examples/gemini-cli-zhipuai.sh "Your prompt here"
#   ./examples/gemini-cli-zhipuai.sh -i  # Interactive mode
##

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables from .env
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [ -f "$PROJECT_ROOT/.env" ]; then
    # shellcheck disable=SC1091
    source "$PROJECT_ROOT/.env"
else
    echo -e "${YELLOW}⚠️  Warning: .env file not found${NC}"
fi

# Check if API key is set
if [ -z "${ZHIPUAI_API_KEY:-}" ]; then
    echo -e "${RED}❌ Error: ZHIPUAI_API_KEY not set${NC}"
    echo -e "${YELLOW}Please set ZHIPUAI_API_KEY in your .env file${NC}"
    echo -e "${BLUE}Example: ZHIPUAI_API_KEY=your_api_key_here${NC}"
    exit 1
fi

# Configure Gemini CLI to use ZhipuAI
export GEMINI_BASE_URL="https://api.z.ai/api/paas/v4"
export GOOGLE_GEMINI_BASE_URL="https://api.z.ai/api/paas/v4"
export GEMINI_BASEURL="https://api.z.ai/api/paas/v4"
export GOOGLE_API_KEY="$ZHIPUAI_API_KEY"

# Display configuration
echo -e "${GREEN}✓ ZhipuAI Configuration Loaded${NC}"
echo -e "${BLUE}  Base URL: $GEMINI_BASE_URL${NC}"
echo -e "${BLUE}  Model: glm-4.6${NC}"
echo ""

# Check if interactive mode is requested
if [ "${1:-}" = "-i" ] || [ "${1:-}" = "--interactive" ]; then
    echo -e "${YELLOW}🚀 Launching Gemini CLI in interactive mode with GLM-4.6...${NC}"
    echo ""
    npx @google/gemini-cli -m glm-4.6 --prompt-interactive "You are now using GLM-4.6 from ZhipuAI"
    exit 0
fi

# Check if prompt is provided
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}Usage:${NC}"
    echo -e "  $0 \"Your prompt here\""
    echo -e "  $0 -i  # Interactive mode"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0 \"Write a Python function to sort a list\""
    echo -e "  $0 \"Explain what Termux is\""
    echo -e "  $0 -i"
    exit 1
fi

# Run Gemini CLI with the provided prompt
echo -e "${YELLOW}🤖 Processing with GLM-4.6...${NC}"
echo ""

npx @google/gemini-cli -m glm-4.6 --prompt "$*"

echo ""
echo -e "${GREEN}✓ Done${NC}"
