// signupForm.js
const FormComponent = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [userLocation, setUserLocation] = React.useState({ latitude: 43.70, longitude: -79.42 });
  const [placename, setPlacename] = React.useState(''); 
  const [locksmiths, setLocksmiths] = React.useState(null);
  const [selectedLocksmith, setSelectedLocksmith] = React.useState(null);
  const [isFetching, setIsFetching] = React.useState(false);
  const [showDualButtons, setShowDualButtons] = React.useState(false);
  const [selectedButton, setSelectedButton] = React.useState(null); 
  const [fetchingLocksmiths, setFetchingLocksmiths] = React.useState(false);
  const [noResults, setNoResults] = React.useState(false);
  const mapRef = React.useRef(null);

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

  // Define map outside of useEffect so it can be accessed in other hooks
  let map;

  React.useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbHR4M2hmMGUwMjB6MnZwYndpcXUyNmRqIn0.sXN7mCC32kCvlwObxGMsnQ';

    map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/magnus1993/cll28qk0n006a01pu7y9h0ouv',
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 10
    });

    // Disable scroll zoom
    map.scrollZoom.disable();

    // Disable map rotation when right clicked + dragging
    map.dragRotate.disable();

    // Disable map pitch when right clicked + dragging
    map.touchZoomRotate.disableRotation();

    // Disable drag pan
    map.dragPan.disable();

    return () => map.remove();
  }, []);

  // Update map center when userLocation changes
  React.useEffect(() => {
    if (map) {
      map.setCenter([userLocation.longitude, userLocation.latitude]);
    }
  }, [userLocation]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.place_name);
    setSuggestions([]);
  };

  // Function to handle selecting a locksmith
  const handleLocksmithSelect = (locksmith) => {
    setSelectedLocksmith(locksmith); // Update the selected locksmith state
  };  

  const handleLocationClick = () => {
    setLocksmiths(null); // Clear the locksmiths state
    setIsFetching(true);
    setPlacename('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
  
          // Fetch location name
          const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbHR4M2hmMGUwMjB6MnZwYndpcXUyNmRqIn0.sXN7mCC32kCvlwObxGMsnQ&place_type=neighborhood,locality,place,region`);
          const data = await response.json();
          const feature = data.features.find(feature => feature.place_type.includes('neighborhood') || feature.place_type.includes('locality') || feature.place_type.includes('place'));
          const placeName = feature ? feature.place_name.replace(/,\s*[^,]+$/, '') : ''; 
  
          console.log('Location update:', placeName); // Log the place name
  
          setIsFetching(false);
          setShowDualButtons(true);
          setPlacename(placeName); // Set the place name state
        },
        (error) => {
          console.error('Error getting user location:', error);
          setIsFetching(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsFetching(false);
    }
  };

  const fetchLocksmiths = async (serviceType) => {
    setFetchingLocksmiths(true);
    setLocksmiths(null); // Clear the locksmiths state
    try {
      // Get the user's current timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Include the timezone and serviceType in the API request
      const response = await fetch(`https://locksmithlookup-magnus1000team.vercel.app/api/fetchNearestLocksmiths.js?lat=${userLocation.latitude}&lng=${userLocation.longitude}&tz=${encodeURIComponent(timezone)}&service=${encodeURIComponent(serviceType)}`);
      const data = await response.json();

      // Add a 2-second timeout before setting the state
      setTimeout(() => {
        setFetchingLocksmiths(false);

        // Check if data is the string "No locksmiths available at this time."
        if (data.error === "No locksmiths available at this time.") {
          setNoResults(true); // Set noResults to true
        } else {
          // Set the locksmiths state
          setLocksmiths(data); 
          console.log('Nearest locksmiths:', data); 

          // Check if data is an array and has at least one element
          if (Array.isArray(data) && data.length > 0) {
            setSelectedLocksmith(data[0]); // Set the first locksmith as selected
          }
        }
      }, 2000); // 2000 milliseconds = 2 seconds

    } catch (error) {
      console.error('Error fetching nearest locksmiths:', error); // Change this line
      setFetchingLocksmiths(false);
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

  // Loading Icon
  const LoadingIcon = () => {
    return (
        <svg className="loading-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor" d="M256 44a20 20 0 1 1 0 40 20 20 0 1 1 0-40zM204 64a52 52 0 1 0 104 0A52 52 0 1 0 204 64zm28 384a24 24 0 1 0 48 0 24 24 0 1 0 -48 0zM472 256a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM76 256a12 12 0 1 1 -24 0 12 12 0 1 1 24 0zM64 212a44 44 0 1 0 0 88 44 44 0 1 0 0-88zm344.7-74.8a24 24 0 1 1 -33.9-33.9 24 24 0 1 1 33.9 33.9zm22.6-56.6a56 56 0 1 0 -79.2 79.2 56 56 0 1 0 79.2-79.2zM92.2 391.8a28 28 0 1 0 56 0 28 28 0 1 0 -56 0zM384 408a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM131.5 131.5a16 16 0 1 1 -22.6-22.6 16 16 0 1 1 22.6 22.6zm22.6-45.3A48 48 0 1 0 86.3 154.2a48 48 0 1 0 67.9-67.9z"
            />
        </svg>
    );
  };


  // Helper function to format distance
  const formatDistance = (distanceUnrounded) => {
    return `${distanceUnrounded.toFixed(1)}km away`;
  };

  return (
    <>
      <div className="locksmith-map-wrapper" ref={mapRef}>
      </div>
      <div className="locksmith-form-wrapper">
        <div className="locksmith-form-div">
          <div className="locksmith-form-header">
            <p className="locksmith-form-header-text">Find the <span className="emphasis-text">nearest available</span> locksmith</p>
          </div>
          <div className="single-button-wrapper">
          <button 
            className={`button-primary-blue-100 ${placename ? '' : 'pulse'}`}
            type="button" 
            onClick={handleLocationClick}
          >
            {isFetching ? <LoadingIcon /> : (placename ? <LocationIcon2 /> : <LocationIcon />)}
            {isFetching ? 'Fetching your location' : (placename ? placename : 'Get Location')}
          </button>
          </div>
          {showDualButtons && userLocation && (
            <div className="dual-button-wrapper">
              <button 
                type="button" 
                className={`button-secondary-50 ${selectedButton === 'house' ? 'selected' : ''}`} 
                onClick={() => {fetchLocksmiths('house'); setSelectedButton('house');}}
              >
                <HouseIcon />House
              </button>
              <button 
                type="button" 
                className={`button-secondary-50 ${selectedButton === 'car' ? 'selected' : ''}`} 
                onClick={() => {fetchLocksmiths('car'); setSelectedButton('car');}}
              >
                <CarIcon />Car
              </button>
            </div>
          )}
          {fetchingLocksmiths && (
            <div className="loading-locksmiths">
              <LoadingIcon />
              Searching nearest available locksmiths
            </div>
          )}
          {noResults && (
            <div className="no-results">
              <p>No locksmiths available at this time. Try Google.</p>
            </div>
          )}
          {locksmiths && locksmiths.length > 0 && (
            <div className="suggested-locksmith-wrapper">
              <div className="suggested-locksmith-title">
                {placename && (<p className="suggested-locksmith-title-text">{locksmiths.length} locksmiths found near {placename}</p>)}
              </div>
              {locksmiths.slice(0, 5).map((locksmith, index) => (
                <div
                  key={index}
                  className={`locksmith-item ${selectedLocksmith === locksmith ? 'selected' : ''}`}
                  onClick={() => handleLocksmithSelect(locksmith)} // Handle click to select a locksmith
                >
                  <div className="locksmith-item-column-left">
                    <p className="locksmith-title"> {locksmith.locksmith_name} </p>
                    <div className="distance-available-wrapper">
                      <p className="locksmith-distance"> {formatDistance(locksmith.distance)}</p>
                      <div className="locksmith-dot"></div>
                      <p className="locksmith-available">Online</p>
                    </div>
                    {index === 0 && <p className="locksmith-tag"><LocationIcon2 />Closest</p>}
                  </div>
                  {selectedLocksmith === locksmith && (
                    <a className="phone-link-wrapper" href={`tel:${locksmith.locksmith_phone}`}>
                      <div className="locksmith-item-column-right">
                        <PhoneIcon />
                        <p className="call-now-text">Call Now</p>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

ReactDOM.render(React.createElement(FormComponent), document.getElementById('root'));
