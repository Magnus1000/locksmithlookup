//import React, { useState } from 'react';
//import { Checkbox, FormControlLabel, Typography } from '@mui/material';

const AvailabilitySelector = () => {
  const [availability, setAvailability] = useState({
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });

  const handleChange = (day) => {
    setAvailability({ ...availability, [day]: !availability[day] });
  };

  return (
    <div>
      <Typography variant="h6">Weekly hours</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={availability.tuesday}
            onChange={() => handleChange('tuesday')}
          />
        }
        label={
          <>
            <Typography>TUE</Typography>
            <Typography variant="body2">9:00am - 5:00pm</Typography>
          </>
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={availability.wednesday}
            onChange={() => handleChange('wednesday')}
          />
        }
        label={
          <>
            <Typography>WED</Typography>
            <Typography variant="body2">9:00am - 5:00pm</Typography>
          </>
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={availability.thursday}
            onChange={() => handleChange('thursday')}
          />
        }
        label={
          <>
            <Typography>THU</Typography>
            <Typography variant="body2">9:00am - 5:00pm</Typography>
          </>
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={availability.friday}
            onChange={() => handleChange('friday')}
          />
        }
        label={
          <>
            <Typography>FRI</Typography>
            <Typography variant="body2">9:00am - 5:00pm</Typography>
          </>
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={availability.saturday}
            onChange={() => handleChange('saturday')}
          />
        }
        label={
          <>
            <Typography>SAT</Typography>
            <Typography variant="body2">9:00am - 5:00pm</Typography>
          </>
        }
      />
    </div>
  );
};

ReactDOM.render(React.createElement(AvailabilitySelector), document.getElementById('root'));