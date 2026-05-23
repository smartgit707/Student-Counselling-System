const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all CBT templates
router.get('/templates', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM CBT_Worksheet_Template_V2');
        res.json({ success: true, templates: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Submit a completed CBT worksheet
router.post('/submit', async (req, res) => {
    const { sid, template_id, responses_json } = req.body;
    try {
        await db.execute('INSERT INTO Student_CBT_Response_V2 (sid, template_id, responses_json) VALUES (?, ?, ?)', [sid, template_id, JSON.stringify(responses_json)]);
        res.json({ success: true, message: 'Worksheet submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get a student's completed worksheets (for student or counsellor)
router.get('/student/:sid', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT r.*, t.title 
            FROM Student_CBT_Response_V2 r
            JOIN CBT_Worksheet_Template_V2 t ON r.template_id = t.template_id
            WHERE r.sid = ?
            ORDER BY r.submitted_at DESC
        `, [req.params.sid]);
        res.json({ success: true, responses: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
