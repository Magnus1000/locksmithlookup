const { Checkbox, FormControlLabel, Typography, Select, MenuItem, Button, Box } = MaterialUI;

const AvailabilitySelector = () => {
    const [availability, setAvailability] = React.useState({
        monday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
        tuesday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
        wednesday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
        thursday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
        friday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
        saturday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
        sunday: { available: true, startTime: '9:00am', endTime: '5:00pm' },
    });

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
            sx={{
                height: '44px',
                width: '80px',
            }}
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
            <div className="availability-button-row-top-div">
                <Button variant="contained" 
                    onClick={handleEdit}
                    sx={{
                        borderRadius: 50
                    }}
                >
                    Edit
                </Button>
            </div>
            <div className="availability-div-wrapper">
                <div className="availability-header">
                    <Typography variant="h6">Weekly hours</Typography>
                </div>
                <div className="availability-div">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%',
                            }}
                        >
                            <FormControlLabel
                                key={day}
                                control={
                                    <Checkbox
                                        checked={tempAvailability[day].available}
                                        onChange={() => handleAvailabilityChange(day)}
                                        disabled={!isEditing}
                                    />
                                }
                                style={{
                                    width: '100%',
                                    backgroundColor: 'blue',
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                                label={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignContent: 'center',
                                            alignItems: 'center',
                                            gap: '10px',
                                            minWidth: '100%',
                                            justifyContent: 'space-between',
                                            flex: 1,
                                        }}
                                    >
                                    <div className="label-field-wrapper">
                                        <Typography sx={{ textTransform: 'capitalize', width: '100px' }}>{day}</Typography>
                                        <div className="dropdown-select-wrapper">
                                            {renderTimeDropdown(day, 'startTime')}
                                            <Typography variant="body2">-</Typography>
                                            {renderTimeDropdown(day, 'endTime')}
                                        </div>
                                    </div>
                                    </Box>
                                }
                            />
                        </Box>
                    ))}
                </div>
            </div>
            <Button variant="contained" 
                onClick={handleCancel}
                sx={{
                    borderRadius: 50
                }}
            >
                Cancel
            </Button>
            <Button variant="contained" 
                onClick={handleSave}
                sx={{
                    borderRadius: 50
                }}
            >
                Save and Close
            </Button>
        </div>
    );
};

ReactDOM.render(<AvailabilitySelector />, document.getElementById('root'));