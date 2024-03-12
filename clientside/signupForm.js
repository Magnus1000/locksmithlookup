// signupForm.js
const FormComponent = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [userLocation, setUserLocation] = React.useState(null);

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
    console.log('Submitted value:', inputValue);
  
    if (userLocation && inputValue) {
      const data = {
        location: inputValue,
        userLocation: userLocation,
      };
  
      try {
        const response = await fetch('https://locksmithlookup-magnus1000team.vercel.app/api/twilioCall.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
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
      const response = await fetch(`https://locksmithlookup-magnus1000team.vercel.app/api/fetchNearestLocksmith.js?lat=${latitude}&lng=${longitude}`);
      const data = await response.json();
      setLocksmith(data);
    } catch (error) {
      console.error('Error fetching nearest locksmith:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a location"
        />
        <button type="button" onClick={handleLocationClick}>
          Get Location
        </button>
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
      <div>
        <button type="button" onClick={fetchLocksmith}>House</button>
        <button type="button" onClick={fetchLocksmith}>Car</button>
      </div>
    </form>
  );
};

ReactDOM.render(React.createElement(FormComponent), document.getElementById('root'));
