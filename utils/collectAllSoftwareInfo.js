const { exec } = require('child_process');
const os = require('os');

async function collectAllSoftwareInfo() {
  try {
    const platform = os.platform();

    const command =
      platform === 'win32'
        ? 'wmic product get Name, Version /format:csv'
        : 'dpkg-query -W -f=\'${Installed-Size}\t${Package}\n\'';

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error collecting software info:', error);
          reject(error);
        } else {
          const softwareList = parseSoftwareList(stdout, platform);
          resolve({ softwareList });
        }
      });
    });
  } catch (error) {
    console.error('Error collecting software info:', error);
    return {};
  }
}

function parseSoftwareList(output, platform) {
  const lines = output.trim().split('\n');
  const softwareList = [];

  if (platform === 'win32') {
    lines.shift(); // Remove the header line
    lines.forEach((line) => {
      const [name, version] = line.split(',').slice(1);
      if (name && version) {
        softwareList.push({ name: name.trim(), version: version.trim() });
      }
    });
  } else {
    lines.forEach((line) => {
      const [size, name] = line.split('\t');
      if (name) {
        softwareList.push({ name: name.trim(), size: parseInt(size, 10) });
      }
    });
  }

  return softwareList;
}

module.exports = { collectAllSoftwareInfo };
