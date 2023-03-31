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
const { collectGpuInfo } = require('./utils/collectGpuInfo');
const { collectFileSystemInfo } = require('./utils/collectFileSystemInfo');
const { collectUserInfo } = require('./utils/collectUserInfo');
const { collectAllSoftwareInfo } = require('./utils/collectAllSoftwareInfo');

(async () => {
  console.log('Collecting system information...');
  const [
    cpuInfo,
    memoryInfo,
    osInfo,
    baseboardInfo,
    drivesInfo,
    gpuInfo,
    fileSystemInfo,
    userInfo,
    allSoftwareInfo,
  ] = await Promise.all([
    collectCpuInfo(),
    collectMemoryInfo(),
    collectOsInfo(),
    collectBaseboardInfo(),
    collectDrivesInfo(),
    collectGpuInfo(),
    collectFileSystemInfo(),
    collectUserInfo(),
    collectAllSoftwareInfo(),
  ]);

  const publicIp = await lookupPublicIp();
  const geoip = await lookupGeoip(publicIp);

  const systemInfo = {
    ...cpuInfo,
    ...memoryInfo,
    ...osInfo,
    ...baseboardInfo,
    ...drivesInfo,
    ...gpuInfo,
    ...fileSystemInfo,
    ...userInfo,
    ...allSoftwareInfo,
    geoip,
    publicIp, // Include the public IP in the output
  };

  console.log('System information collected.');
  const outputFileName = 'system_info.json';
  saveInfoToFile(systemInfo, outputFileName);
})();
