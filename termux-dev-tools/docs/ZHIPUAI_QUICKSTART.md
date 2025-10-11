# ZhipuAI GLM-4.6 Quick Start Guide

## Setup (2 minutes)

### 1. Get API Key
Visit: https://open.bigmodel.cn/

### 2. Configure
```bash
# Add to .env file
echo "ZHIPUAI_API_KEY=your_api_key_here" >> .env
```

## Usage

### Option 1: Gemini CLI (Easiest)

```bash
# One-shot query
./examples/gemini-cli-zhipuai.sh "Write a Python hello world"

# Interactive mode
./examples/gemini-cli-zhipuai.sh -i
```

### Option 2: Node.js (Programmatic)

```bash
# Direct CLI usage
node src/zhipuai-client.js "Write a haiku about coding"

# Run test suite
node examples/zhipuai-test.js
```

```javascript
// In your code
const ZhipuAIClient = require('./src/zhipuai-client');
const client = new ZhipuAIClient();

const response = await client.complete('Your prompt here');
console.log(response);
```

## Files Created

```
termux-dev-tools/
├── config/
│   └── zhipuai-gemini.config.sh    # Environment setup script
├── src/
│   └── zhipuai-client.js           # Node.js API client
├── examples/
│   ├── gemini-cli-zhipuai.sh       # Gemini CLI wrapper
│   └── zhipuai-test.js             # Test suite
├── docs/
│   ├── ZHIPUAI_INTEGRATION.md      # Full documentation
│   └── ZHIPUAI_QUICKSTART.md       # This file
└── .env.example                     # Updated with ZhipuAI vars
```

## Quick Examples

### Code Generation
```bash
./examples/gemini-cli-zhipuai.sh "Write a function to validate emails"
```

### Explain Concept
```bash
node src/zhipuai-client.js "Explain async/await in JavaScript"
```

### Multi-turn Chat
```javascript
const client = new ZhipuAIClient();
let conv = [];

const t1 = await client.chat(conv, "What is Node.js?");
console.log(t1.response);
conv = t1.conversation;

const t2 = await client.chat(conv, "Show me an example");
console.log(t2.response);
```

## Troubleshooting

❌ **"API key is required"**
```bash
# Check .env file
cat .env | grep ZHIPUAI_API_KEY
```

❌ **"Command not found: gemini-cli"**
```bash
# Use npx instead
npx @google/gemini-cli --version
```

❌ **Gemini CLI not using ZhipuAI**
```bash
# Use the wrapper script
./examples/gemini-cli-zhipuai.sh "test"

# OR manually export
export GEMINI_BASE_URL="https://api.z.ai/api/paas/v4"
export GOOGLE_API_KEY="$ZHIPUAI_API_KEY"
```

## Next Steps

1. Read full documentation: `docs/ZHIPUAI_INTEGRATION.md`
2. Run the test suite: `node examples/zhipuai-test.js`
3. Try interactive mode: `./examples/gemini-cli-zhipuai.sh -i`

## Resources

- 📚 [Full Documentation](./ZHIPUAI_INTEGRATION.md)
- 🌐 [ZhipuAI Platform](https://open.bigmodel.cn/)
- 📖 [API Docs](https://docs.z.ai/guides/llm/glm-4.6)
