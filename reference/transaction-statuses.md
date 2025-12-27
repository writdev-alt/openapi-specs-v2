# Transaction Statuses

This document describes all available transaction status values in the WRPay API. The API uses different status enums for payments and withdrawals.

## Payment Transaction Statuses

Payment transactions (QRIS) use the `PaymentTransactionStatus` enum with the following values:

### `pending`
Payment has been created and is waiting to be processed. This is the initial state when a payment request is first submitted.

### `completed`
Payment has been successfully completed. The payment has been processed and funds have been transferred.

### `expired`
Payment has expired and is no longer valid. This typically occurs when:
- The payment QR code expires
- The transaction timeout period is exceeded
- The payment window closes

**Payment Status Flow:**
```
pending → completed
pending → expired (if not paid within time limit)
```

## Withdrawal Transaction Statuses

Withdrawal transactions use the `WithdrawalTransactionStatus` enum with the following values:

### `awaiting_fi_process`
Transaction is waiting for financial institution processing. The payment gateway has received the request and is routing it to the financial institution.

### `awaiting_pg_process`
Transaction is waiting for payment gateway processing. The request is being processed by the payment gateway before being sent to the financial institution.

### `completed`
Transaction has been successfully completed. The withdrawal has been processed and funds have been transferred.

### `failed`
Transaction processing failed. This indicates an error occurred during processing. Common causes include:
- Insufficient funds
- Invalid account details
- Gateway errors
- Network issues

### `refunded`
Transaction has been refunded. The original withdrawal was successful, but funds have been returned to the wallet.

**Withdrawal Status Flow:**
```
awaiting_pg_process → awaiting_fi_process → completed
                          ↓
                       failed
completed → refunded
```

## Checking Transaction Status

Use the appropriate endpoint to retrieve the current status of any transaction:

**For Payments:**
```bash
GET /api/v2/check-payment-status/{trx_id}
```

**For Withdrawals:**
```bash
GET /api/v2/check-withdrawal-status/{trx_id}
```

See the Transactions section in the API documentation for detailed endpoint information.

## Status in Responses

Transaction status appears in several API responses:

- **Payment initiation responses** - Initial status (usually `pending`)
- **Withdrawal creation responses** - Initial status (usually `awaiting_pg_process`)
- **Status check responses** - Current status with full transaction details
- **Callback notifications** - Status updates sent to your webhook endpoint

## Example Payment Response

```json
{
  "code": "20001001",
  "message": "Payment status checked successfully.",
  "data": {
    "trxId": "TRX20241101001",
    "trxRef": "INV-2024-0001",
    "referenceNumber": "123456789012",
    "amount": "150000.00",
    "currencyCode": "IDR",
    "status": "completed"
  }
}
```

## Example Withdrawal Response

```json
{
  "code": "20005001",
  "message": "Withdrawal status checked successfully.",
  "data": {
    "trxId": "TRX-2025.01.15-ABC123XYZ",
    "trxRef": "WD-2025-0001",
    "amount": "250000.00",
    "status": "completed"
  }
}
```

## Best Practices

1. **Poll for Status Updates** - Use the check status endpoint to poll for updates if callbacks are not received
2. **Handle All Statuses** - Ensure your application handles all possible status values
3. **Set Timeouts** - Implement timeouts for transactions stuck in intermediate states
4. **Monitor Expired Transactions** - Track expired transactions and handle them appropriately
5. **Handle Failures Gracefully** - Provide clear error messages for failed transactions

## Related Documentation

- [Common Responses](./common-responses.md)
- [Error Codes](./error-codes.md)
- [Authentication](../authentication.md)

