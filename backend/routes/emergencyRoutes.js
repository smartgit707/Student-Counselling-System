const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Trigger SOS Alert
router.post('/sos', async (req, res) => {
    const { sid } = req.body;
    try {
        await db.execute('INSERT INTO Emergency_Alert_V2 (sid) VALUES (?)', [sid]);
        res.json({ success: true, message: 'SOS Alert Triggered! Help is on the way.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get Active SOS Alerts (for Counsellor/Admin)
router.get('/alerts', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT e.*, s.name as student_name, s.phone, s.branch 
            FROM Emergency_Alert_V2 e 
            JOIN Student_V2 s ON e.sid = s.sid 
            ORDER BY e.timestamp DESC
        `);
        res.json({ success: true, alerts: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Resolve SOS Alert
router.put('/resolve/:id', async (req, res) => {
    const { cid } = req.body;
    try {
        await db.execute('UPDATE Emergency_Alert_V2 SET status = ?, resolved_by = ? WHERE alert_id = ?', ['Resolved', cid, req.params.id]);
        res.json({ success: true, message: 'Alert resolved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
