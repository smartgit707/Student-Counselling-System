const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { awardPoints } = require('../services/gamification');

// Negative keywords for sentiment analysis
const negativeKeywords = ['sad', 'depressed', 'suicide', 'die', 'hopeless', 'worthless', 'hurt', 'pain', 'kill'];

// Add Journal Entry
router.post('/', async (req, res) => {
    const { sid, title, content, is_shared } = req.body;
    try {
        // AI Sentiment Analysis
        const lowerContent = content.toLowerCase();
        const ai_flag = negativeKeywords.some(keyword => lowerContent.includes(keyword));

        await db.execute('INSERT INTO Journal_Entry_V2 (sid, title, content, is_shared, ai_flag) VALUES (?, ?, ?, ?, ?)', [sid, title, content, is_shared, ai_flag]);
        
        await awardPoints(sid, 15); // Award 15 points for journaling

        let aiMessage = '';
        if (ai_flag) {
            // Trigger an automatic SOS Alert
            await db.execute("INSERT INTO Emergency_Alert_V2 (sid, status) VALUES (?, 'Active')", [sid]);
            aiMessage = 'AI Alert: We noticed you might be going through a tough time. An alert has been sent to our counsellors. Please remember you are not alone.';
        }

        res.json({ success: true, message: 'Journal entry saved', ai_flag, aiMessage });
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
