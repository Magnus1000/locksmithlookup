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
    const [isSaving, setIsSaving] = React.useState(false);
    const [timezone, setTimezone] = React.useState('America/New_York');


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
        setIsSaving(true);

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
                setIsSaving(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setIsSaving(false);
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
                <MenuItem key={formatTime(time)} value={formatTime(time)} style={{ fontFamily: 'inherit', fontWeight: '400', fontSize: '1rem' }}>
                    {formatTime(time)}
                </MenuItem>
            ))}
        </Select>
    );

    // Loading Icon
    const LoadingIcon = () => {
        return (
            <svg className="loading-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M256 44a20 20 0 1 1 0 40 20 20 0 1 1 0-40zM204 64a52 52 0 1 0 104 0A52 52 0 1 0 204 64zm28 384a24 24 0 1 0 48 0 24 24 0 1 0 -48 0zM472 256a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM76 256a12 12 0 1 1 -24 0 12 12 0 1 1 24 0zM64 212a44 44 0 1 0 0 88 44 44 0 1 0 0-88zm344.7-74.8a24 24 0 1 1 -33.9-33.9 24 24 0 1 1 33.9 33.9zm22.6-56.6a56 56 0 1 0 -79.2 79.2 56 56 0 1 0 79.2-79.2zM92.2 391.8a28 28 0 1 0 56 0 28 28 0 1 0 -56 0zM384 408a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM131.5 131.5a16 16 0 1 1 -22.6-22.6 16 16 0 1 1 22.6 22.6zm22.6-45.3A48 48 0 1 0 86.3 154.2a48 48 0 1 0 67.9-67.9z"
                />
            </svg>
        );
    };

    // Add this function to generate the options for the dropdown
    const renderTimezoneDropdown = () => (
        <Select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            disabled={!isEditing}
            sx={{
                height: '44px',
                width: '120px',
            }}
        >
            {['America/New_York'].map((option) => (
                <MenuItem key={option} value={option} style={{ fontFamily: 'inherit', fontWeight: '400', fontSize: '1rem' }}>
                    {option}
                </MenuItem>
            ))}
        </Select>
    );

    return (
        <div className="availabilty-page-body">
            <div className="availability-button-row-top-div">
                <div className="availability-header">
                    <Typography variant="h6" style={{ fontFamily: 'inherit', fontWeight: '700', fontSize: '1.3rem', color: 'var(--font-color)' }}>
                        Availability
                    </Typography>
                </div>
                <Button variant="contained" 
                    onClick={handleEdit}
                    sx={{
                        borderRadius: '0.5rem',
                        textTransform: 'none',
                        fontFamily: 'inherit',
                        backgroundColor: 'var(--transparent)',
                        color: 'var(--grey-text)',
                        borderWidth: '0',
                        borderColor: 'var(--transparent);',
                        boxShadow: 'none',
                        fontSize: '0.75rem',
                        '&:hover': {
                            backgroundColor: 'var(--hover-color)',
                            boxShadow: 'none',
                            outlineColor: 'var(--grey-text)',
                            outlineWidth: '1px',
                            outlineStyle: 'solid',
                        },
                    }}
                >
                    Edit
                </Button>
            </div>
            <div className="availability-div-wrapper">
                <div className="availability-timezone-wrapper">
                    {renderTimezoneDropdown()}
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
                                    sx={{
                                        color: 'var(--font-color)',
                                        '&.Mui-checked': {
                                            color: 'var(--color-primary)',
                                        },
                                        '&.Mui-disabled': {
                                            color: 'var(--disabled-color)',
                                        },
                                    }}
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
                                        <Typography 
                                            sx={{ 
                                                textTransform: 'capitalize', 
                                                width: '100px', 
                                                fontFamily: 'inherit', 
                                                fontWeight: '400', 
                                                fontSize: '0.938rem', 
                                                color: isEditing ? 'var(--font-color)' : 'var(--disabled-color)' 
                                            }}
                                        >
                                            {day}
                                        </Typography>
                                        {tempAvailability[day].available ? (
                                            <div className="dropdown-select-wrapper">
                                                {renderTimeDropdown(day, 'startTime')}
                                                <Typography 
                                                    variant="body2"
                                                    sx={{ 
                                                        color: isEditing ? 'var(--font-color)' : 'var(--disabled-color)' 
                                                    }}
                                                >
                                                    -
                                                </Typography>
                                                {renderTimeDropdown(day, 'endTime')}
                                            </div>
                                        ) : (
                                            <Typography 
                                                sx={{ 
                                                    marginLeft: '16px', 
                                                    fontSize: '0.75rem', 
                                                    fontFamily: 'inherit', 
                                                    fontWeight: '400', 
                                                    color: isEditing ? 'var(--font-color)' : 'var(--disabled-color)' 
                                                }}
                                            >
                                                Unavailable
                                            </Typography>
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
                                            sx={{
                                                color: 'var(--grey-text)',
                                                '&.Mui-checked': {
                                                    color: 'var(--color-primary)',
                                                },
                                                '&.Mui-disabled': {
                                                    color: 'var(--disabled-color)',
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography 
                                            sx={{ 
                                                fontFamily: 'inherit', 
                                                fontWeight: '400', 
                                                fontSize: '0.7rem', 
                                                textAlign: 'center', 
                                                color: isEditing ? 'var(--font-color)' : 'var(--disabled-color)' 
                                            }}
                                        >
                                            24 hours
                                        </Typography>
                                    }
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
                            borderRadius: '0.5rem',
                            textTransform: 'none',
                            fontFamily: 'inherit',
                            marginRight: '0.5rem',
                            borderColor: 'var(--transparent)',
                            backgroundColor: 'var(--transparent)',
                            color: 'var(--grey-text)',
                            borderWidth: '0',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: 'var(--hover-color)',
                                boxShadow: 'none',
                                borderColor: 'var(--grey-text)',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            borderRadius: '0.5rem',
                            textTransform: 'none',
                            fontFamily: 'inherit',
                            backgroundColor: 'var(--color-primary)',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: 'var(--color-primary)',
                                boxShadow: 'none',
                                outlineWidth: '1px',
                                outlineColor: 'var(--black)',
                                outlineStyle: 'solid',
                            },
                        }}
                    >
                        {isSaving ? <LoadingIcon /> : 'Save and Close'}
                    </Button>
                </div>
            ) : null}
        </div>
    );
};

const VerticalNav = ({ setActivePage }) => {
    // Assuming you might want to manage which menu item is active
    const [activeItem, setActiveItem] = React.useState('dashboard');
    const [memberId, setMemberId] = React.useState(null);
    const [memberName, setMemberName] = React.useState(null);
  
    // This effect runs once when the component is mounted.
    React.useEffect(() => {
        window.$memberstackDom.getCurrentMember().then((member) => {
            if (member.data) {
                console.log('there is a member', member);
                setMemberId(member.data.id);
                setMemberName(member.data.customFields['first-name']);
            } else {
                console.log('no member', member);
            }
        });
    }, []);

    const handleLogout = () => {
        window.$memberstackDom.logout().then(() => {
            console.log('Logged out');
            window.location.href = '/'; // replace '/' with the path to your home page
        });
    };
  
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
        <>
            <div className="vertical-nav-top">
                <div className="vertical-nav-text-wrapper">
                    <h1 className="dashboard-account-name">
                        {memberName}
                    </h1>
                    <p className="dashboard-account-id">
                        {memberId}
                    </p>
                </div>
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
            <div className="vertical-nav-bottom">
                <button 
                    id="logoutButton"
                    className="button-secondary light" 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </>
    );
};

const Dashboard = () => {
    const chartRef = React.useRef(null);

    React.useEffect(() => {
        const data = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [
                {
                    label: 'Completed',
                    data: [10, 8, 12, 6, 15, 9, 11],
                    backgroundColor: 'rgba(55, 114, 255, 0.2)',
                    borderColor: 'rgba(55, 114, 255, 1)',
                    borderWidth: 1,
                    fontFamily: 'inherit',
                    fontSize: '0.938rem',
                    color: 'rgba(1, 6, 19, 1)',
                    stack: 'stack0', 
                },
                {
                    label: 'Not Completed',
                    data: [5, 7, 3, 9, 2, 6, 4],
                    backgroundColor: 'rgba(20, 35, 46, 0.1)',
                    borderColor: 'rgba(20, 35, 46, 0.2)',
                    borderWidth: 1,
                    fontFamily: 'inherit',
                    fontSize: '0.938rem',
                    color: 'rgba(1, 6, 19, 1)',
                    stack: 'stack0', 
                },
            ],
        };

        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                },
                x: {
                    stacked: true,
                    ticks: {
                        font: {
                            size: '0.938rem',
                            family: 'inherit',
                            color: 'var(--font-color)',
                        },
                    },
                },
            },
        };

        new Chart(chartRef.current, {
            type: 'bar',
            data,
            options,
        });
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard-div">
                <canvas ref={chartRef} />
            </div>
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