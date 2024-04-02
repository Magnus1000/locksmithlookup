const cors = require('cors');

// Enable Cross-Origin Resource Sharing (CORS)
const corsHandler = cors({ origin: '*' });

module.exports = (req, res) => {
  corsHandler(req, res, async () => {
    try {
        let data;
        try {
            // Try to parse the data as JSON
            data = JSON.parse(req.body.data);
        } catch (error) {
            // If parsing fails, treat the data as a string
            data = req.body.data;
        }
        console.log('Data:', data);

      const days = data.split(', '); // Split the text into individual days

      const schedule = days.map((day) => {
        const [dayOfWeek, hours] = day.split(': ');
        let [start, end] = hours === 'Open 24 hours'
          ? ['12:00am', '11:59pm']
          : hours.split(' – ');

        start = convertTimeFormat(start);
        end = convertTimeFormat(end);

        return {
          day_of_week: dayOfWeek.trim().toLowerCase(),
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

// Helper function to convert time format
function convertTimeFormat(timeStr) {
  if (timeStr === '12:00am' || timeStr === '11:59pm') {
    return timeStr;
  }

  // Match the parts of the time string
  const match = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!match) {
    return 'invalid time'; // handle invalid time format
  }

  let [_, hour, minute, meridian] = match;
  hour = parseInt(hour);

  // Convert to 12-hour format
  if (meridian.toLowerCase() === 'pm' && hour !== 12) {
    hour += 12;
  } else if (meridian.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }

  // Format hour and minute with leading zeros
  hour = hour.toString().padStart(2, '0');
  minute = minute.padStart(2, '0');

  return `${hour}:${minute}${meridian.toLowerCase()}`;
}