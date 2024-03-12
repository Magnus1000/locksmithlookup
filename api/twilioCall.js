const twilio = require('twilio');

exports.handler = async function (event, context) {
    console.log('Event:', event); // Log the event
    console.log('Context:', context); // Log the context

    const { location, userLocation } = JSON.parse(event.body);
    console.log('Location:', location); // Log the location
    console.log('User Location:', userLocation); // Log the user location

    const { DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN, TWILIO_NUMBER } = process.env;
    console.log('Environment Variables:', DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN, TWILIO_NUMBER); // Log the environment variables

    const client = twilio(DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN);
    const locksmithNumber = '+14379797777'; // Replace with the actual locksmith's number

    try {
        const response = new twilio.twiml.VoiceResponse();
        response.say('Connecting you to the locksmith. Please hold.');
        const dial = response.dial({ record: 'true' });
        dial.number(locksmithNumber);

        console.log('TwiML Response:', response.toString()); // Log the TwiML response

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/xml',
            },
            body: response.toString(),
        };
    } catch (error) {
        console.error('Error generating TwiML:', error); // Log the error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate TwiML' }),
        };
    }
};