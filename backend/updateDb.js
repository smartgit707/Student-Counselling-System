const mysql = require('mysql2/promise');

async function updateDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'Counselling_System_V2'
        });

        console.log('Adding gamification columns to Student_V2...');
        await connection.query('ALTER TABLE Student_V2 ADD COLUMN streak_count INT DEFAULT 0;');
        await connection.query('ALTER TABLE Student_V2 ADD COLUMN total_points INT DEFAULT 0;');
        await connection.query('ALTER TABLE Student_V2 ADD COLUMN last_active_date DATE;');
        console.log('Update successful!');
        
        await connection.end();
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Columns already exist, skipping.');
        } else {
            console.error('Error:', error);
        }
    }
}

updateDatabase();
