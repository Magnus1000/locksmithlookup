// signupForm.js
const FormComponent = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [userLocation, setUserLocation] = React.useState(null);
  const [locksmiths, setLocksmiths] = React.useState(null);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim() !== '') {
        const response = await fetch(`https://locksmithlookup-magnus1000team.vercel.app/api/locationSuggestions?q=${encodeURIComponent(inputValue)}`);
        const data = await response.json();
        setSuggestions(data.suggestions); // Assuming the API returns an array of suggestions
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions(); // Call the function
  }, [inputValue]); // Close the useEffect hook

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (userLocation && locksmith) {
      const data = {
        number: locksmith.phone,
        locksmith: locksmith.locksmith,
      };

      console.log('Initiating Twilio call:', data);
  
      try {
        const response = await fetch('https://locksmithlookup-magnus1000team.vercel.app/api/makeCall.js', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('Twilio call initiated:', result);
        } else {
          console.error('Error initiating Twilio call:', response.statusText);
        }
      } catch (error) {
        console.error('Error initiating Twilio call:', error);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.place_name);
    setSuggestions([]);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const fetchLocksmiths = async () => {
    try {
      const response = await fetch(`https://locksmithlookup-magnus1000team.vercel.app/api/fetchNearestLocksmiths.js?lat=${userLocation.latitude}&lng=${userLocation.longitude}`);
      const data = await response.json();
      setLocksmiths(data); // Change this line
      console.log('Nearest locksmiths:', data); // Change this line
    } catch (error) {
      console.error('Error fetching nearest locksmiths:', error); // Change this line
    }
  };

  // Location Icon
  const LocationIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="location-icon">
            <path fill="currentColor" d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"
            />
        </svg>
    );
  };

  // Car Icon
  const CarIcon = () => {
      return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="car-icon">
              <path fill="currentColor" d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
          </svg>
      );
  };

  // House Icon
  const HouseIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="house-icon">
        <path fill="currentColor" d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>
      </svg>
    );
  };

  // Location Icon 2
  const LocationIcon2 = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="location-icon-2">
        <path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
      </svg>
    );
  };

  // Phone Icon
  const PhoneIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="phone-icon">
        <path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
      </svg>
    );
  };



  // Helper function to format distance
  const formatDistance = (distanceInMeters) => {
    const distanceInKilometers = distanceInMeters / 1000;
    return `${distanceInKilometers.toFixed(2)}km away`;
  };

  return (
    <div className="locksmith-form-wrapper">
      <div className="locksmith-form-div">
        {/*
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter a location"
          />
        */}
        <div className="single-button-wrapper">
          <button className="button-primary-blue-100" type="button" onClick={handleLocationClick}>
            <LocationIcon />
            Get Location
          </button>
        </div>
        {suggestions && suggestions.length > 0 && (
          <div>
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion.place_name}
              </div>
            ))}
          </div>
        )}
      </div>
      {userLocation && (<div className="dual-button-wrapper">
        <button type="button" className="button-secondary-50" onClick={fetchLocksmiths}><HouseIcon />House</button>
        <button type="button" className="button-secondary-50" onClick={fetchLocksmiths}><CarIcon />Car</button>
      </div>)}
      {locksmiths && locksmiths.length > 0 && (
        <div className="suggested-locksmith-wrapper">
          <div className="suggested-locksmith-title">
            {userLocation && (<p className="suggested-locksmith-title-text">{locksmiths.length} locksmiths found near {userLocation.latitude}, {userLocation.longitude}</p>)}
          </div>
          {locksmiths.slice(0, 5).map((locksmith, index) => (
            <div key={index} className="locksmith-item">
              <div className="locksmith-item-column-left">
                <p className="locksmith-title"> {locksmith.locksmith_name} </p>
                <p className="locksmith-distance"> {formatDistance(locksmith.distance)} &middot; Open Now </p>
                {index === 0 && <p className="locksmith-tag"><LocationIcon2 />Closest</p>}
              </div>
              <a href={`tel:${locksmith.locksmith_phone}`}>
                <div className="locksmith-item-column-right">
                  <PhoneIcon />
                  <p className="call-now-text">Call Now</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ReactDOM.render(React.createElement(FormComponent), document.getElementById('root'));
