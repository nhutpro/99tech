# 99Tech Backend API

A RESTful API backend built with Express.js, TypeScript, and Prisma ORM for user management with JWT authentication.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Part 1: API Endpoints Overview](#part-1-api-endpoints-overview)
- [Part 2: How to Start the Application](#part-2-how-to-start-the-application)
- [Part 3: Testing with Postman Collection](#part-3-testing-with-postman-collection)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)

## 🚀 Features

- JWT-based authentication
- Complete CRUD operations for user management
- PostgreSQL database with Prisma ORM
- Redis integration for caching
- Docker support
- Request validation with Joi
- Comprehensive error handling
- Pagination and filtering
- Professional logging with Winston

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **yarn** package manager
- **PostgreSQL** database
- **Redis** server (optional but recommended)
- **Docker** and **Docker Compose** (for containerized setup)
- **Postman** application for API testing



## Part 1: API Endpoints Overview

### 🔐 Authentication Endpoints

#### POST `/api/auth`
**Purpose:** Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "userId": 10
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
     "id": 10,
     "name": "John Doe",
     "email": "john.doe@example.com",
     "gender": "male",
     "role": "user"
  }
}
```

**Notes for Beginners:**
- This endpoint simulates login by providing a `userId`.
- The returned `accessToken` must be included in all subsequent requests.
- The token is a JWT (JSON Web Token) that contains user information.

---

### 👤 User Management Endpoints

All user endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### GET `/api/users/:id`
**Purpose:** Get a specific user by ID.

**Example:** `GET /api/users/1`

**Response:**
```json
{
  "success": true,
  "data": {
     "id": 1,
     "name": "John Doe",
     "email": "john.doe@example.com",
     "gender": "male",
     "role": "user",
     "createdAt": "2025-08-04T12:00:00.000Z",
     "updatedAt": "2025-08-04T12:00:00.000Z"
  }
}
```

#### GET `/api/users`
**Purpose:** Get a list of users with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of users per page (default: 10)
- `gender` (optional): Filter by gender ("male" or "female")

**Example:** `GET /api/users?page=1&limit=10&gender=male`

**Response:**
```json
{
  "success": true,
  "data": [
     {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "gender": "male",
        "role": "user"
     }
  ],
  "pagination": {
     "page": 1,
     "limit": 10,
     "total": 25,
     "totalPages": 3
  }
}
```

#### POST `/api/users`
**Purpose:** Create a new user.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "gender": "female",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
     "id": 11,
     "name": "Jane Smith",
     "email": "jane.smith@example.com",
     "gender": "female",
     "role": "admin",
     "createdAt": "2025-08-04T12:00:00.000Z",
     "updatedAt": "2025-08-04T12:00:00.000Z"
  }
}
```

#### PUT `/api/users/:id`
**Purpose:** Update an existing user.

**Example:** `PUT /api/users/1`

**Request Body:** (You can update one or more fields.)
```json
{
  "name": "John Updated",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
     "id": 1,
     "name": "John Updated",
     "email": "john.doe@example.com",
     "gender": "male",
     "role": "admin",
     "updatedAt": "2025-08-04T12:30:00.000Z"
  }
}
```

#### DELETE `/api/users/:id`
**Purpose:** Delete a user.

**Example:** `DELETE /api/users/1`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### GET `/api/health`
**Purpose:** Check if the API is running (health check).

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-04T12:00:00.000Z",
  "uptime": "0d 2h 30m 15s"
}
```

---

## Part 2: How to Start the Application

### Step 1: Create .env File (Recommended for beginners)
```env
DATABASE_URL=postgresql://tech99_user:tech99_password@localhost:5432/tech99_db
PORT=5000
NODE_ENV=development
JWT_SECRET=JWTSecret
ACCESS_TOKEN_EXPIRES_IN=20m
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=tech99_redis_password
```

### Step 2: Install packages
```bash
yarn install
```

### Step 3: Start Docker (Containerized Setup)

1. **Start with Docker Compose:**
    ```bash
    yarn start-docker
    ```
    This will start:
    - PostgreSQL database
    - Redis server

Available User Records in Database 
![database ](image.png)

2. **Stop Docker containers:**
    ```bash
    yarn stop-docker
    ```

### Step 4: Start the App
```bash
yarn dev
```

---

🎉 **You're ready to go!** The API will be running on `http://localhost:5000`

## Part 3: Testing with Postman Collection

### Step 1: Import the Postman Collection

1. **Open the Postman application.**
2. **Import the collection:**
    - Click the "Import" button in Postman.
    - Select "Upload Files."
    - Choose the `99tech.postman_collection.json` file from the project directory.
    - Click "Import."
3. **The collection will appear** in your Postman sidebar with the name "99tech."

### Step 2: Set Up Environment (Important!)

1. **Create a new environment:**
    - Click the gear icon (⚙️) in the top right corner.
    - Click "Add" to create a new environment.
    - Name it "99tech Local."
2. **Add environment variable:**
    - Add a variable named `bearer_token` (leave the initial value empty).
    - Save the environment.
3. **Select the environment:**
    - Use the dropdown in the top right to select "99tech Local."

### Step 3: Testing Workflow (Follow this order!)

#### 🏥 Step 3.1: Health Check
1. **Run:** `GET /health`
2. **Purpose:** Verify the server is running.
3. **Expected result:** Status 200 with "OK" message.

#### 🔑 Step 3.2: Authentication (MUST DO FIRST!)
1. **Run:** `POST /auth`
2. **Body contains:** `{"userId": 10}`
3. **Important:** This request will automatically save the JWT token to your environment.
4. **Expected result:** You receive an `accessToken` and user information.
5. **What happens:** The Postman script automatically saves the token as `bearer_token`.

#### 👤 Step 3.3: User Operations (In any order)

**Get User by ID:**
1. **Run:** `GET /user/:id`
2. **Note:** The token is automatically included from the previous auth request.
3. **Expected result:** User details for ID 1.

**Get All Users with Filtering:**
1. **Run:** `GET /api/users?page=2&limit=5`
2. **Note:** This shows pagination and filtering by `gender=male`.
3. **Expected result:** Paginated list of male users.

**Create New User:**
1. **Run:** `POST /api/users`
2. **Body contains:** User information (name, email, gender, role).
3. **Expected result:** Newly created user with generated ID.

**Update User:**
1. **Run:** `PUT /api/users/:id`
2. **Body contains:** Fields to update (e.g., `{"name": "Updated Name"}`).
3. **Expected result:** Updated user information.

**Delete User:**
1. **Run:** `DELETE /api/users/:id`
2. **Note:** This will delete the user with the specified ID.
3. **Expected result:** Success message.

### 🚨 Important Notes for Testing

1. **Always authenticate first!** The `/auth` endpoint must be called before any user operations.  The access token of an admin user can execute all user operations, but a regular user's token can only get and update their own info.
2. **Token is automatic:** The Postman collection automatically handles the JWT token for you.
3. **Check responses:** All successful responses have `"success": true` and relevant data.
4. **Error handling:** If you get errors, check:
    - Is the server running?
    - Did you authenticate first?
    - Is the database connected?
    - Are you using valid data in requests?
5. **Common HTTP status codes:**
    - `200` - Success
    - `201` - Created (for POST requests)
    - `400` - Bad Request (invalid data)
    - `401` - Unauthorized (missing or invalid token)
    - `404` - Not Found (user doesn't exist)
    - `500` - Internal Server Error

### 🔍 Troubleshooting Testing

**Problem:** "Unauthorized" error  
- **Solution:** Make sure you ran the `/auth` endpoint first.

**Problem:** "User not found"  
- **Solution:** Check if the user ID exists in your database.

**Problem:** "Email already exists"  
- **Solution:** Use a different email address when creating users.

**Problem:** Server not responding  
- **Solution:** Make sure the server is running (`npm run dev`).

## 🗄️ Database Schema

The application uses a simple User model:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  gender    String   @default("male")
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt
}
```

**Field Descriptions:**
- `id`: Auto-incrementing primary key
- `name`: User's full name
- `email`: Unique email address
- `gender`: "male" or "female" (defaults to "male")
- `role`: "user" or "admin" (defaults to "user")
- `createdAt`: Timestamp when user was created
- `updatedAt`: Timestamp when user was last updated

---
