const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Login Route for all roles
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        let user;
        if (role === 'student') {
            const [rows] = await db.execute('SELECT * FROM Student_V2 WHERE email = ? AND pass = ?', [email, password]);
            user = rows[0];
        } else if (role === 'counsellor') {
            const [rows] = await db.execute('SELECT * FROM Counsellor_V2 WHERE email = ? AND phone = ?', [email, password]); 
            // The schema has no 'pass' for counsellor, we'll use phone as a temporary password for this demo.
            user = rows[0];
        } else if (role === 'admin') {
            const [rows] = await db.execute('SELECT * FROM Admin_V2 WHERE username = ? AND password = ?', [email, password]);
            user = rows[0];
        }

        if (user) {
            // Include role in response
            res.json({ success: true, user: { ...user, role } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
