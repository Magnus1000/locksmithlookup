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

      // Clean the data by removing extra spaces, line breaks, and special characters
      data = data.replace(/[\n\r\t]+/g, '').replace(/\s+/g, ' ').trim();

      console.log('Data:', data);

      const days = data.split(', ');

      const schedule = days.map((day) => {
        const [dayOfWeek, hours] = day.replace(/\s/g, ' ').replace(/–/g, '-').split(': ');
        let [start, end] = hours === 'Open 24 hours'
            ? ['12:00am', '11:59pm']
            : hours.split(' - ');

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

function convertTimeFormat(timeStr) {
  // Check if the input string indicates closure or a 24-hour open schedule first
  if (timeStr === 'Open 24 hours') {
    return ['12:00am', '11:59pm'];
  }

  if (timeStr === 'Closed') {
    return 'Closed'; // or any other appropriate representation for closed times
  }

  // Now handle regular time strings
  const match = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!match) {
    return 'invalid time'; // Or handle this case differently as needed
  }

  let [_, hour, minute, meridian] = match;
  hour = parseInt(hour);

  if (meridian.toLowerCase() === 'pm' && hour !== 12) {
    hour += 12;
  } else if (meridian.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }

  hour = hour.toString().padStart(2, '0');
  minute = minute.padStart(2, '0');

  return `${hour}:${minute}`;
}
