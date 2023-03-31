const si = require('systeminformation');
const { lookupPublicIp } = require('./lookupPublicIp');
const { lookupGeoip } = require('./lookupGeoip');

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

module.exports = { collectSystemInfo };
