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


    React.useEffect(() => {
        setTempAvailability(availability);
    }, [availability]);
      

    const handleEdit = () => {
        setTempAvailability(availability);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setTempAvailability(availability);
        setIsEditing(false);
    };

    const handleSave = () => {
        // Transform tempAvailability into an array of objects
        const availability = Object.entries(tempAvailability).map(([day_of_week, { startTime, endTime }]) => ({
            day_of_week,
            time_start: startTime,
            time_end: endTime,
        }));

        fetch('https://locksmithlookup-magnus1000team.vercel.app/api/updateLocksmithAvailability.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                locksmith: 'rec84eujtSSmKDves',
                availability,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setAvailability(tempAvailability);
                setIsEditing(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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

    const handle24HoursChange = (day, event) => {
        setTempAvailability({
          ...tempAvailability,
          [day]: { ...tempAvailability[day], startTime: '12:00am', endTime: '11:59pm', allDay: event.target.checked },
        });
    };

    const generateTimes = (start, end) => {
        const times = [];
        let current = new Date(start.getTime());
      
        while (current <= end) {
          times.push(new Date(current.getTime())); // Create a new Date object for each time
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
            value={tempAvailability[day][field]}
            onChange={(e) => handleTimeChange(day, field, e.target.value)}
            disabled={!isEditing}
            sx={{
                height: '44px',
                width: '120px',
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
                                    {tempAvailability[day].available ? (
                                        <div className="dropdown-select-wrapper">
                                        {renderTimeDropdown(day, 'startTime')}
                                        <Typography variant="body2">-</Typography>
                                        {renderTimeDropdown(day, 'endTime')}
                                        </div>
                                    ) : (
                                        <Typography sx={{ marginLeft: '16px', fontSize: '0.75rem' }}>Unavailable</Typography>
                                    )}
                                    </div>
                                </Box>
                                }
                            />
                            {tempAvailability[day].available && (
                                <FormControlLabel
                                control={
                                    <Checkbox
                                    checked={tempAvailability[day].allDay}
                                    onChange={(event) => handle24HoursChange(day, event)}
                                    disabled={!isEditing}
                                    />
                                }
                                label={<Typography sx={{ fontSize: '0.75rem' }}>24 hours</Typography>}
                                />
                            )}
                        </Box>
                    ))}
                </div>
            </div>
            {isEditing ? (
                <div className="availability-button-row-bottom-div">
                    <Button
                        variant="contained"
                        onClick={handleCancel}
                        sx={{
                            borderRadius: 50,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            borderRadius: 50,
                        }}
                    >
                        Save and Close
                    </Button>
                </div>
            ) : null}
        </div>
    );
};

ReactDOM.render(<AvailabilitySelector />, document.getElementById('root'));