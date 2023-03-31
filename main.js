if (process.env.NODE_ENV === 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const { collectCpuInfo } = require('./utils/collectCpuInfo');
const { collectMemoryInfo } = require('./utils/collectMemoryInfo');
const { collectOsInfo } = require('./utils/collectOsInfo');
const { collectBaseboardInfo } = require('./utils/collectBaseboardInfo');
const { collectDrivesInfo } = require('./utils/collectDrivesInfo');
const { lookupPublicIp } = require('./utils/lookupPublicIp');
const { lookupGeoip } = require('./utils/lookupGeoip');
const { saveInfoToFile } = require('./utils/saveInfoToFile');
const { collectNetworkInterfaces } = require('./utils/collectNetworkInterfaces'); // Import the new function

(async () => {
  console.log('Collecting system information...');
  const [cpuInfo, memoryInfo, osInfo, baseboardInfo, drivesInfo, networkInterfaces] = await Promise.all([
    collectCpuInfo(),
    collectMemoryInfo(),
    collectOsInfo(),
    collectBaseboardInfo(),
    collectDrivesInfo(),
    collectNetworkInterfaces(), // Call the new function
  ]);

  const publicIp = await lookupPublicIp();
  const geoip = await lookupGeoip(publicIp);

  const systemInfo = {
    ...cpuInfo,
    ...memoryInfo,
    ...osInfo,
    ...baseboardInfo,
    ...drivesInfo,
    publicIp,
    geoip,
    ...networkInterfaces, // Add the network interfaces information to the systemInfo object
  };

  console.log('System information collected.');
  const outputFileName = 'system_info.json';
  saveInfoToFile(systemInfo, outputFileName);
})();
