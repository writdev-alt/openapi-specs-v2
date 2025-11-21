# Overview

Welcome to the WRPay API documentation. WRPay is a secure payment gateway and merchant platform that enables businesses to process payments, manage wallets, and automate withdrawals through the IlonaPay infrastructure.

## What is WRPay?

WRPay provides a comprehensive API for merchants to:

- **Process Payments** - Initiate QRIS (Quick Response Code Indonesian Standard) payments
- **Manage Transactions** - Check transaction status and manage callbacks
- **Handle Wallets** - Manage merchant wallets and monitor balances
- **Configure Withdraw Accounts** - Set up and manage withdrawal account configurations
- **Process Withdrawals** - Create and manage withdrawal requests

## API Version

This documentation covers **API v2**. All endpoints are prefixed with `/api/v2/`.

## Base URLs

The API is available in two environments:

- **Sandbox**: `https://sandbox.ilonapay.com` - For testing and development
- **Production**: `https://production.ilonapay.com` - For live transactions

## Getting Started

To get started with the WRPay API:

1. **Obtain API Credentials** - Generate your API keys from the merchant dashboard under **API Access**
2. **Review Authentication** - Understand how to authenticate your requests using API keys
3. **Explore Endpoints** - Browse the available endpoints organized by category
4. **Test in Sandbox** - Use the sandbox environment to test your integration
5. **Go Live** - Switch to production when ready

## API Structure

The API is organized into the following sections:

### Payments
Endpoints for initiating and processing payment transactions, including QRIS payment requests.

### Transactions
Endpoints for checking transaction status and managing callback notifications.

### Wallets
Endpoints for managing merchant wallets, viewing balances, and accessing wallet details.

### Withdraw Accounts
Endpoints for managing withdrawal account configurations, including listing methods, fetching catalogs, and CRUD operations.

### Withdrawals
Endpoints for creating and managing withdrawal requests from merchant wallets.

## Response Format

All API responses are returned in JSON format. The API uses standard HTTP status codes to indicate success or failure:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limits

API rate limits may apply. Please refer to your merchant dashboard for specific rate limit information.

## Support

For support and questions:
- Check the API documentation for detailed endpoint information
- Review common responses and error codes
- Contact support through your merchant dashboard

## Next Steps

- Read the [Authentication](./authentication.md) guide to learn how to authenticate your requests
- Explore the API endpoints in the sidebar
- Review the [Transaction Statuses](./reference/transaction-statuses.md) documentation

