const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const createToken = require('../middleware/createtoken');
const router = express.Router();

router.post('/', (req, res) => {  // Define the route on the root of '/createUser'
  const { username, password, role } = req.body;

  if (!username || !password ) {
    return res.status(400).json({ status: -1, description: 'Please provide username, password, and role' });
  }

  bcrypt.hash(password, 10, (hashError, hashedPassword) => {
    if (hashError) {
      console.error('Hashing error:', hashError);
      return res.status(500).json({ status: -1, description: `Hashing error\nError message: ${hashError}` });
    }

    db.query('SELECT * FROM users WHERE username = $1', [username], (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Error while processing request', selectErr);
        return res.status(500).json({ status: -1, description: `Database error\nError message: ${selectErr}` });
      }

      if (selectResults.rows.length > 0) {
        return res.status(409).json({ status: -1, description: 'User already exists' });
      }

      db.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', 
        [username, hashedPassword, role], (insertErr) => {
          if (insertErr) {
            console.error('Insert query error:', insertErr);
            return res.status(500).json({ status: -1, description: `Database error\nError message: ${insertErr}` });
          }

          const user = { username, role };
          const { refreshtoken, access_token } = createToken(user);

          res.set({
            Refresh_token: refreshtoken,
            Access_token: access_token,
          });

          return res.status(200).json({ status: 0, description: 'User registered successfully' });
        });
    });
  });
});

module.exports = router;
