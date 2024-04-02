const cors = require('cors');

// Enable Cross-Origin Resource Sharing (CORS)
const corsHandler = cors({ origin: '*' });

module.exports = (req, res) => {
  corsHandler(req, res, async () => {
    try {
      // Data parsing might not be needed if it's guaranteed to be JSON
      let data = req.body.data;

      // Clean the data by removing extra spaces, line breaks, and special characters
      data = data.replace(/[\n\r\t]+/g, '').replace(/\s{2,}/g, ' ').trim();

      console.log('Data:', data);

      const days = data.split(',');

      const schedule = days.map((day) => {
        const [dayOfWeek, hours] = day.split(': ');
        // Handle the Closed and Open 24 hours cases directly
        if (hours.includes('Closed')) {
          return {
            day_of_week: dayOfWeek.trim().toLowerCase(),
            time_start: 'Closed',
            time_end: 'Closed'
          };
        } else if (hours.includes('Open 24 hours')) {
          return {
            day_of_week: dayOfWeek.trim().toLowerCase(),
            time_start: '12:00am',
            time_end: '11:59pm'
          };
        } else {
          const [start, end] = hours.split(' - ');
          return {
            day_of_week: dayOfWeek.trim().toLowerCase(),
            time_start: convertTimeFormat(start),
            time_end: convertTimeFormat(end)
          };
        }
      });

      res.status(200).json({ schedule });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing request');
    }
  });
};

function convertTimeFormat(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!match) {
    return 'invalid time'; // Or handle this case differently as needed
  }

  let [_, hour, minute, meridian] = match;
  hour = parseInt(hour);

  // No need to convert to 24-hour format, just format it correctly.
  hour = hour.toString().padStart(2, '0');
  minute = minute.padStart(2, '0');

  return `${hour}:${minute}${meridian.toLowerCase()}`;
}

