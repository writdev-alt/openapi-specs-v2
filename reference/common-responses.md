# Common Responses

The WRPay API uses standardized response formats for consistency across all endpoints. This document describes the common response structures you'll encounter.

## Response Code Format

All API responses include a `code` field that follows this formula:

```
response code = HTTP status code + service code + case code
```

**Format**: `{HTTP_STATUS}{SERVICE_CODE}{CASE_CODE}`

- **HTTP Status Code** (3 digits): The HTTP status code (200, 201, 400, 401, 403, 404, 422, 500, etc.)
- **Service Code** (2 digits): Identifies the service/module (01 = Payments, 02 = Transactions, etc.)
- **Case Code** (3 digits): Identifies the specific case or error type (001, 002, 003, etc.)

**Examples**:
- `20001001` = HTTP 200 (Success) + Service 01 (Payments) + Case 001 (Payment created)
- `42201001` = HTTP 422 (Validation Error) + Service 01 (Payments) + Case 001 (Invalid amount)
- `40402001` = HTTP 404 (Not Found) + Service 02 (Transactions) + Case 001 (Transaction not found)
- `50001001` = HTTP 500 (Server Error) + Service 01 (Payments) + Case 001 (Gateway error)

## Success Responses

### 200 OK

Standard success response for GET requests and most operations:

```json
{
  "code": "20001001",
  "status": "completed",
  "message": "Operation completed successfully.",
  "data": {
    // Response data here
  }
}
```

### 201 Created

Response for resource creation operations:

```json
{
  "code": "20101001",
  "message": "Resource created successfully.",
  "data": {
    "id": 15,
    // Created resource data
  }
}
```

## Error Responses

### 401 Unauthorized

Returned when authentication fails or API keys are invalid:

```json
{
  "code": "40101001",
  "message": "Unauthorized"
}
```

**Common causes:**
- Missing `X-API-KEY` header
- Missing `X-MERCHANT-KEY` header
- Invalid API credentials
- Expired API keys

### 404 Not Found

Returned when a requested resource doesn't exist:

```json
{
  "code": "40402001",
  "message": "Transaction not found.",
  "success": false
}
```

**Common causes:**
- Invalid transaction ID
- Resource has been deleted
- Resource doesn't belong to your account

### 422 Validation Error

Returned when request data fails validation:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": [
      "The field_name is required.",
      "The field_name must be a string."
    ],
    "another_field": [
      "The another_field must be a number."
    ]
  }
}
```

**Common causes:**
- Missing required fields
- Invalid field formats
- Field value constraints violated
- Business rule violations

### 500 Server Error

Returned when an internal server error occurs:

```json
{
  "code": "50001001",
  "message": "Payment processing failed. Please try again.",
  "error": "Gateway timeout"
}
```

**Common causes:**
- Temporary server issues
- Gateway timeouts
- Database errors
- External service failures

## Response Structure

All responses follow a consistent structure:

### Success Response Structure

```json
{
  "code": "string",        // Response code (HTTP status + service code + case code)
  "status": "string",      // Optional: Status indicator
  "message": "string",     // Success message
  "data": {                // Response payload
    // Endpoint-specific data
  }
}
```

### Error Response Structure

```json
{
  "code": "string",       // Response code (HTTP status + service code + case code)
  "message": "string",     // Error message
  "errors": {              // Optional: Field-specific errors
    "field": ["error1", "error2"]
  },
  "error": "string",       // Alternative error format
  "success": false         // Optional: Success indicator
}
```

## Field-Specific Errors

Validation errors include field-specific error messages:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "wallet_id": [
      "Wallet not found or does not belong to you."
    ],
    "amount": [
      "Insufficient wallet balance for this withdrawal.",
      "Amount must be between 50000 and 50000000."
    ],
    "account_id": [
      "Withdraw account not found."
    ]
  }
}
```

## Handling Responses

### JavaScript Example

```javascript
async function makeRequest(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 422) {
      // Handle validation errors
      console.error('Validation errors:', data.errors);
    } else if (response.status === 401) {
      // Handle authentication error
      console.error('Authentication failed');
    } else {
      // Handle other errors
      console.error('Error:', data.message);
    }
    throw new Error(data.message);
  }
  
  return data;
}
```

### Python Example

```python
import requests

def make_request(url, headers, data=None):
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 422:
        # Handle validation errors
        errors = response.json().get('errors', {})
        for field, messages in errors.items():
            print(f"{field}: {', '.join(messages)}")
        raise ValueError("Validation failed")
    elif response.status_code == 401:
        # Handle authentication error
        raise ValueError("Authentication failed")
    elif not response.ok:
        # Handle other errors
        raise ValueError(response.json().get('message', 'Request failed'))
    
    return response.json()
```

## Best Practices

1. **Always Check Status Codes** - Don't rely solely on response body
2. **Handle All Error Types** - Implement handlers for all possible error responses
3. **Display User-Friendly Messages** - Translate technical errors into user-friendly messages
4. **Log Errors** - Log error responses for debugging and monitoring
5. **Retry Logic** - Implement retry logic for 500 errors
6. **Validate Client-Side** - Validate data before sending to reduce 422 errors

## Related Documentation

- [Transaction Statuses](./transaction-statuses.md)
- [Error Codes](./error-codes.md)
- [Authentication](../authentication.md)

