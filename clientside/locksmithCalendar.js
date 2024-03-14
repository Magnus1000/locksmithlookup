const { Checkbox, FormControlLabel, Typography, Select, MenuItem } = MaterialUI;

const AvailabilitySelector = () => {
  const [availability, setAvailability] = React.useState({
    monday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
    tuesday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
    wednesday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
    thursday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
    friday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
    saturday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
  });

  const handleAvailabilityChange = (day) => {
    setAvailability({
      ...availability,
      [day]: { ...availability[day], available: !availability[day].available },
    });
  };

  const handleTimeChange = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: { ...availability[day], [field]: value },
    });
  };

  const renderTimeDropdown = (day, field) => (
    <Select
      value={availability[day][field]}
      onChange={(e) => handleTimeChange(day, field, e.target.value)}
    >
      <MenuItem value="8:30am">8:30am</MenuItem>
      <MenuItem value="8:45am">8:45am</MenuItem>
      <MenuItem value="9:00am">9:00am</MenuItem>
      <MenuItem value="9:15am">9:15am</MenuItem>
      <MenuItem value="9:30am">9:30am</MenuItem>
      <MenuItem value="5:00pm">5:00pm</MenuItem>
    </Select>
  );

  return (
    <div>
      <Typography variant="h6">Weekly hours</Typography>
      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
        <FormControlLabel
          key={day}
          control={
            <Checkbox
              checked={availability[day].available}
              onChange={() => handleAvailabilityChange(day)}
            />
          }
          label={
            <>
              <Typography>{day.toUpperCase()}</Typography>
              {renderTimeDropdown(day, 'startTime')}
              <Typography variant="body2">-</Typography>
              {renderTimeDropdown(day, 'endTime')}
            </>
          }
        />
      ))}
    </div>
  );
};

ReactDOM.render(<AvailabilitySelector />, document.getElementById('root'));