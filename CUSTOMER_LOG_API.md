
# AquaPiol - Customers Log Management API

## Module
Customer Management and Customer Logs

## Base URL
http://localhost:3000

---

## 1. Customer Management

### GET /api/customers
Retrieve all customers.

### POST /api/customers
Create a new customer.

Request Body:
```json
{
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "middleName": "Santos",
  "contactNumber": "09123456789",
  "email": "juan@example.com",
  "address": "Bongabong, Oriental Mindoro"
}
```

### GET /api/customers/:id
Retrieve a specific customer.

### PUT /api/customers/:id
Update customer information.

### PATCH /api/customers/:id/archive
Archive a customer by changing status to inactive.

---

## 2. Customer Logs

### GET /api/customer-logs
Retrieve all customer logs.

### GET /api/customers/:customerId/logs
Retrieve logs for a specific customer.

### POST /api/customer-logs
Create a customer log.

Request Body:
```json
{
  "customerId": 1,
  "logType": "concern",
  "description": "Customer reported a delayed delivery.",
  "status": "open"
}
```

Allowed log types:
- refill
- concern
- feedback

Allowed statuses:
- open
- in_progress
- resolved
- closed

### PATCH /api/customer-logs/:id/status
Update the status of a customer log.

Request Body:
```json
{
  "status": "resolved"
}
```

---

## 3. Response Format

Successful response:
```json
{
  "success": true,
  "data": []
}
```

Error response:
```json
{
  "success": false,
  "message": "Error message"
}
```

## 4. Database Models

### customers
- id
- firstName
- lastName
- middleName
- contactNumber
- email
- address
- status
- createdAt
- updatedAt

### customer_logs
- id
- customerId
- logType
- description
- status
- loggedAt
- createdAt
- updatedAt

## 5. Integration Notes

- Customer records may be needed by POS and Ordering modules.
- Customer logs reference customers through customerId.
- Coordinate table ownership and naming with the main integration team.
- Do not run migrations against the shared database without approval.
