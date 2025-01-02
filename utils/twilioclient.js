// /utils/twilioClient.js

import twilio from 'twilio';

// Use environment variables for sensitive data
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

// Initialize Twilio client
const twilioClient = twilio(accountSid, authToken);

// Export each item individually
export { twilioClient, serviceSid };

