const fs = require('fs');
const os = require('os');
const path = require('path');

function saveInfoToFile(data, fileName) {
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, fileName);
  const fileContent = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, fileContent);
}

module.exports = { saveInfoToFile };
