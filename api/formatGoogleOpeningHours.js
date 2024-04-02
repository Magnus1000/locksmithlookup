const cors = require('cors');

// Enable Cross-Origin Resource Sharing (CORS)
const corsHandler = cors({ origin: '*' });

module.exports = (req, res) => {
    corsHandler(req, res, async () => {
        // Your logic goes here
        try {
            const text = req.body; // Assuming text is sent in the body of a POST request.
            const days = text.split(', '); // Split the text into individual days

            const schedule = days.map((day) => {
                const [dayOfWeek, hours] = day.split(': '); // Split the day from the hours
                let [start, end] = hours.includes('Closed') ? ['Closed', 'Closed'] : hours.split(' – ');

                // Convert times to a standard format
                start = convertTimeFormat(start);
                end = convertTimeFormat(end);

                return {
                    day_of_week: dayOfWeek.trim(),
                    time_start: start,
                    time_end: end,
                };
            });

            res.status(200).json({ schedule });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error processing request');
        }
    });
};

// Helper function to convert time format from '9:00 AM' to '9:00am'.
function convertTimeFormat(timeStr) {
    if (timeStr === 'Closed') {
        return 'unavailable';
    }
    // Match the parts of the time string
    const match = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i);
    if (!match) {
        return 'invalid time'; // handle invalid time format
    }
    let [_, hour, minute, meridian] = match;

    // Convert hour to 12-hour format and lowercase the meridian
    hour = ('0' + hour).slice(-2); // Add leading 0 if needed
    meridian = meridian.toLowerCase();

    return `${hour}:${minute}${meridian}`;
}