// /utils/twilioClient.js

const twilio = require('twilio');

// Use environment variables for sensitive data
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Twilio Auth Token
const serviceSid = process.env.TWILIO_SERVICE_SID; // Twilio Verify Service SID

// Initialize Twilio client
const twilioClient = twilio(accountSid, authToken);

module.exports = { twilioClient, serviceSid };

