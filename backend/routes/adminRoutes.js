const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all students
router.get('/students', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT sid, name, branch, year, email, phone, gender FROM Student_V2');
        res.json({ success: true, students: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all counsellors
router.get('/counsellors', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Counsellor_V2');
        res.json({ success: true, counsellors: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
