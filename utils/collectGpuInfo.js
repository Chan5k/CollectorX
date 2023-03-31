const si = require('systeminformation');

async function collectGpuInfo() {
  try {
    const gpus = await si.graphics();
    const gpuInfo = gpus.controllers.map(gpu => ({
      model: gpu.model,
      vendor: gpu.vendor,
      vram: `${(gpu.vram / 1024).toFixed(2)} GB`,
    }));

    return { gpuInfo };
  } catch (error) {
    console.error('Error collecting GPU info:', error);
    return { gpuInfo: [] };
  }
}

module.exports = { collectGpuInfo };
