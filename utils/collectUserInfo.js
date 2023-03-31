const os = require('os');

async function collectUserInfo() {
  try {
    const userInfo = os.userInfo();
    const user = {
      username: userInfo.username,
      uid: userInfo.uid,
      gid: userInfo.gid,
      homeDir: userInfo.homedir,
      shell: userInfo.shell,
    };

    return { user };
  } catch (error) {
    console.error('Error collecting user info:', error);
    return { user: {} };
  }
}

module.exports = { collectUserInfo };
