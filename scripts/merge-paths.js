const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Define base OpenAPI structure
const mainFile = {
  openapi: '3.0.3',
  info: {
    title: 'WRPay - Secure Payments & Advanced Merchant Gateway API Documentation',
    description: 'Merchant-facing API for initiating payments, managing wallets, and automating withdrawals for IlonaPay.',
    version: '1.0.0',
    license: {
      name: 'Proprietary',
      url: 'https://ilonapay.com/terms'
    },
    'x-logo': {
      url: './assets/logo.png',
      altText: 'IlonaPay Logo',
      backgroundColor: '#FFFFFF'
    },
    'x-dark-logo': {
      url: './assets/logo-light.png',
      altText: 'IlonaPay Logo'
    }
  },
  servers: [
    {
      url: 'https://sandbox.ilonapay.com',
      description: 'Sandbox environment for testing and development'
    },
    {
      url: 'https://production.ilonapay.com',
      description: 'Production environment for live transactions'
    }
  ],
  security: [
    { default: [] }
  ],
  tags: [
    {
      name: 'Payments',
      description: 'Endpoints for initiating and processing payment transactions'
    },
    {
      name: 'Transactions',
      description: 'Endpoints for checking transaction status and managing callbacks'
    },
    {
      name: 'Wallets',
      description: 'Endpoints for managing merchant wallets and balances'
    },
    {
      name: 'Withdraw Accounts',
      description: 'Endpoints for managing withdrawal account configurations'
    },
    {
      name: 'Withdrawals',
      description: 'Endpoints for creating and managing withdrawal requests'
    }
  ]
};

// Read all path files
const pathFiles = [
  'paths/payments.yaml',
  'paths/transactions.yaml',
  'paths/wallets.yaml',
  'paths/payment-support.yaml',
  'paths/withdraw-accounts.yaml',
  'paths/withdrawals.yaml'
];

// Merge all paths
mainFile.paths = {};
for (const filePath of pathFiles) {
  const content = yaml.load(fs.readFileSync(filePath, 'utf8'));
  Object.assign(mainFile.paths, content);
}

// Include components section with external references
// Redocly will resolve these references during bundling
mainFile.components = {
  securitySchemes: {
    $ref: './components/security.yaml#/securitySchemes'
  },
  responses: {
    $ref: './components/responses.yaml#/responses'
  },
  schemas: {
    $ref: './components/schemas.yaml#/schemas'
  }
};

// Write merged file - Redocly will use this as the root file
fs.writeFileSync('openapi.yaml', yaml.dump(mainFile, { 
  lineWidth: -1,
  noRefs: false 
}));

console.log('OpenAPI spec merged successfully!');

