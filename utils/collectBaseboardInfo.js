const si = require('systeminformation');

async function collectBaseboardInfo() {
  const baseboard = await si.baseboard();
  return {
    baseboardManufacturer: baseboard.manufacturer,
    baseboardModel: baseboard.model,
    baseboardVersion: baseboard.version,
    baseboardSerial: baseboard.serial,
  };
}

module.exports = { collectBaseboardInfo };
