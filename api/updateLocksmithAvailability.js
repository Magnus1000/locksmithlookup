const Airtable = require('airtable');
const cors = require('cors');

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Initialize CORS
const corsHandler = cors({ origin: '*' });

module.exports = (req, res) => {
    corsHandler(req, res, async () => {
        // Parse the request body to extract day, locksmith_id, time_start, and time_end
        const { day_of_week, locksmith_id, time_start, time_end } = req.body;

        // Function to find a record
        const findRecord = async () => {
            const records = await base('Table_Name').select({
                filterByFormula: `AND({day_of_week} = '${day_of_week}', {locksmith_id} = '${locksmith_id}')`
            }).firstPage();
            return records.length > 0 ? records[0] : null;
        };

        // Function to create a new record
        const createRecord = async () => {
            const records = await base('Table_Name').create([
                {
                    fields: {
                        day_of_week,
                        locksmith_id,
                        time_start,
                        time_end
                    }
                }
            ]);
            return records[0];
        };

        // Function to update an existing record
        const updateRecord = async (recordId) => {
            const records = await base('Table_Name').update([
                {
                    id: recordId,
                    fields: {
                        time_start,
                        time_end
                    }
                }
            ]);
            return records[0];
        };

        try {
            // Check if a record exists
            const existingRecord = await findRecord();
            
            let result;
            if (existingRecord) {
                // Update the existing record
                result = await updateRecord(existingRecord.id);
            } else {
                // Create a new record
                result = await createRecord();
            }

            // Respond with the result
            res.json(result);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred while processing the request.' });
        }
    });
};
