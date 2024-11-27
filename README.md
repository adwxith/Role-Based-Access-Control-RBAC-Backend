
---

# Role-Based-Access-Control (RBAC) Backend

This backend application implements Role-Based Access Control (RBAC) for managing user roles and authentication. Built with Node.js and PostgreSQL, it uses JWT for authentication and Docker for containerization.

---
**⚠️ Precautions ⚠️**

- **Access Tokens:** Access tokens are returned in API responses for easier testing and reference during project development. **This is not a best practice for production environments.** Always ensure tokens are handled securely and never exposed unnecessarily.

- **Environment Files:** Including sensitive files like `.env` or embedding environment variables in `docker-compose.yml` is only for simplicity during development. **Avoid committing such files to version control** and use secure methods for storing environment variables in production (e.g., deployment secrets or environment management tools).

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Roles and Permissions](#roles-and-permissions)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Role Management](#role-management)
- [API Testing with Postman](#api-testing-with-postman)
- [Best Practices](#best-practices)
- [License](#license)

---

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:adwxith/Role-Based-Access-Control-RBAC-Backend.git
   cd Role-Based-Access-Control-RBAC-Backend
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

---

## Setup

### Environment Variables
Create a `.env` file in the root directory with the following:
```plaintext
ACCESS_SECRET_KEY=your-secret-key
```

**Note:** 
- Database credentials are defined in `docker-compose.yml` and do not need to be specified here.
- Change `ACCESS_SECRET_KEY` to a strong, unique value.

---

### Database Setup

1. Start PostgreSQL using Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. Find the PostgreSQL container ID:
   ```bash
   docker ps
   ```

3. Access the PostgreSQL container:
   ```bash
   docker exec -it <postgres_container_id> psql -U postgres -d authdb
   ```

4. Create the `users` table:
   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       username VARCHAR(255) NOT NULL,
       password VARCHAR(255) NOT NULL,
       role VARCHAR(50) NOT NULL
   );
   ```

---

### Roles and Permissions

Roles and their associated permissions are defined in `roles.js`:
```javascript
const roles = {
    admin: ['dashboard-edit', 'read', 'write', 'delete'],
    moderator: ['read', 'write'],
    user: ['read']
};

module.exports = roles;
```

**Admin Role Setup During Development:**
- During development, you can create an admin user using the `/createUser` endpoint. Use a tool like Postman to make a `POST` request with the following body:
   ```json
   {
       "username": "adminUser",
       "password": "adminPassword",
       "role": "admin"
   }
   ```

**Default Role for Users:**
- After development, the `createUser` API will automatically set the role to `user` by default. Any role beyond `user` can only be assigned by an admin through the `/admin/update-role` API.

---

## Docker Setup

### Building and Running the Docker Containers

1. Build the Docker image:
   ```bash
   docker build -t rbac-backend .
   ```

2. Start the application and PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

3. Stop the containers:
   ```bash
   docker-compose down
   ```

---

## API Documentation

### 1. Login - `/login` (POST)
**Description:** Authenticates a user and generates JWT tokens.

#### Request Body:
```json
{
  "username": "exampleUser",
  "password": "userPassword"
}
```

---

### 2. Create User - `/createUser` (POST)
**Description:** Registers a new user. The role is set to `user` by default after development, but during development, you can assign roles explicitly.

#### Request Body:
```json
{
  "username": "newUser",
  "password": "newUserPassword",
  "role": "user"  
}
```

---

### 3. Role-Based Routes

- **Admin Route** - `/admin` (GET): Requires `dashboard-edit` permission.
  - Response: List of all users.
- **Moderator Route** - `/moderator` (GET): Requires `write` permission.
- **User Route** - `/user` (GET): Requires `read` permission.
- **Profile Route** - `/profile` (GET): Accessible by all authenticated users.

---

### 4. Logout - `/logout` (POST)
**Description:** Logs out the user and adds the JWT token to a blacklist.

#### Request Header:
```plaintext
Authorization: Bearer <access_token>
```

---

## Role Management

### Updating a User's Role - `/admin/update-role` (PUT)
**Description:** Allows an admin to update the role of a specific user. Only users with the `admin` role can perform this action.

#### Request Body:
```json
{
  "userId": 1,
  "newRole": "moderator"
}
```

#### Headers:
```plaintext
Authorization: Bearer <admin_access_token>
```

#### Example Response:
- **Success:**
  ```json
  {
    "message": "User role updated successfully",
    "updatedUser": {
      "id": 1,
      "username": "exampleUser",
      "role": "moderator"
    }
  }
  ```
- **Failure (Not Authorized):**
  ```json
  {
    "message": "Access denied. Only admins can perform this action."
  }
  ```

---

## API Testing with Postman

1. **Login**:
   - **Endpoint:** `http://localhost:3000/login`
   - **Method:** `POST`
   - **Body:**
     ```json
     {
       "username": "exampleUser",
       "password": "userPassword"
     }
     ```

2. **Create User**:
   - **Endpoint:** `http://localhost:3000/createUser`
   - **Method:** `POST`
   - **Body:**
     ```json
     {
       "username": "newUser",
       "password": "newUserPassword",
       "role": "user"  
     }
     ```

3. **Update Role**:
   - **Endpoint:** `http://localhost:3000/admin/update-role`
   - **Method:** `PUT`
   - **Body:**
     ```json
     {
       "userId": 1,
       "newRole": "moderator"
     }
     ```
   - **Header:** 
     ```plaintext
     Authorization: Bearer <admin_access_token>
     ```

4. **Admin Route**:
   - **Endpoint:** `http://localhost:3000/admin`
   - **Method:** `GET`
   - **Header:** 
     ```plaintext
     Authorization: Bearer <admin_access_token>
     ```

5. **Logout**:
   - **Endpoint:** `http://localhost:3000/logout`
   - **Method:** `POST`
   - **Header:** 
     ```plaintext
     Authorization: Bearer <access_token>
     ```

---

## Best Practices

1. **Environment Variables**:
   - Never upload `.env` files to version control in production.
   - Use secure methods like deployment secrets for sensitive keys.

2. **Role Management**:
   - Restrict role updates to admins only.
   - Regularly audit user roles and permissions.

3. **ACCESS_SECRET_KEY**:
   - Use a unique and strong key for `ACCESS_SECRET_KEY`.

---

## License
This project is licensed under the MIT License.

--- 

