const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const createToken = require('../middleware/createtoken');
const router = express.Router();
const { isBlacklisted,removeFromBlacklist } = require('../middleware/blacklist')

router.post('/', (req, res) => {  // Define the route on the root of '/login'
  const { username, password } = req.body;

  db.query('SELECT username, id, password, role FROM users WHERE username = $1', [username], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ status: -1, description: `Database error\nError message: ${err}` });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ status: -1, description: `User not found` });
    }

    const hashedPassword = result.rows[0].password;
    bcrypt.compare(password, hashedPassword, (err, passwordMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ status: -1, description: 'Internal server error' });
      }

      if (!passwordMatch) {
        return res.status(401).json({ status: -1, description: 'Invalid password' });
      }
      const oldToken = req.header('Authorization')?.split(' ')[1];
      if (oldToken && isBlacklisted(oldToken)) {
          removeFromBlacklist(oldToken); // Remove the old token from the blacklist
          console.log(`Old token removed from blacklist for user: ${username}`);
      }

      // Create the token payload with username and role
      const user = { username: result.rows[0].username, role: result.rows[0].role };
      const tokenObject = createToken(user); // Directly return the object (not stringified)

      // Send back tokens in response body and headers
      res.set({
        'Refresh_token': tokenObject.refreshtoken,
        'Access_token': tokenObject.accesstoken,
      });

      return res.status(200).json({
        status: 0,
        description: 'Successful login',
        tokens: tokenObject, // Include tokens in response body
      });
    });
  });
});

module.exports = router;
