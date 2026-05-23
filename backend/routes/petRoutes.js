const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { awardPoints } = require('../services/gamification'); // Assuming this exists

// Get pet status for a student (creates one if it doesn't exist)
router.get('/:sid', async (req, res) => {
    const { sid } = req.params;
    try {
        let [rows] = await db.execute('SELECT * FROM Student_Pet_V2 WHERE sid = ?', [sid]);
        
        if (rows.length === 0) {
            await db.execute('INSERT INTO Student_Pet_V2 (sid) VALUES (?)', [sid]);
            [rows] = await db.execute('SELECT * FROM Student_Pet_V2 WHERE sid = ?', [sid]);
        }
        res.json({ success: true, pet: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Feed / Play with pet
router.post('/:sid/feed', async (req, res) => {
    const { sid } = req.params;
    try {
        await db.execute('UPDATE Student_Pet_V2 SET health = LEAST(100, health + 10), experience = experience + 5, last_fed_date = CURDATE() WHERE sid = ?', [sid]);
        
        // Level up logic (every 50 exp = 1 level)
        const [rows] = await db.execute('SELECT * FROM Student_Pet_V2 WHERE sid = ?', [sid]);
        const pet = rows[0];
        if (pet.experience >= pet.level * 50) {
            await db.execute('UPDATE Student_Pet_V2 SET level = level + 1 WHERE sid = ?', [sid]);
        }

        res.json({ success: true, message: 'Pet fed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get daily quests
router.get('/quests/:sid', async (req, res) => {
    const { sid } = req.params;
    try {
        const [quests] = await db.execute('SELECT * FROM Daily_Quest_V2');
        const [logs] = await db.execute('SELECT quest_id FROM Student_Quest_Log_V2 WHERE sid = ? AND completed_date = CURDATE()', [sid]);
        
        const completedQuestIds = logs.map(l => l.quest_id);
        
        const mappedQuests = quests.map(q => ({
            ...q,
            completed: completedQuestIds.includes(q.quest_id)
        }));

        res.json({ success: true, quests: mappedQuests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Complete a quest
router.post('/quests/complete', async (req, res) => {
    const { sid, quest_id } = req.body;
    try {
        const [existingLog] = await db.execute('SELECT * FROM Student_Quest_Log_V2 WHERE sid = ? AND quest_id = ? AND completed_date = CURDATE()', [sid, quest_id]);
        
        if (existingLog.length > 0) {
            return res.status(400).json({ success: false, message: 'Quest already completed today' });
        }

        await db.execute('INSERT INTO Student_Quest_Log_V2 (sid, quest_id, completed_date) VALUES (?, ?, CURDATE())', [sid, quest_id]);
        
        // Reward pet experience
        const [quest] = await db.execute('SELECT exp_reward FROM Daily_Quest_V2 WHERE quest_id = ?', [quest_id]);
        const exp = quest[0].exp_reward;

        await db.execute('UPDATE Student_Pet_V2 SET experience = experience + ? WHERE sid = ?', [exp, sid]);
        
        // Also award platform points
        await awardPoints(sid, exp);

        res.json({ success: true, message: 'Quest completed', exp_reward: exp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
