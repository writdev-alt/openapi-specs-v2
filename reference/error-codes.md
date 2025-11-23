# Error Codes

This document provides a comprehensive reference for all error codes and messages you may encounter when using the WRPay API.

## HTTP Status Codes

The API uses standard HTTP status codes to indicate the result of a request:

| Status Code | HTTP Code | Meaning | Description |
|------------|-----------|---------|-------------|
| 200 | 20001001, 20002001, 20003001, etc. | OK | Request succeeded |
| 201 | 20104001, 20105001, etc. | Created | Resource created successfully |
| 400 | 40001001, 40002001, etc. | Bad Request | Invalid request format |
| 401 | 40101001 | Unauthorized | Authentication required or failed |
| 403 | 40301001 | Forbidden | Access denied, insufficient permissions |
| 404 | 40401001, 40402001, etc. | Not Found | Resource not found |
| 422 | 42201001, 42202001, etc. | Validation Error | Request data validation failed |
| 500 | 50001001, 50002001, etc. | Internal Server Error | Server error occurred |

**Note:** The HTTP Code follows the format: `{HTTP_STATUS}{SERVICE_CODE}{CASE_CODE}` where:
- **HTTP Status** (3 digits): The HTTP status code (200, 201, 400, etc.)
- **Service Code** (2 digits): Identifies the service/module (01 = Payments, 02 = Transactions, 03 = Wallets, 04 = Withdraw Accounts, 05 = Withdrawals)
- **Case Code** (3 digits): Identifies the specific case or error type (001, 002, 003, etc.)

For example, `20001001` means HTTP 200 (Success) + Service 01 (Payments) + Case 001 (Payment created).

## Error Response Format

All error responses follow a consistent format:

```json
{
  "code": "42201001",
  "message": "Error message describing what went wrong",
  "errors": {
    "field_name": [
      "Field-specific error message"
    ]
  }
}
```

## Common Error Messages

### Authentication Errors (401)

```json
{
  "code": "40101001",
  "message": "Unauthorized"
}
```

**Solutions:**
- Verify your API keys are correct
- Ensure both `X-API-KEY` and `X-MERCHANT-KEY` headers are included
- Check that your API keys are active in the merchant dashboard
- Regenerate API keys if necessary

### Forbidden Errors (403)

```json
{
  "code": "40301001",
  "message": "Access denied. You do not have permission to perform this action."
}
```

**Common scenarios:**
- Insufficient permissions for the requested resource
- Account restrictions prevent the action
- Feature not available for your account tier
- Resource access restricted by merchant settings

**Solutions:**
- Verify your account has the required permissions
- Check your account tier and feature access
- Contact support to upgrade your account if needed
- Review merchant dashboard settings for access restrictions

### Not Found Errors (404)

```json
{
  "code": "40402001",
  "message": "Transaction not found."
}
```

**Common scenarios:**
- Transaction ID doesn't exist
- Transaction belongs to another merchant
- Transaction has been deleted

**Solutions:**
- Verify the transaction ID is correct
- Check that you're querying transactions from your own account
- Ensure you're using the correct environment (sandbox vs production)

### Validation Errors (422)

#### Wallet Errors

```json
{
  "code": "42201001",
  "message": "The given data was invalid.",
  "errors": {
    "wallet_id": [
      "Wallet not found or does not belong to you."
    ]
  }
}
```

#### Amount Errors

```json
{
  "code": "42201001",
  "message": "The given data was invalid.",
  "errors": {
    "amount": [
      "Insufficient wallet balance for this withdrawal.",
      "Amount must be between 50000 and 50000000."
    ]
  }
}
```

#### Account Errors

```json
{
  "code": "42201001",
  "message": "The given data was invalid.",
  "errors": {
    "account_id": [
      "Withdraw account not found"
    ],
    "bank_code": [
      "Invalid Account Number"
    ]
  }
}
```

**Solutions:**
- Review the error messages for specific field issues
- Check field requirements in the API documentation
- Verify data formats match the expected types
- Ensure business rules are met (e.g., sufficient balance)

### Server Errors (500)

```json
{
  "code": "50001001",
  "message": "Payment processing failed. Please try again.",
  "error": "Gateway timeout"
}
```

**Common scenarios:**
- Temporary server issues
- Payment gateway timeouts
- External service unavailability
- Database connection issues

**Solutions:**
- Retry the request after a short delay
- Implement exponential backoff retry logic
- Check API status page for known issues
- Contact support if the issue persists

## Field-Specific Error Codes

### Wallet Field Errors

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Wallet not found or does not belong to you." | Invalid wallet UUID | Verify wallet UUID from list wallets endpoint |
| "Insufficient wallet balance" | Balance too low | Check wallet balance before withdrawal |

### Amount Field Errors

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Amount must be between 50000 and 50000000." | Amount outside valid range | Ensure amount is within limits |
| "Insufficient wallet balance" | Not enough funds | Check available balance |

### Account Field Errors

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Withdraw account not found" | Invalid account ID | Verify account ID exists |
| "Invalid Account Number" | Invalid bank account format | Check account number format |

### Transaction Field Errors

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Invalid transaction." | Invalid transaction ID | Verify transaction ID format |
| "Transaction not found." | Transaction doesn't exist | Check transaction ID |

## Error Handling Best Practices

### 1. Implement Retry Logic

```javascript
async function makeRequestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return await response.json();
      
      // Don't retry client errors (4xx)
      if (response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }
      
      // Retry server errors (5xx)
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

### 2. User-Friendly Error Messages

```javascript
function getErrorMessage(error) {
  if (error.status === 401) {
    return "Authentication failed. Please check your API keys.";
  }
  if (error.status === 403) {
    return "Access denied. You do not have permission to perform this action.";
  }
  if (error.status === 404) {
    return "The requested resource was not found.";
  }
  if (error.status === 422) {
    return "Please check your input and try again.";
  }
  if (error.status === 500) {
    return "Server error. Please try again later.";
  }
  return "An unexpected error occurred.";
}
```

### 3. Log Errors for Debugging

```javascript
function handleError(error, context) {
  console.error('API Error:', {
    status: error.status,
    message: error.message,
    errors: error.errors,
    context: context,
    timestamp: new Date().toISOString()
  });
  
  // Send to error tracking service
  // errorTrackingService.log(error, context);
}
```

## Rate Limiting

If you exceed rate limits, you may receive:

```json
{
  "code": "42901001",
  "message": "Too many requests. Please try again later.",
  "retry_after": 60
}
```

**Solutions:**
- Implement request throttling
- Respect the `retry_after` value
- Reduce request frequency
- Contact support to increase rate limits

## Related Documentation

- [Common Responses](./common-responses.md)
- [Transaction Statuses](./transaction-statuses.md)
- [Authentication](../authentication.md)

