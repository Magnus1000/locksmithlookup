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

        console.log('availability:', availability);

        fetch('https://locksmithlookup-magnus1000team.vercel.app/api/updateLocksmithAvailability.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                locksmith: 'recJpkfvlundnly50',
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
        // Check if the day is currently unavailable
        const isCurrentlyUnavailable = !tempAvailability[day].available;

        console.log('isCurrentlyUnavailable:', isCurrentlyUnavailable);
    
        // If available = false, set times to "unavailable"
        const newStartTime = isCurrentlyUnavailable ? tempAvailability[day].prev_time_start : "unavailable";
        const newEndTime = isCurrentlyUnavailable ? tempAvailability[day].prev_time_end : "unavailable";

        console.log('newStartTime:', newStartTime);
        console.log('newEndTime:', newEndTime);
    
        setTempAvailability({
            ...tempAvailability,
            [day]: {
                ...tempAvailability[day],
                available: !tempAvailability[day].available, // toggle the availability
                startTime: newStartTime,
                endTime: newEndTime,
                // Update prev_time_start and prev_time_end only if we are toggling to unavailable
                prev_time_start: isCurrentlyUnavailable ? tempAvailability[day].prev_time_start : tempAvailability[day].time_start,
                prev_time_end: isCurrentlyUnavailable ? tempAvailability[day].prev_time_end : tempAvailability[day].time_end,
            },
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

const VerticalNav = ({ setActivePage }) => {
    // Assuming you might want to manage which menu item is active
    const [activeItem, setActiveItem] = React.useState('dashboard');
  
    // This effect runs once when the component is mounted.
    React.useEffect(() => {
      // Any initialization can go here
    }, []);
  
    // Handler for navigation item clicks
    const handleNavClick = (item) => {
      setActiveItem(item);
      console.log('The active vertical nav item is:', item);
      setActivePage(item);
      console.log('The active page is:', item);
      // Here you can also add any actions to perform on navigation item click
      // For example, redirecting to a different page or changing the view
    };
  
    return (
      <div id="verticalNav" className="vertical-nav-wrapper">
        <div className="vertical-nav-menu-wrapper">
          <a href="#" className="vertical-nav-logo-wrapper w-inline-block">
            <img
              src="https://assets-global.website-files.com/65f04d35c17450fc8221d933/65f36c6ba6275a8d3638ddd4_eagledutylogo-clear.svg"
              loading="lazy"
              width="71.5"
              alt=""
              className="vertical-nav-image"
            />
            <div className="vertical-nav-text-wrapper">
              <div className="logo-text-dashboard">Locksmith Dispatch</div>
            </div>
          </a>
          <div
            id="dashboardButton"
            className={`vertical-nav-menu-item ${activeItem === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="nav-menu-text">Dashboard</div>
          </div>
          <div
            id="calenderButton"
            className={`vertical-nav-menu-item ${activeItem === 'calendar' ? 'active' : ''}`}
            onClick={() => handleNavClick('calendar')}
          >
            <div className="nav-menu-text">Calendar</div>
          </div>
        </div>
      </div>
    );
};

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="dashboard-div">Div 1</div>
            <div className="dashboard-div">Div 2</div>
            <div className="dashboard-div">Div 3</div>
            <div className="dashboard-div">Div 4</div>
        </div>
    );
};

// Create the parent component App and mount it to the root element
const App = () => {
    const [activePage, setActivePage] = React.useState('dashboard');

    return (
        <>
            <div className="vertical-nav-wrapper">
                <VerticalNav setActivePage={setActivePage} />
            </div>
            <div className="vertical-nav-content">
                {activePage === 'dashboard' && <Dashboard />}
                {activePage === 'calendar' && <AvailabilitySelector />}
            </div>
        </>
    );
};
  
ReactDOM.render(<App />, document.getElementById('root'));