// signupForm.js
const FormComponent = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [userLocation, setUserLocation] = React.useState(null);
  const [locksmith, setLocksmith] = React.useState(null);

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

  const fetchLocksmith = async () => {
    try {
      const response = await fetch(`https://locksmithlookup-magnus1000team.vercel.app/api/fetchNearestLocksmith.js?lat=${userLocation.latitude}&lng=${userLocation.longitude}`);
      const data = await response.json();
      setLocksmith(data);
      console.log('Nearest locksmith:', data);
    } catch (error) {
      console.error('Error fetching nearest locksmith:', error);
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

  return (
    <div className="locksmith-form-wrapper">
      <div className="locksmith-form-div">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a location"
        />
        <div className="single-button-wrapper">
          <button className="button-primary-blue 100" type="button" onClick={handleLocationClick}>
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
      {userLocation && (
        <div>
          User Location: {userLocation.latitude}, {userLocation.longitude}
        </div>
      )}
      <div className="dual-button-wrapper">
        <button type="button" className="button-secondary 50" onClick={fetchLocksmith}>House</button>
        <button type="button" className="button-secondary 50" onClick={fetchLocksmith}>Car</button>
      </div>
      {locksmith && (
        <div className="suggested-locksmith-wrapper">
            <div className="locksmith-item">
              <div className="locksmith-item-column-left">
                <p className="locksmith-title"> {locksmith.locksmith_name} </p>
                <p className="locksmith-distance"> {locksmith.distance} </p>
              </div>
              <a href={`tel:${locksmith.locksmith_phone}`}>
                <div className="locksmith-item-column-right">
                  <p className="locksmith-cta"> Call Now </p>
                </div>
              </a>
            </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(React.createElement(FormComponent), document.getElementById('root'));
