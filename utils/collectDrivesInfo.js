const si = require('systeminformation');

async function collectDrivesInfo() {
  const drives = await si.diskLayout();
  return { drives };
}

module.exports = { collectDrivesInfo };
