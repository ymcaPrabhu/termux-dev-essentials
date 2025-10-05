const Sentry = require('@sentry/node');
require('dotenv').config();

/**
 * Initialize Sentry for error tracking and monitoring
 * Call this function at the start of your application
 */
function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',

    // Set sample rate for performance monitoring
    tracesSampleRate: 1.0,

    // Capture 100% of transactions for performance monitoring in development
    // Adjust this value in production based on your needs
    profilesSampleRate: 1.0,

    // Enable automatic session tracking
    autoSessionTracking: true,

    // Release tracking (optional - uncomment and set when using releases)
    // release: process.env.npm_package_version,

    // Configure integrations
    integrations: [
      // Add custom integrations here if needed
    ],

    // Before send hook - use to filter or modify events before sending
    beforeSend(event, hint) {
      // Filter out certain errors if needed
      // Example: if (event.exception) { return null; }
      return event;
    },
  });

  console.log('✅ Sentry initialized successfully');
}

/**
 * Manually capture an exception
 * @param {Error} error - The error to capture
 * @param {Object} context - Additional context for the error
 */
function captureError(error, context = {}) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Manually capture a message
 * @param {string} message - The message to capture
 * @param {string} level - Severity level (fatal, error, warning, info, debug)
 */
function captureMessage(message, level = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Set user context for better error tracking
 * @param {Object} user - User information
 */
function setUser(user) {
  Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging
 * @param {string} message - Breadcrumb message
 * @param {Object} data - Additional data
 */
function addBreadcrumb(message, data = {}) {
  Sentry.addBreadcrumb({
    message,
    data,
    level: 'info',
  });
}

module.exports = {
  Sentry,
  initSentry,
  captureError,
  captureMessage,
  setUser,
  addBreadcrumb,
};
