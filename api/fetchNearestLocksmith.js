const Airtable = require('airtable');
const cors = require('cors');

const corsHandler = cors({ origin: '*' });

module.exports = (req, res) => {
    corsHandler(req, res, async () => {
        const { lat, lng } = req.query;

        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
        let records = await base(process.env.AIRTABLE_TABLE_ID).select().all();

        // Convert lat and lng to numbers
        const latNumber = Number(lat);
        const lngNumber = Number(lng);

        // Calculate the distance between each record and the provided coordinate
        records = records.map((record) => {
            const recordLat = Number(record.fields.lat);
            const recordLng = Number(record.fields.lng);
            const distance = Math.sqrt(Math.pow(recordLat - latNumber, 2) + Math.pow(recordLng - lngNumber, 2));
            return { ...record.fields, distance };
        });

        // Sort the records by distance
        records.sort((a, b) => a.distance - b.distance);

        // Log the first result
        console.log('Nearest Locksmith:', records[0]);

        // Return the record with the smallest distance
        res.status(200).json(records[0]);
    });
};