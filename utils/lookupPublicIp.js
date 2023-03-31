const axios = require('axios');

async function lookupPublicIp() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    const data = response.data;
    return data.ip;
  } catch (error) {
    console.error('Error looking up public IP:', error);
    return '';
  }
}

module.exports = { lookupPublicIp };
