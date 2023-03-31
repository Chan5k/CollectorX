const si = require('systeminformation');

async function collectCpuInfo() {
  const cpu = await si.cpu();
  return {
    cpuManufacturer: cpu.manufacturer,
    cpuBrand: cpu.brand,
    cpuSpeed: `${cpu.speed} GHz`,
    cpuCores: cpu.cores,
  };
}

module.exports = { collectCpuInfo };
