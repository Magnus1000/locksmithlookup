const FormComponent = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [userLocation, setUserLocation] = React.useState(null);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim() !== '') {
        const response = await fetch(`https://locksmithlookup-magnus1000team.vercel.app/api/locationSuggestions?q=${encodeURIComponent(inputValue)}`);
        const data = await response.json();
        setSuggestions(data.features);
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions(); // Call the function
  }, [inputValue]); // Close the useEffect hook

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted value:', inputValue);
    // Perform any desired actions with the submitted value
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

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <button type="button">Button 1</button>
        <button type="button">Button 2</button>
      </div>
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
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
      {userLocation && (
        <div>
          User Location: {userLocation.latitude}, {userLocation.longitude}
        </div>
      )}
    </form>
  );
};

ReactDOM.render(React.createElement(FormComponent), document.getElementById('root'));