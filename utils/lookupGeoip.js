const axios = require('axios');

async function lookupGeoip(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const data = response.data;
    return {
      city: data.city || null,
      region: data.regionName || null,
      country: data.country || null,
      latitude: data.lat || 0,
      longitude: data.lon || 0,
    };
  } catch (error) {
    console.error('Error looking up GeoIP:', error);
    return {
      city: null,
      region: null,
      country: null,
      latitude: 0,
      longitude: 0,
    };
  }
}

module.exports = { lookupGeoip };
