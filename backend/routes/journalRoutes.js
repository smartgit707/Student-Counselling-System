const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add Journal Entry
router.post('/', async (req, res) => {
    const { sid, title, content, is_shared } = req.body;
    try {
        await db.execute('INSERT INTO Journal_Entry_V2 (sid, title, content, is_shared) VALUES (?, ?, ?, ?)', [sid, title, content, is_shared]);
        res.json({ success: true, message: 'Journal entry saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get Student's Journal Entries
router.get('/:sid', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Journal_Entry_V2 WHERE sid = ? ORDER BY timestamp DESC', [req.params.sid]);
        res.json({ success: true, journals: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get Shared Journals for Counsellor (of specific student)
router.get('/shared/:sid', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Journal_Entry_V2 WHERE sid = ? AND is_shared = TRUE ORDER BY timestamp DESC', [req.params.sid]);
        res.json({ success: true, journals: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
