const twilio = require('twilio');
const { Vonage } = require('@vonage/server-sdk');

class AndroidMessageManager {
    constructor(provider = 'twilio') {
        this.provider = provider;
        this.client = null;
        this.initialized = false;
    }

    // Initialize Twilio client
    initTwilio(accountSid, authToken) {
        this.client = twilio(accountSid, authToken);
        this.initialized = true;
        console.log('Twilio client initialized');
    }

    // Initialize Vonage client
    initVonage(apiKey, apiSecret) {
        this.client = new Vonage({
            apiKey: apiKey,
            apiSecret: apiSecret
        });
        this.initialized = true;
        console.log('Vonage client initialized');
    }

    // Send SMS message
    async sendSMS(to, from, message) {
        if (!this.initialized) {
            throw new Error('Client not initialized. Call initTwilio() or initVonage() first.');
        }

        try {
            if (this.provider === 'twilio') {
                const result = await this.client.messages.create({
                    body: message,
                    from: from,
                    to: to
                });
                return {
                    success: true,
                    messageId: result.sid,
                    status: result.status,
                    provider: 'twilio'
                };
            } else if (this.provider === 'vonage') {
                const result = await this.client.sms.send({
                    to: to,
                    from: from,
                    text: message
                });
                return {
                    success: true,
                    messageId: result.messages[0]['message-id'],
                    status: result.messages[0]['status'],
                    provider: 'vonage'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message,
                provider: this.provider
            };
        }
    }

    // Get message status (Twilio)
    async getMessageStatus(messageSid) {
        if (this.provider !== 'twilio' || !this.initialized) {
            throw new Error('This method is only available for Twilio');
        }

        try {
            const message = await this.client.messages(messageSid).fetch();
            return {
                sid: message.sid,
                status: message.status,
                dateCreated: message.dateCreated,
                dateSent: message.dateSent,
                errorCode: message.errorCode,
                errorMessage: message.errorMessage
            };
        } catch (error) {
            throw new Error(`Failed to get message status: ${error.message}`);
        }
    }

    // List recent messages (Twilio)
    async listMessages(limit = 20) {
        if (this.provider !== 'twilio' || !this.initialized) {
            throw new Error('This method is only available for Twilio');
        }

        try {
            const messages = await this.client.messages.list({ limit: limit });
            return messages.map(message => ({
                sid: message.sid,
                from: message.from,
                to: message.to,
                body: message.body,
                status: message.status,
                dateCreated: message.dateCreated,
                direction: message.direction
            }));
        } catch (error) {
            throw new Error(`Failed to list messages: ${error.message}`);
        }
    }

    // Receive SMS webhook handler (Express.js middleware)
    handleIncomingSMS() {
        return (req, res) => {
            if (this.provider === 'twilio') {
                const message = {
                    from: req.body.From,
                    to: req.body.To,
                    body: req.body.Body,
                    messageSid: req.body.MessageSid,
                    accountSid: req.body.AccountSid
                };
                console.log('Received SMS:', message);
                res.status(200).send('Message received');
                return message;
            } else if (this.provider === 'vonage') {
                const message = {
                    from: req.body.msisdn,
                    to: req.body.to,
                    body: req.body.text,
                    messageId: req.body['message-id'],
                    timestamp: req.body['message-timestamp']
                };
                console.log('Received SMS:', message);
                res.status(200).send('Message received');
                return message;
            }
        };
    }
}

module.exports = AndroidMessageManager;