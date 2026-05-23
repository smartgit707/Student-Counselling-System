const cron = require('node-cron');
const db = require('../config/db');

// Run every day at 8 AM
cron.schedule('0 8 * * *', async () => {
    console.log('Running daily cron job for appointment reminders...');
    try {
        const [appointments] = await db.execute(`
            SELECT a.aid, a.adate, a.atime, s.name, s.email 
            FROM Appointment_V2 a 
            JOIN Student_V2 s ON a.sid = s.sid 
            WHERE a.status = 'Scheduled' AND a.adate = CURDATE() + INTERVAL 1 DAY
        `);

        if (appointments.length > 0) {
            console.log(`Found ${appointments.length} appointments for tomorrow. Sending mock emails...`);
            appointments.forEach(apt => {
                console.log(`[MOCK EMAIL] To: ${apt.email} | Subject: Appointment Reminder | Body: Hi ${apt.name}, you have a session tomorrow at ${apt.atime}.`);
            });
        } else {
            console.log('No appointments scheduled for tomorrow.');
        }
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

console.log('Cron jobs service initialized.');
