# MyCoverGenius Insurance API Documentation

## Overview
A comprehensive insurance API built with NestJS, featuring standardized responses, comprehensive error handling, and interactive API documentation.

## Features Added

### 1. Swagger API Documentation
- **Endpoint**: `http://localhost:3000/api`
- **Description**: Interactive API documentation with Swagger UI
- **Features**:
  - Complete endpoint documentation
  - Request/response examples
  - Schema definitions
  - Try-it-out functionality

### 2. Response Interceptor
- **Purpose**: Standardizes all successful API responses
- **Response Format**:
```json
{
  "status": true,
  "message": "Request successful",
  "data": <actual_response_data>
}
```

### 3. HTTP Exception Filter
- **Purpose**: Standardizes all error responses
- **Error Response Format**:
```json
{
  "status": false,
  "message": "<error_message>",
  "data": null,
  "timestamp": "2025-06-07T15:58:37.167Z",
  "path": "/endpoint-path"
}
```

## API Endpoints

### Products
- `GET /products` - Get all insurance products
- `GET /products/:id` - Get specific product by ID

### Plans
- `POST /plans` - Purchase an insurance plan
- `GET /plans/:id` - Get plan details by ID
- `GET /plans/user/:userId` - Get all plans for a user

### Pending Policies
- `GET /pending-policies/plan/:planId` - Get pending policies for a plan
- `GET /pending-policies/:id` - Get pending policy by ID

### Policies
- `POST /policies/activate/:pendingPolicyId` - Activate a pending policy
- `GET /policies` - Get all active policies
- `GET /policies/:id` - Get policy by ID
- `GET /policies/user/:userId` - Get all policies for a user

## Example Usage

### Successful Response
```bash
curl http://localhost:3000/products
```
Response:
```json
{
  "status": true,
  "message": "Request successful",
  "data": [
    {
      "id": 1,
      "name": "Optimal care mini",
      "price": "10000.00",
      "description": "Basic health insurance coverage",
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Health",
        "description": "Health insurance products"
      }
    }
  ]
}
```

### Error Response
```bash
curl http://localhost:3000/invalid-endpoint
```
Response:
```json
{
  "status": false,
  "message": "Cannot GET /invalid-endpoint",
  "data": null,
  "timestamp": "2025-06-07T15:58:37.167Z",
  "path": "/invalid-endpoint"
}
```

### Purchase Plan
```bash
curl -X POST http://localhost:3000/plans \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productId": 1,
    "quantity": 1
  }'
```

## Development

### Start the application
```bash
npm run start:dev
```

### Run tests
```bash
npm test
```

### Access Swagger Documentation
Open your browser and navigate to: `http://localhost:3000/api`

## Response Structure

All API responses follow a consistent structure:

**Success Response:**
- `status`: `true` for successful requests
- `message`: "Request successful" 
- `data`: The actual response data

**Error Response:**
- `status`: `false` for failed requests
- `message`: Error description
- `data`: `null` for errors
- `timestamp`: ISO timestamp of the error
- `path`: The endpoint that caused the error

This standardized format makes it easy for frontend applications to handle responses consistently. 