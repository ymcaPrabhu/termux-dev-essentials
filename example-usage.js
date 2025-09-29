const AndroidMessageManager = require('./sms-manager');

// Example usage for Twilio
async function twilioExample() {
    const smsManager = new AndroidMessageManager('twilio');

    // Initialize with your Twilio credentials
    smsManager.initTwilio('YOUR_TWILIO_ACCOUNT_SID', 'YOUR_TWILIO_AUTH_TOKEN');

    // Send an SMS
    const result = await smsManager.sendSMS(
        '+1234567890',        // to
        '+0987654321',        // from (your Twilio number)
        'Hello from Node.js!' // message
    );

    console.log('SMS Result:', result);

    // Get message status
    if (result.success) {
        const status = await smsManager.getMessageStatus(result.messageId);
        console.log('Message Status:', status);
    }

    // List recent messages
    const messages = await smsManager.listMessages(10);
    console.log('Recent Messages:', messages);
}

// Example usage for Vonage
async function vonageExample() {
    const smsManager = new AndroidMessageManager('vonage');

    // Initialize with your Vonage credentials
    smsManager.initVonage('YOUR_VONAGE_API_KEY', 'YOUR_VONAGE_API_SECRET');

    // Send an SMS
    const result = await smsManager.sendSMS(
        '1234567890',         // to
        'YourBrand',          // from (sender ID)
        'Hello from Vonage!'  // message
    );

    console.log('SMS Result:', result);
}

// Express.js webhook example
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

const smsManager = new AndroidMessageManager('twilio');
smsManager.initTwilio('YOUR_ACCOUNT_SID', 'YOUR_AUTH_TOKEN');

// Webhook endpoint for receiving SMS
app.post('/webhook/sms', smsManager.handleIncomingSMS());

app.listen(3000, () => {
    console.log('SMS webhook server running on port 3000');
});

// Uncomment to run examples
// twilioExample().catch(console.error);
// vonageExample().catch(console.error);