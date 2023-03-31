const { exec } = require('child_process');
const os = require('os');

async function collectStartupPrograms() {
  try {
    const platform = os.platform();

    const command =
      platform === 'win32'
        ? 'wmic startup list brief /format:csv'
        : 'systemctl list-unit-files --type=service';

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error collecting startup programs:', error);
          reject(error);
        } else {
          const startupPrograms = parseStartupPrograms(stdout, platform);
          resolve({ startupPrograms });
        }
      });
    });
  } catch (error) {
    console.error('Error collecting startup programs:', error);
    return {};
  }
}

function parseStartupPrograms(output, platform) {
  const lines = output.trim().split('\n');
  const startupPrograms = [];

  if (platform === 'win32') {
    lines.shift(); // Remove the header line
    lines.forEach((line) => {
      const [caption, command, location] = line.split(',').slice(1);
      if (caption && command && location) {
        startupPrograms.push({
          caption: caption.trim(),
          command: command.trim(),
          location: location.trim(),
        });
      }
    });
  } else {
    lines.forEach((line) => {
      const [unit, state] = line.split(/\s+/);
      if (unit && state) {
        startupPrograms.push({
          unit: unit.trim(),
          state: state.trim(),
        });
      }
    });
  }

  return startupPrograms;
}

module.exports = { collectStartupPrograms };
