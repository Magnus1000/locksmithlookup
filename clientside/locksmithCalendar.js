const { Checkbox, FormControlLabel, Typography, Select, MenuItem, Button, makeStyles } = MaterialUI;

const useStyles = makeStyles({
    label: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'center',
      alignItems: 'center',
      gap: '10px',
      minWidth: '100%',
    },
});

const AvailabilitySelector = () => {
    const [availability, setAvailability] = React.useState({
        monday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
        tuesday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
        wednesday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
        thursday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
        friday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
        saturday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
    });
    const classes = React.useStyles();

    const [tempAvailability, setTempAvailability] = React.useState(availability);
    const [isEditing, setIsEditing] = React.useState(false);
  
    const handleEdit = () => {
        setTempAvailability(availability);
        setIsEditing(true);
    };
  
    const handleCancel = () => {
        setTempAvailability(availability);
        setIsEditing(false);
    };
  
    const handleSave = () => {
        setAvailability(tempAvailability);
        setIsEditing(false);
    };

    const handleAvailabilityChange = (day) => {
        setTempAvailability({
            ...tempAvailability,
            [day]: { ...tempAvailability[day], available: !tempAvailability[day].available },
        });
    };
    
    const handleTimeChange = (day, field, value) => {
        setTempAvailability({
            ...tempAvailability,
            [day]: { ...tempAvailability[day], [field]: value },
        });
    };

    const generateTimes = (start, end) => {
        const times = [];
        let current = start;

        while (current <= end) {
            times.push(current);
            current.setMinutes(current.getMinutes() + 30);
        }

        return times;
    };

    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

        return `${formattedHours}:${formattedMinutes}${ampm}`;
    };

    const renderTimeDropdown = (day, field) => (
        <Select
            value={availability[day][field]}
            onChange={(e) => handleTimeChange(day, field, e.target.value)}
        >
            {generateTimes(new Date(2022, 0, 1, 0, 0), new Date(2022, 0, 1, 23, 30)).map((time) => (
                <MenuItem key={formatTime(time)} value={formatTime(time)}>
                    {formatTime(time)}
                </MenuItem>
            ))}
        </Select>
    );

    return (
        <div className="availabilty-page-body">
            <div className="availability-header">
                <Button variant="contained" color="primary" onClick={handleEdit}>
                    Edit
                </Button>
            </div>
            <div className="availability-div-wrapper">
                <div className="availability-header">
                    <Typography variant="h6">Weekly hours</Typography>
                </div>
                <div className="availability-div">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                        <FormControlLabel
                        key={day}
                        control={
                            <Checkbox
                            checked={tempAvailability[day].available}
                            onChange={() => handleAvailabilityChange(day)}
                            disabled={!isEditing}
                            />
                        }
                        label={
                            <span className={classes.label}>
                            <Typography>{day.toUpperCase()}</Typography>
                            {renderTimeDropdown(day, 'startTime')}
                            <Typography variant="body2">-</Typography>
                            {renderTimeDropdown(day, 'endTime')}
                            </span>
                        }
                        />
                    ))}
                </div>
            </div>
            <Button variant="contained" color="primary" onClick={handleCancel}>
                Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSave}>
                Save and Close
            </Button>
        </div>
    );
};

ReactDOM.render(<AvailabilitySelector />, document.getElementById('root'));