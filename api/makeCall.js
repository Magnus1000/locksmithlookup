const Twilio = require('twilio');
const cors = require('cors');

const corsHandler = cors({ origin: '*' });

module.exports = (req, res) => {
    // Handle CORS
    corsHandler(req, res, async () => {
        const { TWILIO_ACCOUNT_SID, TWILIO_TOKEN, TWILIO_NUMBER } = process.env;
        const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_TOKEN);

        // Extract the locksmith's phone number from the request
        const { number } = req.body;

        // Log the number to the console
        console.log('Locksmith number:', number);

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