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
        // Convert the day of week to lowercase
        const day_of_week = dayOfWeek.trim().toLowerCase();

        // Handle the "Closed" and "Open 24 hours" cases directly
        if (hours.includes('Closed')) {
          return { day_of_week, time_start: 'unavailable', time_end: 'unavailable' };
        } else if (hours.includes('Open 24 hours')) {
          return { day_of_week, time_start: '12:00am', time_end: '11:59pm' };
        } else {
          const [start, end] = hours.split(' - ');
          return { day_of_week, time_start: convertTimeFormat(start), time_end: convertTimeFormat(end) };
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
  // Ensure the string is trimmed and in uppercase for consistent matching
  timeStr = timeStr.trim().toUpperCase();

  // Attempt to match the time format, including handling cases without AM/PM
  const match = timeStr.match(/(\d+):(\d+)(\s?(AM|PM))?/);

  // Check if the time string was matched successfully
  if (!match) {
    console.error('Invalid time format:', timeStr);
    return 'invalid time'; // Or handle this case differently as needed
  }

  let [_, hour, minute, , meridian] = match;
  hour = parseInt(hour, 10);

  // Convert to 12-hour format if meridian is present; default to AM otherwise
  if (!meridian) {
    meridian = hour < 12 ? 'am' : 'pm';
  } else {
    meridian = meridian.toLowerCase();
  }

  // Convert hour in 24-hour time to 12-hour format
  hour = hour % 12 || 12;
  minute = minute.padStart(2, '0');

  return `${hour}:${minute}${meridian}`;
}

