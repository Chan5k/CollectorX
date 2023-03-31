const si = require('systeminformation');

async function collectOsInfo() {
  const osData = await si.osInfo();
  return {
    platform: osData.platform,
    osType: osData.distro,
    osRelease: osData.release,
  };
}

module.exports = { collectOsInfo };
