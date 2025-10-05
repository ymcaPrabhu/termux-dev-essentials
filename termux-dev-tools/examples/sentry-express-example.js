#!/usr/bin/env node

/**
 * Example: Express.js app with Sentry error tracking
 *
 * This example shows how to integrate Sentry with your Express application
 * to track errors, performance issues, and custom events.
 */

// IMPORTANT: Initialize Sentry BEFORE requiring any other modules
const { Sentry, initSentry, captureMessage, captureError, addBreadcrumb } = require('../src/sentry-config');
initSentry();

const express = require('express');
const AndroidMessageManager = require('../src/sms-manager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add breadcrumb for debugging
app.use((req, res, next) => {
  addBreadcrumb(`${req.method} ${req.path}`, {
    url: req.url,
    method: req.method,
    ip: req.ip,
  });
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Express with Sentry!',
    status: 'ok',
  });
});

// Example: Manually capture a message
app.get('/test-message', (req, res) => {
  captureMessage('User accessed test-message endpoint', 'info');
  res.json({ message: 'Message logged to Sentry' });
});

// Example: Route that throws an error (will be caught by error handler)
app.get('/test-error', (req, res, next) => {
  const error = new Error('This is a test error for Sentry!');
  next(error); // Pass to error handler
});

// Example: Async error handling
app.get('/test-async-error', async (req, res, next) => {
  try {
    // Simulate async operation that fails
    await Promise.reject(new Error('Async operation failed'));
  } catch (error) {
    // Manually capture error with context
    captureError(error, {
      route: '/test-async-error',
      timestamp: new Date().toISOString(),
    });
    next(error);
  }
});

// Example: SMS integration with error tracking
app.post('/send-sms', async (req, res, next) => {
  try {
    const { to, from, message } = req.body;

    if (!to || !from || !message) {
      const error = new Error('Missing required fields: to, from, message');
      captureError(error, { body: req.body });
      return res.status(400).json({ error: error.message });
    }

    const smsManager = new AndroidMessageManager('twilio');
    smsManager.initTwilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const result = await smsManager.sendSMS(to, from, message);

    if (!result.success) {
      captureMessage('SMS send failed', 'warning');
    }

    res.json(result);
  } catch (error) {
    captureError(error, {
      route: '/send-sms',
      body: req.body,
    });
    next(error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    sentry: 'enabled',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Error handler - captures errors and sends to Sentry
app.use((err, req, res, next) => {
  // Capture error in Sentry with context
  captureError(err, {
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
  });

  console.error('Error:', err);

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Sentry: ${process.env.SENTRY_DSN ? 'Enabled ✅' : 'Disabled ❌'}`);
  console.log('\nAvailable endpoints:');
  console.log('  GET  /');
  console.log('  GET  /health');
  console.log('  GET  /test-message');
  console.log('  GET  /test-error');
  console.log('  GET  /test-async-error');
  console.log('  POST /send-sms');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
