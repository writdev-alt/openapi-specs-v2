# API Response Codes Documentation

## Overview

All API responses follow a standardized format with composite response codes. The response code format is:

**HTTP_STATUS_CODE + SERVICE_CODE + CASE_CODE**

- **HTTP Status Code** (3 digits): Standard HTTP status code (200, 201, 400, 401, 404, 422, 500, etc.)
- **Service Code** (2 digits): Identifies the service/module (00-06)
- **Case Code** (2 digits): Identifies the specific case/scenario (01-99)

**Example:** `2010301` = HTTP 201 + Service 03 (Withdrawal) + Case 01 (Success)

---

## Service Codes

| Code | Service | Description | Constant |
|------|---------|-------------|----------|
| `00` | General | General service operations | `ResponseCode::SERVICE_GENERAL` |
| `01` | Auth | Authentication and authorization | `ResponseCode::SERVICE_AUTH` |
| `02` | Payment | Payment processing | `ResponseCode::SERVICE_PAYMENT` |
| `03` | Withdrawal | Withdrawal operations | `ResponseCode::SERVICE_WITHDRAWAL` |
| `04` | Wallet | Wallet operations | `ResponseCode::SERVICE_WALLET` |
| `05` | Transaction | Transaction operations | `ResponseCode::SERVICE_TRANSACTION` |
| `06` | Validation | Validation errors | `ResponseCode::SERVICE_VALIDATION` |

---

## Case Codes by Service

### General Service (00)

| Code | Case | Description | Constant |
|------|------|-------------|----------|
| `01` | Success | Operation completed successfully | `ResponseCode::CASE_SUCCESS` |
| `02` | Error | General error occurred | `ResponseCode::CASE_ERROR` |
| `03` | Not Found | Resource not found | `ResponseCode::CASE_NOT_FOUND` |
| `04` | Unauthorized | Unauthorized access | `ResponseCode::CASE_UNAUTHORIZED` |
| `05` | Forbidden | Access forbidden | `ResponseCode::CASE_FORBIDDEN` |
| `06` | Server Error | Internal server error | `ResponseCode::CASE_SERVER_ERROR` |

### Auth Service (01)

| Code | Case | Description | Constant |
|------|------|-------------|----------|
| `01` | Auth Success | Authentication successful | `ResponseCode::CASE_AUTH_SUCCESS` |
| `02` | Auth Failed | Authentication failed | `ResponseCode::CASE_AUTH_FAILED` |
| `03` | Token Invalid | Authentication token is invalid | `ResponseCode::CASE_AUTH_TOKEN_INVALID` |
| `04` | Token Expired | Authentication token has expired | `ResponseCode::CASE_AUTH_TOKEN_EXPIRED` |
| `05` | Auth Required | Authentication required | `ResponseCode::CASE_AUTH_REQUIRED` |

### Payment Service (02)

| Code | Case | Description | Constant |
|------|------|-------------|----------|
| `01` | Payment Success | Payment processed successfully | `ResponseCode::CASE_PAYMENT_SUCCESS` |
| `02` | Payment Failed | Payment processing failed | `ResponseCode::CASE_PAYMENT_FAILED` |
| `03` | Payment Pending | Payment is pending | `ResponseCode::CASE_PAYMENT_PENDING` |
| `04` | Payment Duplicate | Duplicate payment detected | `ResponseCode::CASE_PAYMENT_DUPLICATE` |
| `05` | Invalid Merchant | Invalid merchant configuration | `ResponseCode::CASE_PAYMENT_INVALID_MERCHANT` |
| `06` | Connection Error | Payment gateway connection error | `ResponseCode::CASE_PAYMENT_CONNECTION_ERROR` |

### Withdrawal Service (03)

| Code | Case | Description | Constant |
|------|------|-------------|----------|
| `01` | Withdrawal Success | Withdrawal created successfully | `ResponseCode::CASE_WITHDRAWAL_SUCCESS` |
| `02` | Withdrawal Failed | Withdrawal processing failed | `ResponseCode::CASE_WITHDRAWAL_FAILED` |
| `03` | Insufficient Balance | Insufficient wallet balance | `ResponseCode::CASE_WITHDRAWAL_INSUFFICIENT_BALANCE` |
| `04` | Invalid Account | Invalid withdrawal account | `ResponseCode::CASE_WITHDRAWAL_INVALID_ACCOUNT` |
| `05` | Limit Exceeded | Withdrawal limit exceeded | `ResponseCode::CASE_WITHDRAWAL_LIMIT_EXCEEDED` |
| `06` | Invalid Currency | Invalid currency for withdrawal | `ResponseCode::CASE_WITHDRAWAL_INVALID_CURRENCY` |
| `07` | Withdrawal Rejected | Withdrawal has been rejected | `ResponseCode::CASE_WITHDRAWAL_REJECTED` |

### Wallet Service (04)

| Code | Case | Description | Constant |
|------|------|-------------|----------|
| `01` | Wallet Success | Wallet operation successful | `ResponseCode::CASE_WALLET_SUCCESS` |
| `02` | Wallet Not Found | Wallet not found | `ResponseCode::CASE_WALLET_NOT_FOUND` |
| `03` | Insufficient Balance | Insufficient wallet balance | `ResponseCode::CASE_WALLET_INSUFFICIENT_BALANCE` |

### Transaction Service (05)

| Code | Case | Description | Constant |
|------|------|-------------|----------|
| `01` | Transaction Success | Transaction operation successful | `ResponseCode::CASE_TRANSACTION_SUCCESS` |
| `02` | Transaction Not Found | Transaction not found | `ResponseCode::CASE_TRANSACTION_NOT_FOUND` |
| `03` | Transaction Invalid | Invalid transaction | `ResponseCode::CASE_TRANSACTION_INVALID` |

### Validation Service (06)

| Code | Case | Description | Constant |
|------|------|-------------|----------|
| `01` | Validation Failed | General validation failure | `ResponseCode::CASE_VALIDATION_FAILED` |
| `02` | Invalid Field | Field validation failed | `ResponseCode::CASE_VALIDATION_INVALID_FIELD` |
| `03` | Missing Field | Required field is missing | `ResponseCode::CASE_VALIDATION_MISSING_FIELD` |

---

## Common Response Code Examples

| Response Code | HTTP Status | Service | Case | Description | Example Usage |
|---------------|-------------|---------|------|-------------|---------------|
| `2000001` | 200 | General (00) | Success (01) | General success | Default success response |
| `2000101` | 200 | Auth (01) | Auth Success (01) | Authentication successful | Login success |
| `2000201` | 200 | Payment (02) | Payment Success (01) | Payment processed | QRIS payment success |
| `2000301` | 200 | Withdrawal (03) | Withdrawal Success (01) | Withdrawal operation success | Withdrawal status check |
| `2000401` | 200 | Wallet (04) | Wallet Success (01) | Wallet operation success | Wallet retrieved |
| `2000501` | 200 | Transaction (05) | Transaction Success (01) | Transaction operation success | Transaction retrieved |
| `2010301` | 201 | Withdrawal (03) | Withdrawal Success (01) | Withdrawal created | New withdrawal request |
| `4000002` | 400 | General (00) | Error (02) | General error | Bad request |
| `4010105` | 401 | Auth (01) | Auth Required (05) | Authentication required | Missing/invalid token |
| `4030101` | 403 | Auth (01) | Forbidden (01) | Access forbidden | Insufficient permissions |
| `4030102` | 403 | Auth (01) | IP Not Whitelisted (02) | IP address not whitelisted | IP whitelist restriction |
| `4040003` | 404 | General (00) | Not Found (03) | Resource not found | Generic not found |
| `4040402` | 404 | Wallet (04) | Wallet Not Found (02) | Wallet not found | Wallet lookup failed |
| `4040502` | 404 | Transaction (05) | Transaction Not Found (02) | Transaction not found | Transaction lookup failed |
| `4220601` | 422 | Validation (06) | Validation Failed (01) | Validation error | Form validation failed |
| `4220602` | 422 | Validation (06) | Invalid Field (02) | Field validation failed | Invalid field value |
| `4220603` | 422 | Validation (06) | Missing Field (03) | Missing required field | Required field missing |
| `5000006` | 500 | General (00) | Server Error (06) | Internal server error | Unexpected error |
| `5000206` | 500 | Payment (02) | Server Error (06) | Payment service error | Payment gateway error |
| `5030206` | 503 | Payment (02) | Connection Error (06) | Payment gateway unavailable | Gateway connection failed |

---

## HTTP Status Code Reference

| HTTP Status | Status Name | Common Use Cases | Typical Service Codes |
|-------------|-------------|------------------|----------------------|
| `200` | OK | Successful GET, PUT requests | All services |
| `201` | Created | Resource created successfully | Withdrawal (03), Transaction (05) |
| `202` | Accepted | Request accepted for processing | Payment (02) |
| `400` | Bad Request | Invalid request format | General (00) |
| `401` | Unauthorized | Missing or invalid authentication | Auth (01) |
| `403` | Forbidden | Authenticated but insufficient permissions | Auth (01) |
| `404` | Not Found | Resource not found | All services |
| `422` | Unprocessable Entity | Validation errors | Validation (06) |
| `500` | Internal Server Error | Server-side errors | All services |
| `503` | Service Unavailable | Service temporarily unavailable | Payment (02) |

---

## Response Structure

### Success Response

```json
{
  "code": "20105001",
  "message": "Withdrawal has been created.",
  "data": {
    "trxId": "TXN123456",
    "amount": "1000.00",
    "accountId": 1,
    "walletId": "wallet-uuid"
  }
}
```

### Error Response

```json
{
  "code": "42201001",
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "amount": ["The amount must be greater than 0."]
  }
}
```

### Error Response (No Details)

```json
{
  "code": "40404002",
  "message": "Wallet not found"
}
```

---

## Usage Examples

### PHP Code Examples

```php
use App\Enums\ResponseCode;
use App\Services\ApiResponseService;

// Basic success response
return apiResponse()->success(['id' => 1], 'User created');

// Withdrawal success with custom codes
return apiResponse()->success(
    data: ['trx_id' => 'TXN123'],
    message: 'Withdrawal created',
    serviceCode: ResponseCode::SERVICE_WITHDRAWAL,
    caseCode: ResponseCode::CASE_WITHDRAWAL_SUCCESS,
    httpStatus: 201
);

// Validation error
return apiResponse()->validationError('Validation failed', $errors);

// Not found with service code
return apiResponse()->notFound('Wallet not found', ResponseCode::SERVICE_WALLET);

// Unauthorized
return apiResponse()->unauthorized('Invalid authentication token');

// Custom error
return apiResponse()->error(
    message: 'Payment gateway connection failed',
    serviceCode: ResponseCode::SERVICE_PAYMENT,
    caseCode: ResponseCode::CASE_PAYMENT_CONNECTION_ERROR,
    httpStatus: 503
);
```

---

## Code Generation

### Generate Response Code

```php
use App\Enums\ResponseCode;

// Generate composite code
$code = ResponseCode::generate(201, ResponseCode::SERVICE_WITHDRAWAL, ResponseCode::CASE_WITHDRAWAL_SUCCESS);
// Returns: "2010301"
```

### Parse Response Code

```php
use App\Enums\ResponseCode;

// Parse composite code
$parsed = ResponseCode::parse('2010301');
// Returns: [
//   'httpStatus' => 201,
//   'serviceCode' => '03',
//   'caseCode' => '01'
// ]
```

---

## Notes

- Response codes are always 7 digits: 3 (HTTP) + 2 (Service) + 2 (Case)
- Service codes range from `00` to `06`
- Case codes range from `01` to `99` (currently using `01`-`07`)
- All responses include the `success` boolean flag
- Error responses may include an optional `errors` field
- Success responses include a `data` field with the response payload

