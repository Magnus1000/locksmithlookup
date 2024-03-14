const Airtable = require('airtable');
const cors = require('cors');
const moment = require('moment-timezone');

// Enable Cross-Origin Resource Sharing (CORS)
const corsHandler = cors({ origin: '*' });

module.exports = (req, res) => {
    corsHandler(req, res, async () => {
        const { lat, lng } = req.query;

        // Initialize Airtable with the API key and base ID
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
        
        // Fetch the current date and time
        const now = new Date();
        console.log('Current Date and Time:', now);

        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Query the availability table for locksmiths available at the current day and time
        const availableLocksmiths = await base('tblnDEcMDY1AXPS39').select({
            filterByFormula: `AND({day_of_week} = '${currentDay}', {time_start} != 'unavailable', {time_end} != 'unavailable')`
        }).all();

        // Log the availability records to the console
        console.log('Initially Available Locksmiths', availableLocksmiths);

        // Convert time strings to iso timestamps
        const availableLocksmithsTimeIso = availableLocksmiths.map(record => {
            const today = moment().format('YYYY-MM-DD');
            const timeStart = moment.tz(`${today} ${record.fields.time_start}`, 'YYYY-MM-DD h:mma', record.fields.locksmith_timezone).toDate();
            console.log('timeStart', timeStart);
            const timeEnd = moment.tz(`${today} ${record.fields.time_end}`, 'YYYY-MM-DD h:mma', record.fields.locksmith_timezone).toDate();
            console.log('timeEnd', timeEnd);
            return { ...record.fields, timeStart, timeEnd };
        });

        // Filter out records where the current time is outside the available time range
        const availableLocksmithsOpen = availableLocksmithsTimeIso.filter(record => {
            return record.timeStart && record.timeEnd && now >= record.timeStart && now <= record.timeEnd;
        });

        // Log the available locksmiths to the console
        console.log('Available Locksmiths after checking opening hours', availableLocksmithsOpen);

        // Check if we have any available locksmiths
        if (availableLocksmithsOpen.length === 0) {
            console.log('No locksmiths available at this time.');
            return res.status(404).json({ error: 'No locksmiths available at this time.' });
        }

        // Map available locksmith IDs to an object for easy access
        const availableLocksmithIds = availableLocksmithsOpen.reduce((acc, record) => {
            if (record.fields && record.fields.locksmith_id) {
                record.fields.locksmith_id.forEach(id => {
                    acc[id] = true;
                });
            }
            return acc;
        }, {});

        // Retrieve all locksmith records
        let locksmithRecords = availableLocksmithIds;

        // Convert lat and lng to numbers
        const latNumber = Number(lat);
        const lngNumber = Number(lng);

        // Calculate the distance between each available locksmith and the provided coordinate
        locksmithRecords = locksmithRecords.map((record) => {
            const recordLat = Number(record.fields.locksmith_lat);
            const recordLng = Number(record.fields.locksmith_lng);
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
