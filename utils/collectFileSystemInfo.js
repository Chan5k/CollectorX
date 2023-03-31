const si = require('systeminformation');

async function collectFileSystemInfo() {
  try {
    const filesystems = await si.fsSize();
    const fileSystemInfo = filesystems.map(fs => ({
      fs: fs.fs,
      type: fs.type,
      size: `${(fs.size / 1024 / 1024 / 1024).toFixed(2)} GB`,
      used: `${(fs.used / 1024 / 1024 / 1024).toFixed(2)} GB`,
      available: `${(fs.available / 1024 / 1024 / 1024).toFixed(2)} GB`,
    }));

    return { fileSystemInfo };
  } catch (error) {
    console.error('Error collecting file system info:', error);
    return { fileSystemInfo: [] };
  }
}

module.exports = { collectFileSystemInfo };
