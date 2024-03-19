const Airtable = require('airtable');
const cors = require('cors');
const moment = require('moment-timezone');

// Enable Cross-Origin Resource Sharing (CORS)
const corsHandler = cors({ origin: '*' });

module.exports = (req, res) => {
    corsHandler(req, res, async () => {
        const { lat, lng, tz: userTimezone } = req.query;

        // Initialize Airtable with the API key and base ID
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
        
        // Fetch the current date and time in the user's timezone
        const now = moment.tz(userTimezone);
        console.log('Current Date and Time:', now);
        console.log('Current Timezone:', userTimezone);

        const currentDay = now.format('dddd').toLowerCase();
        console.log('Current Day:', currentDay);

        // Query the availability table for locksmiths available at the current day and time
        const availableLocksmiths = await base('tblnDEcMDY1AXPS39').select({
            filterByFormula: `AND({day_of_week} = '${currentDay}', {time_start} != 'unavailable', {time_end} != 'unavailable')`
        }).all();

        // Convert time strings to iso timestamps
        const availableLocksmithsTimeIso = availableLocksmiths.map(record => {
            const timeStart = moment.tz(`${currentDay} ${record.fields.time_start}`, 'dddd h:mma', record.fields.locksmith_timezone);
            const timeEnd = moment.tz(`${currentDay} ${record.fields.time_end}`, 'dddd h:mma', record.fields.locksmith_timezone); 
            return { ...record.fields, timeStart, timeEnd };
        });
        

        // Filter out records where the current time is outside the available time range
        const availableLocksmithsOpen = availableLocksmithsTimeIso.filter(record => {
            return record.timeStart && record.timeEnd && now.isBetween(record.timeStart, record.timeEnd);
        });

        // Check if we have any available locksmiths
        if (availableLocksmithsOpen.length === 0) {
            console.log('No locksmiths available at this time.');
            return res.status(404).json({ error: 'No locksmiths available at this time.' });
        }

        // Retrieve all locksmith records
        let locksmithRecords = availableLocksmithsOpen;

        // Convert lat and lng to numbers
        const latNumber = Number(lat);
        const lngNumber = Number(lng);

        const toRadians = (degrees) => degrees * (Math.PI / 180);

        const calculateDistance = (lat1, lng1, lat2, lng2) => {
          const R = 6371; // Earth's radius in kilometers
          const dLat = toRadians(lat2 - lat1);
          const dLng = toRadians(lng2 - lng1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;
          return distance;
        };
        
        // Calculate the distance between each available locksmith and the provided coordinate
        locksmithRecords = locksmithRecords.map((record) => {
          const recordLat = Number(record.locksmith_lat[0]);
          const recordLng = Number(record.locksmith_lng[0]);
          const distance = calculateDistance(latNumber, lngNumber, recordLat, recordLng);
          return { ...record, distance };
        });

        // Sort the available locksmiths by distance
        locksmithRecords.sort((a, b) => a.distance - b.distance);

        // Log the nearest available locksmith
        console.log('Nearest Available Locksmiths:', locksmithRecords);

        // Return the nearest available locksmith
        res.status(200).json(locksmithRecords);
    });
};
