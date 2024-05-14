const axios = require('axios');
const cors = require('cors');

const corsHandler = cors();

module.exports = async (req, res) => {
  try {
    console.log('Inside the serverless function...');
    console.log('Request body:', req.body);

    corsHandler(req, res, async () => {
      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }

      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
      }

      const { event, url, userId } = req.body;

      if (!event || !url || !userId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const webhookUrl = 'https://hook.us1.make.com/cdvufir2lor6s2budxrrtt3rd1bfb6vm';

      const data = {
        event,
        url,
        userId
      };

      await axios.post(webhookUrl, data);

      res.status(200).json({ message: 'Event sent successfully' });
    });
  } catch (error) {
    console.error('Error sending event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};