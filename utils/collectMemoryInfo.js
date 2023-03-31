const si = require('systeminformation');

async function collectMemoryInfo() {
  const mem = await si.mem();
  return {
    totalMemory: `${(mem.total / 1024 / 1024 / 1024).toFixed(2)} GB`,
  };
}

module.exports = { collectMemoryInfo };
