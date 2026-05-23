const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all forum posts
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT f.*, s.name as student_name 
            FROM Forum_Post_V2 f 
            LEFT JOIN Student_V2 s ON f.sid = s.sid 
            ORDER BY f.timestamp DESC
        `);
        res.json({ success: true, posts: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create new post
router.post('/', async (req, res) => {
    const { sid, title, content } = req.body;
    try {
        await db.execute('INSERT INTO Forum_Post_V2 (sid, title, content) VALUES (?, ?, ?)', [sid, title, content]);
        res.json({ success: true, message: 'Post created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get comments for a post
router.get('/:postId/comments', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT c.*, s.name as student_name, co.name as counsellor_name 
            FROM Forum_Comment_V2 c 
            LEFT JOIN Student_V2 s ON c.sid = s.sid 
            LEFT JOIN Counsellor_V2 co ON c.cid = co.cid 
            WHERE c.post_id = ? 
            ORDER BY c.timestamp ASC
        `, [req.params.postId]);
        res.json({ success: true, comments: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add comment
router.post('/:postId/comments', async (req, res) => {
    const { sid, cid, content } = req.body;
    try {
        await db.execute('INSERT INTO Forum_Comment_V2 (post_id, sid, cid, content) VALUES (?, ?, ?, ?)', [req.params.postId, sid || null, cid || null, content]);
        res.json({ success: true, message: 'Comment added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
