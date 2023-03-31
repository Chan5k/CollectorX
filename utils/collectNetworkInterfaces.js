const si = require('systeminformation');

async function collectNetworkInterfaces() {
  try {
    const interfaces = await si.networkInterfaces();
    const filteredInterfaces = interfaces.map((iface) => ({
      iface: iface.iface,
      ifaceName: iface.ifaceName,
      ip4: iface.ip4,
      ip6: iface.ip6,
      mac: iface.mac,
      internal: iface.internal,
    }));

    return { networkInterfaces: filteredInterfaces };
  } catch (error) {
    console.error('Error collecting network interfaces:', error);
    return { networkInterfaces: [] };
  }
}

module.exports = { collectNetworkInterfaces };
