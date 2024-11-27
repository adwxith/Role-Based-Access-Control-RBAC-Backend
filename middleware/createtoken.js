const generate = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

function generatetoken(user) {
  const payload = {
    username: user.username,
    role: user.role,
  };

  // Generate both refresh token and access token
  const tokenObject = {
    refreshtoken: generate.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '3d' }),
    accesstoken: generate.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '1h' }),
  };

  console.log(tokenObject);
  return tokenObject; // Return as an object directly
}

module.exports = generatetoken;
