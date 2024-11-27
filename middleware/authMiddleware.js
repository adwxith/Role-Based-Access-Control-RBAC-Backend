const jwt = require('jsonwebtoken');
const roles = require('../roles');
require('dotenv').config();

const { isBlacklisted } = require('./blacklist');

// Authentication middleware to verify the JWT token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    // Check if the token is blacklisted
    if (isBlacklisted(token)) {
        return res.status(403).json({ message: 'Token has been invalidated' });
    }

    try {
        const verified = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};

// Authorization middleware to check if the user has the required role/permission
const authorizeRole = (requiredPermission) => {
    return (req, res, next) => {
        const userRole = req.user?.role;  // Ensure req.user exists, coming from the authenticateToken middleware

        if (!userRole) {
            return res.status(401).json({ message: 'No user role found, please log in' });
        }

        // Check if the role has the required permission from the roles object
        if (!roles[userRole] || !roles[userRole].includes(requiredPermission)) {
            return res.status(403).json({ message: 'Access Forbidden: You do not have the required permissions' });
        }

        next();  // Proceed to the next middleware or route handler
    };
};

module.exports = { authenticateToken, authorizeRole };
