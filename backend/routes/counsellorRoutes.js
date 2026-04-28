const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get counsellor's appointments
router.get('/appointments/:cid', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT a.*, s.name as student_name, s.branch, s.year 
            FROM Appointment_V2 a 
            JOIN Student_V2 s ON a.sid = s.sid 
            WHERE a.cid = ? ORDER BY a.adate DESC, a.atime DESC
        `, [req.params.cid]);
        res.json({ success: true, appointments: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update appointment status
router.put('/appointments/:aid/status', async (req, res) => {
    const { status } = req.body;
    try {
        await db.execute('UPDATE Appointment_V2 SET status = ? WHERE aid = ?', [status, req.params.aid]);
        res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add session record
router.post('/sessions', async (req, res) => {
    const { aid, notes, next_meeting } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO Session_Record_V2 (aid, notes, next_meeting) VALUES (?, ?, ?)',
            [aid, notes, next_meeting]
        );
        res.json({ success: true, message: 'Session record added', rid: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
