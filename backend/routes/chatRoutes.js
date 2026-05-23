const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get messages between a student and a counsellor
router.get('/:sid/:cid', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT * FROM Message_V2 
            WHERE (sender_type = 'student' AND sender_id = ? AND receiver_id = ?)
               OR (sender_type = 'counsellor' AND sender_id = ? AND receiver_id = ?)
            ORDER BY timestamp ASC
        `, [req.params.sid, req.params.cid, req.params.cid, req.params.sid]);
        res.json({ success: true, messages: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Save a new message
router.post('/', async (req, res) => {
    const { sender_type, sender_id, receiver_id, content } = req.body;
    try {
        await db.execute(
            'INSERT INTO Message_V2 (sender_type, sender_id, receiver_id, content) VALUES (?, ?, ?, ?)',
            [sender_type, sender_id, receiver_id, content]
        );
        res.json({ success: true, message: 'Message saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
