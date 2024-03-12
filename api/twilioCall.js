const twilio = require('twilio');

exports.handler = async function (event, context) {
    console.log('Event:', event); // Log the event
    console.log('Context:', context); // Log the context

    const { userLocation, number, locksmith } = JSON.parse(event.body);
    console.log('User Location:', userLocation); // Log the user location
    console.log('Number:', number); // Log the number
    console.log('Locksmith:', locksmith); // Log the locksmith

    const { DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN, TWILIO_NUMBER } = process.env;
    console.log('Environment Variables:', DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN, TWILIO_NUMBER); // Log the environment variables

    const client = twilio(DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN);

    try {
        const response = new twilio.twiml.VoiceResponse();
        response.say(`Connecting you to ${locksmith}. Please hold.`);
        const dial = response.dial({ record: 'true' });
        dial.number(number);

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