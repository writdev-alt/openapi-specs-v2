const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Read the main openapi file
const mainFile = yaml.load(fs.readFileSync('openapi.yaml', 'utf8'));

// Read all path files
const pathFiles = [
  'paths/payments.yaml',
  'paths/transactions.yaml',
  'paths/wallets.yaml',
  'paths/withdraw-accounts.yaml',
  'paths/withdrawals.yaml'
];

// Merge all paths
mainFile.paths = {};
for (const filePath of pathFiles) {
  const content = yaml.load(fs.readFileSync(filePath, 'utf8'));
  Object.assign(mainFile.paths, content);
}

// Write merged file
fs.writeFileSync('openapi.yaml', yaml.dump(mainFile, { 
  lineWidth: -1,
  noRefs: false 
}));

console.log('Paths merged successfully!');

