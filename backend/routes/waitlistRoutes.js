const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Join Waitlist
router.post('/join', async (req, res) => {
    const { sid, cid, request_date } = req.body;
    try {
        await db.execute('INSERT INTO Waitlist_V2 (sid, cid, request_date) VALUES (?, ?, ?)', [sid, cid, request_date]);
        res.json({ success: true, message: 'Successfully joined waitlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get Waitlist for Counsellor
router.get('/counsellor/:cid', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT w.*, s.name as student_name 
            FROM Waitlist_V2 w 
            JOIN Student_V2 s ON w.sid = s.sid 
            WHERE w.cid = ? AND w.status = 'Waiting'
            ORDER BY w.timestamp ASC
        `, [req.params.cid]);
        res.json({ success: true, waitlist: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
