const twilio = require('twilio');
const cors = require('cors');

const corsHandler = cors({ origin: '*' });

module.exports = async function (req, res) {
    // Handle CORS
    corsHandler(req, res, async () => {
        console.log('Event:', req); 

        const { userLocation, number, locksmith } = req.body;
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

            return res.status(200).send(response.toString());
        } catch (error) {
            console.error('Error generating TwiML:', error); // Log the error
            return res.status(500).send({ error: 'Failed to generate TwiML' });
        }
    });
};