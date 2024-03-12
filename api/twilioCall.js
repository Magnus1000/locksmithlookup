// twilioCall.js
const twilio = require('twilio');

exports.handler = async function (event, context) {
  const { location, userLocation } = JSON.parse(event.body);
  const { DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN, TWILIO_NUMBER } = process.env;

  const client = twilio(DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN);
  const locksmithNumber = '+13656750166'; // Replace with the actual locksmith's number

  try {
    const call = await client.calls.create({
      url: 'URL_TO_YOUR_TWIML_INSTRUCTIONS',
      to: locksmithNumber,
      from: TWILIO_NUMBER,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ callSid: call.sid }),
    };
  } catch (error) {
    console.error('Error initiating Twilio call:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to initiate Twilio call' }),
    };
  }
};