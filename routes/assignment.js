// routes/roleAccessTest.js
const express = require('express');
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware'); // Importing middlewares
const router = express.Router();
const { addToBlacklist } = require('../middleware/blacklist')

//it contains all the protected routes and only the users with required permission can acces the path

// Admin route - requires 'dashboard-edit' permission
router.get('/admin', authenticateToken, authorizeRole('dashboard-edit'), async (req, res) => {
    try {
        const currentUserId = req.user.id; // The ID of the logged-in user
        const result = await db.query('SELECT id, username, role FROM users ');

        res.status(200).json({
            message: 'Admin access granted: You have the required permission to view this page.',
            users: result.rows, // List of all users (excluding the current user)
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// PUT: Update a user's role
router.put('/admin/update-role', authenticateToken, authorizeRole('dashboard-edit'), async (req, res) => {
    const { userId, newRole } = req.body; // `userId` is the ID of the user whose role is being updated
    const validRoles = ['admin', 'moderator', 'user']; // Valid roles for validation

    if (!validRoles.includes(newRole)) {
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    try {
        const result = await db.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role', [newRole, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found or role update failed' });
        }

        res.status(200).json({
            message: 'User role updated successfully',
            updatedUser: result.rows[0], // Details of the updated user
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});


// Moderator route - requires 'read' permission
router.get('/moderator', authenticateToken, authorizeRole('write'), (req, res) => {
    res.status(200).json({ message: 'Moderator access granted: You have the required permission to view this page.' });
});

// User route - requires 'read' permission
router.get('/user', authenticateToken, authorizeRole('read'), (req, res) => {
    res.status(200).json({ message: 'User access granted: You have the required permission to view this page.' });
});

// Profile route - accessible for all authenticated users
router.get('/profile', authenticateToken, (req, res) => {
    res.status(200).json({
        message: `Hello ${req.user.username}, your role is ${req.user.role}.`
    });
});

//logout - adding the token to blacklist along 
router.post('/logout', (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'No token provided' });

    // Add the token to the blacklist
    addToBlacklist(token);
    res.status(200).json({ message: 'Logged out successfully' });
});



module.exports = router;
