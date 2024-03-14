const Airtable = require('airtable');
const cors = require('cors');

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Initialize CORS
const corsHandler = cors({ origin: '*' });

module.exports = (req, res) => {
    corsHandler(req, res, async () => {
        // Parse the request body to extract locksmith_id and availability
        const { locksmith, availability } = req.body;

        // Transform locksmith into an array (with one locksmith ID) to match the Airtable schema
        const locksmithArray = Array.isArray(locksmith) ? locksmith : [locksmith];

        // Function to find a record
        const findRecord = async (day_of_week) => {
            const records = await base('tblnDEcMDY1AXPS39').select({
                filterByFormula: `AND({day_of_week} = '${day_of_week}', {locksmith} = '${locksmith}')`,
            }).firstPage();
            return records.length > 0 ? records[0] : null;
        };

        // Function to create a new record
        const createRecord = async (day_of_week, time_start, time_end) => {
            const records = await base('tblnDEcMDY1AXPS39').create([
                {
                    fields: {
                        day_of_week,
                        locksmith: locksmithArray,
                        time_start,
                        time_end,
                    },
                },
            ]);
            return records[0];
        };

        // Function to update an existing record
        const updateRecord = async (recordId, time_start, time_end) => {
            const records = await base('tblnDEcMDY1AXPS39').update([
                {
                    id: recordId,
                    fields: {
                        time_start,
                        time_end,
                    },
                },
            ]);
            return records[0];
        };

        try {
            // Loop over the availability array and process each availability object
            for (const { day_of_week, time_start, time_end } of availability) {
                // Check if a record exists
                const existingRecord = await findRecord(day_of_week);

                if (existingRecord) {
                    // Update the existing record
                    await updateRecord(existingRecord.id, time_start, time_end);
                } else {
                    // Create a new record
                    await createRecord(day_of_week, time_start, time_end);
                }
            }

            // Respond with a success message
            res.json({ message: 'Availability updated successfully.' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred while processing the request.' });
        }
    });
};