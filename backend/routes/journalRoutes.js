const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { awardPoints } = require('../services/gamification');
const multer = require('multer');
const path = require('path');

// Configure multer for audio uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, 'audio-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Negative keywords for sentiment analysis
const negativeKeywords = ['sad', 'depressed', 'suicide', 'die', 'hopeless', 'worthless', 'hurt', 'pain', 'kill'];

// Add Journal Entry (with optional audio upload)
router.post('/', upload.single('audio_file'), async (req, res) => {
    // When using multer, form fields are in req.body, file is in req.file
    const { sid, title, content, is_shared } = req.body;
    let audio_file_path = null;
    let detected_emotion = null;
    let ai_flag = false;

    try {
        if (req.file) {
            audio_file_path = `/uploads/${req.file.filename}`;
            // Mock AI Emotion Detection based on audio tone
            const emotions = ['neutral', 'calm', 'anxious', 'sad', 'agitated'];
            detected_emotion = emotions[Math.floor(Math.random() * emotions.length)];
            
            if (['anxious', 'sad', 'agitated'].includes(detected_emotion)) {
                ai_flag = true;
            }
        }

        // Text Sentiment Analysis
        if (content) {
            const lowerContent = content.toLowerCase();
            const text_ai_flag = negativeKeywords.some(keyword => lowerContent.includes(keyword));
            ai_flag = ai_flag || text_ai_flag;
            if (!detected_emotion && text_ai_flag) {
                detected_emotion = 'distressed (from text)';
            }
        }

        const query = 'INSERT INTO Journal_Entry_V2 (sid, title, content, is_shared, ai_flag, audio_file_path, detected_emotion) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const params = [sid, title || 'Voice Note', content || '', is_shared === 'true' || is_shared === true, ai_flag, audio_file_path, detected_emotion];
        
        await db.execute(query, params);
        
        await awardPoints(sid, 15); // Award 15 points for journaling

        let aiMessage = '';
        if (ai_flag) {
            // Trigger an automatic SOS Alert
            await db.execute("INSERT INTO Emergency_Alert_V2 (sid, status) VALUES (?, 'Active')", [sid]);
            aiMessage = 'AI Alert: We noticed you might be going through a tough time. An alert has been sent to our counsellors. Please remember you are not alone.';
        }

        res.json({ success: true, message: 'Journal entry saved', ai_flag, aiMessage, detected_emotion });
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
