const Twilio = require('twilio');
const cors = require('cors');

const corsHandler = cors({ origin: '*' });

module.exports = (req, res) => {
    // Handle CORS
    corsHandler(req, res, async () => {
        const { DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN, TWILIO_NUMBER } = process.env;
        const client = new Twilio(DEV_TWILIO_ACCOUNT_SID, DEV_TWILIO_TOKEN);

        // Parse the request body
        const body = JSON.parse(req.body || '{}');

        console.log('Request body log:', body);

        // Extract the locksmith's phone number from the request
        const { number } = body;

        if (!number) {
            return res.status(400).send('Locksmith number is required');
        }

        try {
            const call = await client.calls.create({
                url: 'https://locksmithlookup-magnus1000team.vercel.app/api/twiml.js',
                to: number,
                from: TWILIO_NUMBER,
                record: true, // Enable call recording
            });

            console.log(`Call initiated with SID: ${call.sid}`);
            res.status(200).send(`Call initiated: ${call.sid}`);
        } catch (error) {
            console.error(`Error initiating call: ${error.message}`);
            return res.status(500).send('Failed to initiate call');
        }
    });
};