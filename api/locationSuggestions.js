// Import Axios and CORS packages
const axios = require('axios');
const cors = require('cors');

// Initialize CORS middleware
const corsHandler = cors({ origin: true });

// Validate and use the MAPBOX_TOKEN environment variable 
const mapboxToken = process.env.MAPBOX_TOKEN;
if (!mapboxToken) {
  console.error("MAPBOX_TOKEN is not set");
  return;
}

module.exports = async (req, res) => {
  // Wrap your function logic in the CORS middleware
  corsHandler(req, res, async () => {
    try {
      const query = req.query.q || '';

      // Exit if the query is empty
      if (query === '') {
        console.log("Query is empty");
        return res.json({ suggestions: [] });
      }

      // Use Axios to fetch data from Mapbox API
      const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`, {
        params: {
          access_token: mapboxToken,
          types: 'place,region'
        }
      });

      // Extract features from response data
      const features = response.data.features || [];

      // Prepare suggestion items based on features
      const suggestions = features.map((feature) => {
        return {
          place_name: feature.place_name,
          coordinates: feature.geometry.coordinates,
          region: feature.context.find(c => c.id.startsWith('region'))?.text || '',
          country: feature.context.find(c => c.id.startsWith('country'))?.text || ''
        };
      });

      // Return the suggestions as JSON
      return res.json({ suggestions });
    } catch (error) {
      // Log error and return empty suggestions if something goes wrong
      console.error(error);
      return res.json({ suggestions: [] });
    }
  });
};