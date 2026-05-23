const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get overall analytics
router.get('/overview', async (req, res) => {
    try {
        const [[{ total_students }]] = await db.execute('SELECT COUNT(*) as total_students FROM Student_V2');
        const [[{ total_appointments }]] = await db.execute('SELECT COUNT(*) as total_appointments FROM Appointment_V2');
        const [[{ total_alerts }]] = await db.execute("SELECT COUNT(*) as total_alerts FROM Emergency_Alert_V2 WHERE status = 'Active'");
        
        const [moodTrends] = await db.execute('SELECT log_date, AVG(mood_score) as avg_mood FROM Daily_Mood_Tracker_V2 GROUP BY log_date ORDER BY log_date DESC LIMIT 7');

        res.json({
            success: true,
            analytics: {
                total_students,
                total_appointments,
                active_sos_alerts: total_alerts,
                mood_trends: moodTrends.reverse()
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
