# Transaction Statuses

This document describes all available transaction status values in the WRPay API.

## Available Statuses

The following transaction statuses are used throughout the API:

### `pending`
Transaction has been created and is waiting to be processed. This is the initial state when a payment request is first submitted.

### `awaiting_fi_process`
Transaction is waiting for financial institution processing. The payment gateway has received the request and is routing it to the financial institution.

### `awaiting_pg_process`
Transaction is waiting for payment gateway processing. The request is being processed by the payment gateway before being sent to the financial institution.

### `awaiting_user_action`
Transaction requires user action (e.g., payment confirmation, OTP verification, or completing a payment form). The transaction is paused until the user completes the required action.

### `awaiting_admin_approval`
Transaction is pending administrative approval. Some transactions may require manual review before processing can continue.

### `completed`
Transaction has been successfully completed. The payment has been processed and funds have been transferred.

### `canceled`
Transaction was canceled before completion. This can occur if:
- The user cancels the payment
- The transaction times out
- The merchant cancels the transaction
- An administrative action cancels the transaction

### `failed`
Transaction processing failed. This indicates an error occurred during processing. Common causes include:
- Insufficient funds
- Invalid payment details
- Gateway errors
- Network issues

### `refunded`
Transaction has been refunded. The original payment was successful, but funds have been returned to the customer.

### `expired`
Transaction has expired and is no longer valid. This typically occurs when:
- The payment QR code expires
- The transaction timeout period is exceeded
- The payment window closes

## Status Flow

A typical transaction follows this flow:

```
pending → awaiting_pg_process → awaiting_fi_process → completed
                                    ↓
                              awaiting_user_action
                                    ↓
                              (user completes action)
                                    ↓
                              completed
```

Alternative flows:

- **Cancellation**: `pending` → `canceled`
- **Failure**: `pending` → `awaiting_pg_process` → `failed`
- **Expiration**: `pending` → `expired`
- **Refund**: `completed` → `refunded`

## Checking Transaction Status

Use the Check Transaction Status endpoint to retrieve the current status of any transaction:

```bash
GET /api/v2/check-status/{trx_id}
```

See the Transactions section in the API documentation for detailed endpoint information.

## Status in Responses

Transaction status appears in several API responses:

- **Payment initiation responses** - Initial status (usually `pending`)
- **Status check responses** - Current status with full transaction details
- **Callback notifications** - Status updates sent to your webhook endpoint

## Example Response

```json
{
  "status": "completed",
  "message": "Payment, request status checked successfully.",
  "data": {
    "trx_id": "TRX20241101001",
    "trx_ref": "INV-2024-0001",
    "referenceNumber": "123456789012",
    "amount": 150000,
    "currency_code": "IDR",
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

