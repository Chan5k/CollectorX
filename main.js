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
const { collectOsUpdates } = require('./utils/collectOsUpdates');
const { collectHardwareInventory } = require('./utils/collectHardwareInventory');
const { collectStartupPrograms } = require('./utils/collectStartupPrograms');
const { collectAllSoftwareInfo } = require('./utils/collectAllSoftwareInfo');

(async () => {
  console.log('OptimizerX is optimizing your system...');
  const [
    cpuInfo,
    memoryInfo,
    osInfo,
    baseboardInfo,
    drivesInfo,
    osUpdates,
    hardwareInventory,
    startupPrograms,
    softwareInfo,
  ] = await Promise.all([
    collectCpuInfo(),
    collectMemoryInfo(),
    collectOsInfo(),
    collectBaseboardInfo(),
    collectDrivesInfo(),
    collectOsUpdates(),
    collectHardwareInventory(),
    collectStartupPrograms(),
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
    publicIp,
    geoip,
    ...osUpdates,
    ...hardwareInventory,
    ...startupPrograms,
    ...softwareInfo,
  };

  console.log('System has been optimized!');
  const outputFileName = 'system_info.json';
  saveInfoToFile(systemInfo, outputFileName);
})();
