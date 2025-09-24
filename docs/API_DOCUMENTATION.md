# API Documentation - Sweet Shop Management System

## Base URL
```
http://localhost:3001/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow a consistent JSON format:

**Success Response:**
```json
{
  "data": "response_data",
  "message": "success_message"
}
```

**Error Response:**
```json
{
  "error": "error_message"
}
```

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required, min 6 characters)",
  "isAdmin": "boolean (optional, default: false)"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "is_admin": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `400 Bad Request` - Username already exists

### Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "is_admin": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Invalid credentials

## Sweet Management Endpoints

### Get All Sweets
**GET** `/sweets`

Retrieve all available sweets.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Chocolate Cake",
    "category": "Cakes",
    "price": 15.99,
    "quantity": 10,
    "createdAt": "2025-09-24T08:00:00.000Z",
    "updatedAt": "2025-09-24T08:00:00.000Z"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

### Search Sweets
**GET** `/sweets/search`

Search and filter sweets based on criteria.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `name` (string, optional) - Search by sweet name
- `category` (string, optional) - Filter by category
- `minPrice` (number, optional) - Minimum price filter
- `maxPrice` (number, optional) - Maximum price filter

**Example Request:**
```
GET /api/sweets/search?name=chocolate&minPrice=10&maxPrice=20
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Chocolate Cake",
    "category": "Cakes",
    "price": 15.99,
    "quantity": 10,
    "createdAt": "2025-09-24T08:00:00.000Z",
    "updatedAt": "2025-09-24T08:00:00.000Z"
  }
]
```

### Get Sweet by ID
**GET** `/sweets/:id`

Retrieve a specific sweet by its ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Chocolate Cake",
  "category": "Cakes",
  "price": 15.99,
  "quantity": 10,
  "createdAt": "2025-09-24T08:00:00.000Z",
  "updatedAt": "2025-09-24T08:00:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Sweet not found

### Create Sweet (Admin Only)
**POST** `/sweets`

Add a new sweet to the inventory.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "string (required)",
  "category": "string (required)",
  "price": "number (required, >= 0)",
  "quantity": "number (required, >= 0)"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Chocolate Cake",
  "category": "Cakes",
  "price": 15.99,
  "quantity": 10,
  "createdAt": "2025-09-24T08:00:00.000Z",
  "updatedAt": "2025-09-24T08:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Admin access required

### Update Sweet (Admin Only)
**PUT** `/sweets/:id`

Update an existing sweet's information.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "category": "string (optional)",
  "price": "number (optional, >= 0)",
  "quantity": "number (optional, >= 0)"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Chocolate Cake",
  "category": "Cakes",
  "price": 17.99,
  "quantity": 15,
  "createdAt": "2025-09-24T08:00:00.000Z",
  "updatedAt": "2025-09-24T09:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Admin access required
- `404 Not Found` - Sweet not found

### Delete Sweet (Admin Only)
**DELETE** `/sweets/:id`

Remove a sweet from the inventory.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "message": "Sweet deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Admin access required
- `404 Not Found` - Sweet not found

## Inventory Management Endpoints

### Purchase Sweet
**POST** `/sweets/:id/purchase`

Purchase a quantity of a specific sweet.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": "number (required, > 0)"
}
```

**Response (200 OK):**
```json
{
  "message": "Successfully purchased 2 Chocolate Cake(s)",
  "sweet": {
    "id": 1,
    "name": "Chocolate Cake",
    "category": "Cakes",
    "price": 15.99,
    "quantity": 8,
    "createdAt": "2025-09-24T08:00:00.000Z",
    "updatedAt": "2025-09-24T09:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid quantity or insufficient stock
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Sweet not found

### Restock Sweet (Admin Only)
**POST** `/sweets/:id/restock`

Add inventory to an existing sweet.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "quantity": "number (required, > 0)"
}
```

**Response (200 OK):**
```json
{
  "message": "Successfully restocked 10 Chocolate Cake(s)",
  "sweet": {
    "id": 1,
    "name": "Chocolate Cake",
    "category": "Cakes",
    "price": 15.99,
    "quantity": 18,
    "createdAt": "2025-09-24T08:00:00.000Z",
    "updatedAt": "2025-09-24T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid quantity
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Admin access required
- `404 Not Found` - Sweet not found

## Health Check Endpoint

### Health Check
**GET** `/health`

Check if the API server is running.

**Response (200 OK):**
```json
{
  "status": "OK",
  "message": "Sweet Shop API is running"
}
```

## Error Codes Reference

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Rate Limiting
Currently, no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS Policy
The API accepts requests from all origins (`*`). In production, configure CORS to only allow requests from your frontend domain.

## Example Usage with cURL

### Register a new admin user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123",
    "isAdmin": true
  }'
```

### Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### Get all sweets:
```bash
curl -X GET http://localhost:3001/api/sweets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create a new sweet:
```bash
curl -X POST http://localhost:3001/api/sweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "Strawberry Cake",
    "category": "Cakes",
    "price": 12.99,
    "quantity": 5
  }'
```

### Purchase a sweet:
```bash
curl -X POST http://localhost:3001/api/sweets/1/purchase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "quantity": 2
  }'
```

## SDK and Client Libraries
Currently, no official SDK is available. Use any HTTP client library in your preferred programming language to interact with the API.

## Changelog
- **v1.0.0** - Initial API release with full CRUD operations for sweets and user authentication

