const Airtable = require('airtable');
const cors = require('cors');

const corsHandler = cors();

module.exports = async (req, res) => {
  try {
    console.log('Inside the serverless function...');
    console.log('Request body:', req.body);

    corsHandler(req, res, async () => {
      const base = new Airtable({ apiKey: process.env.NOTHING_BORROWED_AIRTABLE_KEY }).base('appeQDyyi60ImJnAJ');
      const table = base('calendar');

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

      const filterByFormula = `AND(MONTH({date_time}) = ${month}, YEAR({date_time}) = ${year})`;

      try {
        const records = await table.select({
          filterByFormula: filterByFormula,
          sort: [{ field: 'date_time', direction: 'asc' }],
        }).all();

        const slots = records.map(record => ({
          id: record.id,
          slot_name: record.get('slot_name'),
          date_time: record.get('date_time'),
          status: record.get('status')
        }));

        res.status(200).json(slots);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch records from Airtable' });
      }
    });
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};