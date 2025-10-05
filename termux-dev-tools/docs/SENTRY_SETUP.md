# Sentry Integration Guide

This guide explains how to use Sentry for error tracking and monitoring in your termux-dev-tools project.

## Overview

Sentry is now integrated into your project to automatically track:
- **Errors and Exceptions** - All uncaught errors are automatically captured
- **Performance Issues** - Monitor API response times and slow operations
- **Custom Events** - Log custom messages and breadcrumbs for debugging

## Project Details

- **Sentry Organization**: `amit-pb`
- **Project Name**: `termux-dev-tools`
- **Project Slug**: `termux-dev-tools`
- **Dashboard**: https://amit-pb.sentry.io/projects/termux-dev-tools/

## Setup

### 1. Environment Variables

Your `.env` file has been created with the Sentry DSN:

```env
SENTRY_DSN=https://89a8efc1e2e5a11bddcfa19dc96a154a@o4510135080976384.ingest.de.sentry.io/4510135188127824
NODE_ENV=development
```

### 2. Running the Example

Start the Express server with Sentry enabled:

```bash
# Run the example server
npm start

# Or with auto-reload during development
npm run dev
```

The server will start on port 3000 with the following endpoints:

- `GET /` - Health check
- `GET /health` - Detailed health status
- `GET /test-message` - Test Sentry message logging
- `GET /test-error` - Test error tracking (throws an error)
- `GET /test-async-error` - Test async error handling
- `POST /send-sms` - Send SMS with error tracking

### 3. Testing Error Tracking

**Test automatic error capture:**
```bash
curl http://localhost:3000/test-error
```

**Test message logging:**
```bash
curl http://localhost:3000/test-message
```

**Test async error handling:**
```bash
curl http://localhost:3000/test-async-error
```

All errors will be automatically sent to Sentry and appear in your dashboard.

## Using Sentry in Your Code

### Basic Integration

```javascript
// Initialize Sentry at the start of your application
const { initSentry, captureError, captureMessage, addBreadcrumb } = require('./src/sentry-config');
initSentry();
```

### Express.js Integration

```javascript
const express = require('express');
const Sentry = require('@sentry/node');
const { initSentry } = require('./src/sentry-config');

// IMPORTANT: Initialize Sentry FIRST
initSentry();

const app = express();

// Add Sentry request handler (must be first middleware)
app.use(Sentry.Handlers.requestHandler());

// Add Sentry tracing for performance monitoring
app.use(Sentry.Handlers.tracingHandler());

// ... your routes ...

// Add Sentry error handler (must be before other error handlers)
app.use(Sentry.Handlers.errorHandler());
```

### Capturing Errors Manually

```javascript
const { captureError, captureMessage, addBreadcrumb } = require('./src/sentry-config');

try {
  // Your code that might throw an error
  await riskyOperation();
} catch (error) {
  // Capture error with additional context
  captureError(error, {
    operation: 'riskyOperation',
    userId: user.id,
    timestamp: new Date().toISOString(),
  });
}
```

### Logging Messages

```javascript
const { captureMessage } = require('./src/sentry-config');

// Log informational messages
captureMessage('User completed onboarding', 'info');

// Log warnings
captureMessage('API rate limit approaching', 'warning');

// Log errors
captureMessage('Configuration file missing', 'error');
```

### Adding Breadcrumbs

```javascript
const { addBreadcrumb } = require('./src/sentry-config');

// Add breadcrumb for debugging
addBreadcrumb('User clicked submit button', {
  formId: 'signup-form',
  userId: user.id,
});

// Breadcrumbs help you understand what happened before an error
```

### Setting User Context

```javascript
const { setUser } = require('./src/sentry-config');

// Add user information to error reports
setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});
```

## Best Practices

### 1. **Initialize Early**
Always initialize Sentry at the very beginning of your application, before any other modules are loaded.

### 2. **Don't Log Sensitive Data**
Never capture passwords, API keys, or other sensitive information:

```javascript
// BAD - Don't do this
captureError(error, {
  password: user.password,  // ❌
  apiKey: process.env.API_KEY,  // ❌
});

// GOOD - Only capture safe data
captureError(error, {
  userId: user.id,  // ✅
  operation: 'login',  // ✅
});
```

### 3. **Add Context to Errors**
Always include relevant context when capturing errors:

```javascript
captureError(error, {
  route: req.path,
  method: req.method,
  userId: req.user?.id,
  timestamp: new Date().toISOString(),
});
```

### 4. **Use Breadcrumbs**
Add breadcrumbs throughout your application to help debug issues:

```javascript
addBreadcrumb('Starting payment process', { amount: 100, currency: 'USD' });
// ... payment processing code ...
addBreadcrumb('Payment completed', { transactionId: '12345' });
```

### 5. **Monitor Performance**
Use Sentry's performance monitoring to track slow operations:

```javascript
const transaction = Sentry.startTransaction({
  name: 'Process Payment',
  op: 'payment',
});

try {
  await processPayment();
  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('internal_error');
  throw error;
} finally {
  transaction.finish();
}
```

## Configuration Options

The Sentry configuration is in `src/sentry-config.js`. You can customize:

- **Sample Rates**: Adjust `tracesSampleRate` and `profilesSampleRate`
- **Environment**: Set via `NODE_ENV` environment variable
- **Release Tracking**: Uncomment the `release` option
- **Before Send Hook**: Filter or modify events before sending

## Viewing Issues in Sentry

1. Visit your Sentry dashboard: https://amit-pb.sentry.io
2. Select the **termux-dev-tools** project
3. View all captured issues, performance metrics, and events
4. Set up alerts and notifications as needed

## Troubleshooting

**Issues not appearing in Sentry?**
- Check that `SENTRY_DSN` is set in your `.env` file
- Verify Sentry is initialized before other modules
- Check console for "✅ Sentry initialized successfully" message
- Ensure you're in a valid network environment

**Too many errors being logged?**
- Adjust sample rates in `src/sentry-config.js`
- Use the `beforeSend` hook to filter out specific errors
- Configure error filtering in the Sentry dashboard

## Next Steps

1. ✅ Sentry is now tracking errors in your application
2. Configure alert rules in Sentry dashboard
3. Set up release tracking for version monitoring
4. Integrate with your CI/CD pipeline
5. Add performance monitoring to critical operations

## Resources

- [Sentry Node.js Documentation](https://docs.sentry.io/platforms/node/)
- [Express.js Integration](https://docs.sentry.io/platforms/node/guides/express/)
- [Performance Monitoring](https://docs.sentry.io/platforms/node/performance/)
