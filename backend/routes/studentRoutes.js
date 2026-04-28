const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all counsellors
router.get('/counsellors', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT cid, name, spec, experience, available_from, available_to FROM Counsellor_V2');
        res.json({ success: true, counsellors: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Book appointment
router.post('/appointments', async (req, res) => {
    const { sid, cid, adate, atime, mode, remarks } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO Appointment_V2 (sid, cid, adate, atime, mode, status, remarks) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [sid, cid, adate, atime, mode, 'Scheduled', remarks]
        );
        res.json({ success: true, message: 'Appointment booked successfully', aid: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get student's appointments
router.get('/appointments/:sid', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT a.*, c.name as counsellor_name 
            FROM Appointment_V2 a 
            JOIN Counsellor_V2 c ON a.cid = c.cid 
            WHERE a.sid = ? ORDER BY a.adate DESC, a.atime DESC
        `, [req.params.sid]);
        res.json({ success: true, appointments: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get student's assessments
router.get('/assessments/:sid', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Assessment_V2 WHERE sid = ? ORDER BY test_date DESC', [req.params.sid]);
        res.json({ success: true, assessments: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
