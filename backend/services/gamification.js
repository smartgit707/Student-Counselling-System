const db = require('../config/db');

const awardPoints = async (sid, pointsToAdd) => {
    const today = new Date().toISOString().split('T')[0];
    const [studentRows] = await db.execute('SELECT last_active_date, streak_count, total_points FROM Student_V2 WHERE sid = ?', [sid]);
    const student = studentRows[0];
    if (!student) return;

    let newStreak = student.streak_count || 0;
    let newPoints = (student.total_points || 0) + pointsToAdd;

    if (student.last_active_date !== today) {
        if (student.last_active_date) {
            // Calculate day difference
            const lastDate = new Date(student.last_active_date);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            if (diffDays === 1) {
                newStreak += 1;
            } else {
                newStreak = 1;
            }
        } else {
            newStreak = 1;
        }
        await db.execute('UPDATE Student_V2 SET streak_count = ?, total_points = ?, last_active_date = ? WHERE sid = ?', [newStreak, newPoints, today, sid]);
    } else {
        await db.execute('UPDATE Student_V2 SET total_points = ? WHERE sid = ?', [newPoints, sid]);
    }
};

module.exports = { awardPoints };
