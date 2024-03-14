const Airtable = require('airtable');
const cors = require('cors');

// Enable Cross-Origin Resource Sharing (CORS)
const corsHandler = cors({ origin: '*' });

module.exports = (req, res) => {
    corsHandler(req, res, async () => {
        const { lat, lng } = req.query;

        // Initialize Airtable with the API key and base ID
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
        
        // Fetch the current date and time
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Query the availability table for locksmiths available at the current day and time
        const availabilityRecords = await base('tblnDEcMDY1AXPS39').select({
            filterByFormula: `AND({day_of_week} = '${currentDay}', {time_start} != 'unavailable', {time_end} != 'unavailable')`
        }).all();

        // Log the availability records to the console
        console.log('Initially Available Locksmiths', availabilityRecords);

        // Convert time strings to unix timestamps
        availabilityRecords = availabilityRecords.map(record => {
            const timeStart = new Date(`1970-01-01T${record.fields.time_start}`);
            const timeEnd = new Date(`1970-01-01T${record.fields.time_end}`);
            return { ...record.fields, timeStart, timeEnd };
        });

        // Filter out records where the current time is outside the available time range
        availabilityRecords = availabilityRecords.filter(record => {
            return now >= record.timeStart && now <= record.timeEnd;
        });

        // Log the available locksmiths to the console
        console.log('Available Locksmiths after checking opening hours', availabilityRecords);

        // Check if we have any available locksmiths
        if (availabilityRecords.length === 0) {
            console.log('No locksmiths available at this time.');
            return res.status(404).json({ error: 'No locksmiths available at this time.' });
        }

        // Map available locksmith IDs to an object for easy access
        const availableLocksmithIds = availabilityRecords.reduce((acc, record) => {
            acc[record.fields.locksmith_id] = true;
            return acc;
        }, {});

        // Retrieve all locksmith records
        let locksmithRecords = await base(process.env.AIRTABLE_TABLE_ID).select().all();
        
        // Filter out locksmiths who are not available right now
        locksmithRecords = locksmithRecords.filter(record => availableLocksmithIds[record.id]);

        // Convert lat and lng to numbers
        const latNumber = Number(lat);
        const lngNumber = Number(lng);

        // Calculate the distance between each available locksmith and the provided coordinate
        locksmithRecords = locksmithRecords.map((record) => {
            const recordLat = Number(record.fields.lat);
            const recordLng = Number(record.fields.lng);
            const distance = Math.sqrt(Math.pow(recordLat - latNumber, 2) + Math.pow(recordLng - lngNumber, 2));
            return { ...record.fields, distance };
        });

        // Sort the available locksmiths by distance
        locksmithRecords.sort((a, b) => a.distance - b.distance);

        // Log the nearest available locksmith
        console.log('Nearest Available Locksmith:', locksmithRecords[0]);

        // Return the nearest available locksmith
        res.status(200).json(locksmithRecords[0]);
    });
};
