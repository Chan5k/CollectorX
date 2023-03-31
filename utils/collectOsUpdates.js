const { exec } = require('child_process');
const os = require('os');

async function collectOsUpdates() {
  try {
    const platform = os.platform();

    const command =
      platform === 'win32'
        ? 'wmic qfe list brief /format:csv'
        : 'cat /var/log/dpkg.log | grep -i installed';

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error collecting OS updates:', error);
          reject(error);
        } else {
          const updates = parseUpdates(stdout, platform);
          resolve({ updates });
        }
      });
    });
  } catch (error) {
    console.error('Error collecting OS updates:', error);
    return {};
  }
}

function parseUpdates(output, platform) {
  const lines = output.trim().split('\n');
  const updates = [];

  if (platform === 'win32') {
    lines.shift(); // Remove the header line
    lines.forEach((line) => {
      const [description, hotFixId, installedOn] = line.split(',').slice(1);
      if (description && hotFixId && installedOn) {
        updates.push({
          description: description.trim(),
          hotFixId: hotFixId.trim(),
          installedOn: installedOn.trim(),
        });
      }
    });
  } else {
    lines.forEach((line) => {
      const [, date, time, , packageName] = line.split(' ');
      if (packageName) {
        updates.push({
          date: `${date} ${time}`,
          packageName: packageName.trim(),
        });
      }
    });
  }

  return updates;
}

module.exports = { collectOsUpdates };
