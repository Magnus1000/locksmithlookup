const twilio = require('twilio');

exports.handler = async function (event, context) {
  const { location, userLocation } = JSON.parse(event.body);
  const { DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN, TWILIO_NUMBER } = process.env;

  const client = twilio(DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN);
  const locksmithNumber = '+14379797777'; // Replace with the actual locksmith's number

  try {
    const response = new twilio.twiml.VoiceResponse();
    response.say('Connecting you to the locksmith. Please hold.');
    const dial = response.dial({ record: 'true', recordingStatusCallback: 'https://your-domain.com/path/to/recording-callback' });
    dial.number(locksmithNumber);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: response.toString(),
    };
  } catch (error) {
    console.error('Error generating TwiML:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate TwiML' }),
    };
  }
};