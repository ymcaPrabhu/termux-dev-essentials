# Twilio MCP Server Setup Guide

This guide explains how to add the Twilio MCP (Model Context Protocol) server to Claude Code, enabling AI-powered Twilio operations.

## What is Twilio MCP?

The Twilio Alpha MCP server exposes **1,400+ Twilio API endpoints** via the Model Context Protocol, allowing you to:
- Send SMS messages
- Make phone calls
- Manage phone numbers
- Access call logs
- Configure Twilio services
- And much more - all through natural language!

## Prerequisites

1. **Twilio Account**: Sign up at https://www.twilio.com
2. **Twilio API Credentials**:
   - Account SID
   - API Key
   - API Secret

### Get Your Twilio Credentials

1. Log in to [Twilio Console](https://console.twilio.com/)
2. **Account SID**: Found on your dashboard home page
3. **API Key & Secret**:
   - Go to Account → API Keys & Tokens
   - Create a new Standard API Key
   - Save your API Key SID and Secret (secret shown only once!)

## Installation

### Method 1: Using /mcp Command (Recommended)

Simply run this command in Claude Code:

```
/mcp add {
  "mcpServers": {
    "twilio": {
      "command": "npx",
      "args": [
        "-y",
        "@twilio-alpha/mcp",
        "YOUR_ACCOUNT_SID/YOUR_API_KEY:YOUR_API_SECRET"
      ]
    }
  }
}
```

**Replace** with your actual credentials:
- `YOUR_ACCOUNT_SID` - Your Twilio Account SID
- `YOUR_API_KEY` - Your Twilio API Key SID
- `YOUR_API_SECRET` - Your Twilio API Secret

**Example**:
```
/mcp add {
  "mcpServers": {
    "twilio": {
      "command": "npx",
      "args": [
        "-y",
        "@twilio-alpha/mcp",
        "AC1234567890abcdef/SK1234567890abcdef:your_api_secret_here"
      ]
    }
  }
}
```

### Method 2: Advanced Configuration with Services/Tags

For specific Twilio services only:

```
/mcp add {
  "mcpServers": {
    "twilio": {
      "command": "npx",
      "args": [
        "-y",
        "@twilio-alpha/mcp",
        "YOUR_ACCOUNT_SID/YOUR_API_KEY:YOUR_API_SECRET",
        "--services",
        "twilio_api_v2010",
        "--tags",
        "Api20100401IncomingPhoneNumber,Api20100401Message"
      ]
    }
  }
}
```

**Available Services**:
- `twilio_api_v2010` - Core Twilio API (SMS, Calls, Phone Numbers)
- `twilio_messaging` - Messaging services
- `twilio_voice` - Voice services
- `twilio_video` - Video services
- `twilio_verify` - Verification API
- `twilio_conversations` - Conversations API

## Verification

After adding the MCP server, restart Claude Code and run:

```
/mcp
```

You should see "twilio" in the list of connected MCP servers.

## Testing Your Setup

Try these example commands in Claude Code:

### 1. List Phone Numbers
```
List all phone numbers in my Twilio account
```

### 2. Send SMS
```
Send an SMS to +1234567890 saying "Hello from Twilio MCP!"
```

### 3. Check Recent Messages
```
Show me the last 5 SMS messages sent from my Twilio account
```

### 4. Get Account Info
```
What's my Twilio account balance?
```

### 5. Create a Phone Number
```
Buy a new phone number with area code 415
```

## Environment Variables (Alternative Method)

Instead of passing credentials in the command, you can use environment variables:

1. Add to your `.env` file:
```env
TWILIO_ACCOUNT_SID=AC1234567890abcdef
TWILIO_API_KEY=SK1234567890abcdef
TWILIO_API_SECRET=your_api_secret_here
```

2. Update MCP configuration:
```json
{
  "mcpServers": {
    "twilio": {
      "command": "npx",
      "args": ["-y", "@twilio-alpha/mcp"],
      "env": {
        "TWILIO_ACCOUNT_SID": "${TWILIO_ACCOUNT_SID}",
        "TWILIO_API_KEY": "${TWILIO_API_KEY}",
        "TWILIO_API_SECRET": "${TWILIO_API_SECRET}"
      }
    }
  }
}
```

## Security Best Practices

### ⚠️ IMPORTANT Security Notes:

1. **Never commit credentials to Git**
   - `.env` file is already in `.gitignore`
   - API secrets are shown only once when created

2. **Use API Keys, not Auth Tokens**
   - API Keys can be revoked independently
   - Create separate keys for different environments

3. **Limit API Key Permissions**
   - Only grant necessary permissions
   - Use separate keys for different applications

4. **Rotate Keys Regularly**
   - Rotate API keys every 90 days
   - Immediately rotate if compromised

## Troubleshooting

### MCP Server Not Showing Up

1. Check credentials format:
   ```
   ACCOUNT_SID/API_KEY:API_SECRET
   ```

2. Verify credentials are correct:
   - Log into Twilio Console
   - Check Account SID matches
   - Regenerate API Key if needed

3. Restart Claude Code:
   ```
   /exit
   ```
   Then start Claude Code again

### Authentication Errors

```
Error: Authentication failed
```

**Solution**: Double-check your credentials:
- Account SID starts with `AC`
- API Key SID starts with `SK`
- API Secret is correct (regenerate if lost)

### Rate Limiting

```
Error: Too many requests
```

**Solution**: Twilio has rate limits. Wait a moment and try again.

## Features & Capabilities

With Twilio MCP, you can:

### Messaging
- ✅ Send SMS messages
- ✅ Send MMS messages
- ✅ Check message status
- ✅ View message history
- ✅ Configure messaging services

### Voice
- ✅ Make phone calls
- ✅ View call logs
- ✅ Configure voice apps
- ✅ Manage call recordings

### Phone Numbers
- ✅ Search available numbers
- ✅ Purchase phone numbers
- ✅ Configure number settings
- ✅ Release phone numbers

### Account Management
- ✅ View account details
- ✅ Check balance
- ✅ View usage statistics
- ✅ Manage sub-accounts

## Performance Benefits

According to Twilio's benchmarking:
- **20.5% faster** task completion on average
- **100% success rate** (vs 92.3% without MCP)
- **27.5% higher cost** due to caching operations

## Additional Resources

- **Twilio MCP Blog**: https://www.twilio.com/blog/introducing-twilio-alpha-mcp-server
- **npm Package**: https://www.npmjs.com/package/@twilio-alpha/mcp
- **Twilio Docs**: https://www.twilio.com/docs
- **MCP Specification**: https://modelcontextprotocol.io/

## Example Use Cases

### 1. Send Bulk SMS
```
Send an SMS to the following numbers with a reminder about tomorrow's meeting:
+1234567890, +1987654321, +1555666777
```

### 2. Call Log Analysis
```
Show me all calls from the last week and summarize the total duration by phone number
```

### 3. Number Management
```
Find and purchase a toll-free number in the 800 area code, then configure it to forward to +1234567890
```

### 4. Automated Notifications
```
Send an SMS notification to +1234567890 whenever an error occurs in my application
```

## Support

For issues:
- Twilio Support: https://support.twilio.com
- Twilio MCP GitHub: https://github.com/twilio-labs/mcp
- Claude Code: https://github.com/anthropics/claude-code/issues

---

**Ready to get started?** Add the Twilio MCP server using the `/mcp add` command above!
