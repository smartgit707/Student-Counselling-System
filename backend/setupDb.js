const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    try {
        console.log('Connecting to MySQL server...');
        // First connect without specifying database to create it if it doesn't exist
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            multipleStatements: true // Important for running a full SQL file
        });

        const sqlFilePath = path.join(__dirname, '..', 'database.sql');
        const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

        console.log('Executing database.sql...');
        await connection.query(sqlScript);

        console.log('Database and tables created successfully, and data inserted!');
        await connection.end();
    } catch (error) {
        console.error('Error setting up database:', error);
    }
}

setupDatabase();
