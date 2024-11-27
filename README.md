
# User Authentication System

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Using .env for Secure Configuration](#using-env-for-secure-configuration)
  - [Without .env for Basic Configuration](#without-env-for-basic-configuration)
  - [Creating Tables with Correct Constraints](#creating-tables-with-correct-constraints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Description

This project is a user authentication system built with Node.js, Express, MySQL, and bcrypt for password hashing. It provides endpoints for user registration and login. You can choose to use a secure configuration using a `.env` file for sensitive data or a basic configuration without it.

## Features

- User registration with password hashing
- User login with secure password verification
- Protection of sensitive data using environment variables
- Database connection with minimal permissions for added security

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- MySQL database installed
- A text editor or IDE of your choice

## Getting Started

### Using .env for Secure Configuration

1. Clone the repository:

   ```bash
   git clone https://github.com/adwxith/expressJs-user-authentication.git
   ```

2. Install the project dependencies:

   ```bash
   cd your-repo
   npm install
   ```

3. Install `nodemon` and `dotenv` as development dependencies:

   ```bash
   npm i nodemon dotenv --save-dev
   ```

4. Create a `.env` file in the project root and add the following configuration:

   ```
   DB_HOST=your-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_DATABASE=your-db-name
   ```

   Replace `your-db-host`, `your-db-user`, `your-db-password`, and `your-db-name` with your actual database information. Ensure this file is not committed to version control for security.

5. To enhance the security of your MySQL database, it's recommended to create a new user with limited privileges. Follow these steps to create the new user:

   1. Open your MySQL database management tool (e.g., phpMyAdmin).

   2. Click on the "Administration" tab on the top left.

   3. Navigate to "Users and Privileges."

   4. Click the "(ADD ACCOUNT)" button on the bottom.

   5. Fill in the user details as follows:
      - **Login Name:** newuser
      - **Authentication Type:** Standard
      - **Limit to Hosts Matching:** localhost
      - **Password:** password1#

   6. Under the "Global Privileges" or "Database-Specific Privileges" section, assign limited privileges to this user, such as:
      - SELECT
      - INSERT
      - DELETE

   7. Ensure you do not assign Database Administrator privileges to the new user.

6. Add `.env` to `index.js`:

   ```javascript
   require("dotenv").config()
   ```

7. Start the application with `node`:

   ```bash
   node index.js
   ```

   This will run your application with the secure configuration and automatic code reloading.

### Without .env for Basic Configuration

1. Clone the repository:

   ```bash
   git clone https://github.com/adwxith/expressJs-user-authentication.git
   ```

2. Install the project dependencies:

   ```bash
   cd your-repo
   npm install
   ```

3. Adjust the server configuration in the `index.js` file. Update the following details directly in the code:

   ```javascript
   const db = mysql.createConnection({
     host: 'your-db-host',
     user: 'your-db-user',
     password: 'your-db-password',
     database: 'your-db-name'
   });
   ```

4. Start the application:

   ```bash
   node index.js
   ```

   This will run your application with the basic configuration.


## Creating Tables with Correct Constraints

To ensure data integrity and security, it's essential to create your database tables with the correct constraints. Follow these steps to create the necessary tables with appropriate constraints:

1. Open your MySQL database management tool (e.g., phpMyAdmin).

2. Create a new database for your application if you haven't already. You can use a command like this in your MySQL client to create a new database:

   ```sql
   CREATE DATABASE your-db-name;
   ```

   Replace `your-db-name` with your desired database name.

3. Once you have your database, create the necessary tables. In your Node.js application code, you can execute SQL queries to create tables. For example, you can create a `users` table for your authentication system like this:

   ```sql
   CREATE TABLE auth (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) NOT NULL,
     password VARCHAR(255) NOT NULL
   );
   ```

   This SQL query creates a `auth` table with constraints such as a primary key, not-null fields, and timestamps for data integrity and security.


## Usage

1. The server will be running on port 3000 by default. You can change this in the code if needed.

2. You can now use the `/createUser` and `/login` endpoints for user registration and login.

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the project.

2. Create your feature branch: `git checkout -b feature-name`.

3. Commit your changes: `git commit -m 'Add some feature'.

4. Push to the branch: `git push origin feature-name'.

5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



