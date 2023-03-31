const si = require('systeminformation');

async function collectHardwareInventory() {
  try {
    const [graphics, usb] = await Promise.all([si.graphics(), si.usb()]);
    return {
      graphics,
      usb,
    };
  } catch (error) {
    console.error('Error collecting hardware inventory:', error);
    return {};
  }
}

module.exports = { collectHardwareInventory };
