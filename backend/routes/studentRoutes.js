const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { awardPoints } = require('../services/gamification');

// Get student stats
router.get('/stats/:sid', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT streak_count, total_points, last_active_date FROM Student_V2 WHERE sid = ?', [req.params.sid]);
        res.json({ success: true, stats: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

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

// GET mood logs
router.get('/mood/:sid', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Daily_Mood_Tracker_V2 WHERE sid = ? ORDER BY log_date DESC', [req.params.sid]);
        res.json({ success: true, moods: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST new mood log
router.post('/mood', async (req, res) => {
    const { sid, mood_score, notes, log_date } = req.body;
    try {
        await db.execute('INSERT INTO Daily_Mood_Tracker_V2 (sid, mood_score, notes, log_date) VALUES (?, ?, ?, ?)', [sid, mood_score, notes, log_date]);
        
        await awardPoints(sid, 10); // Award 10 points for logging mood
        
        res.json({ success: true, message: 'Mood logged successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET all resources
router.get('/resources', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT r.*, c.name as author_name 
            FROM Mental_Health_Resources_V2 r 
            JOIN Counsellor_V2 c ON r.author_cid = c.cid 
            ORDER BY r.date_posted DESC
        `);
        res.json({ success: true, resources: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET notifications
router.get('/notifications/:sid', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM System_Notifications_V2 WHERE sid = ? ORDER BY created_at DESC', [req.params.sid]);
        res.json({ success: true, notifications: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST feedback
router.post('/feedback', async (req, res) => {
    const { aid, sid, cid, rating, comments } = req.body;
    try {
        await db.execute('INSERT INTO Counsellor_Feedback_V2 (aid, sid, cid, rating, comments) VALUES (?, ?, ?, ?, ?)', [aid, sid, cid, rating, comments]);
        res.json({ success: true, message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
