const mysql = require('mysql2/promise');

async function updateDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'Counselling_System_V2'
        });

        console.log('Inserting Dummy Data for Quests and CBT...');

        // Daily Quests
        await connection.query(`INSERT IGNORE INTO Daily_Quest_V2 (quest_id, title, description, exp_reward) VALUES 
            (1, 'Mindful Breathing', 'Complete 5 minutes of deep breathing exercises.', 15),
            (2, 'Journaling', 'Write down your thoughts in the journal.', 20),
            (3, 'Reach Out', 'Talk to someone in the community forum.', 10)
        `);

        // CBT Worksheets
        const thoughtRecordSchema = [
            { id: 'q1', label: 'Situation (Who, what, where?)', type: 'text', placeholder: 'e.g. I have a big test tomorrow' },
            { id: 'q2', label: 'Automatic Thoughts', type: 'textarea', placeholder: 'e.g. I am going to fail' },
            { id: 'q3', label: 'Emotions (Rate 1-10)', type: 'text', placeholder: 'e.g. Anxious (8)' },
            { id: 'q4', label: 'Alternative/Rational Thought', type: 'textarea', placeholder: 'e.g. I have studied hard, I will do my best.' }
        ];

        const worryTreeSchema = [
            { id: 'w1', label: 'What are you worrying about?', type: 'textarea', placeholder: 'e.g. Missing my alarm' },
            { id: 'w2', label: 'Is there anything you can do about it right now?', type: 'text', placeholder: 'Yes / No' },
            { id: 'w3', label: 'Action Plan', type: 'textarea', placeholder: 'If yes, what will you do?' }
        ];

        await connection.query(`INSERT IGNORE INTO CBT_Worksheet_Template_V2 (template_id, title, description, questions_json) VALUES 
            (1, 'Thought Record', 'Challenge negative automatic thoughts.', ?),
            (2, 'Worry Tree', 'Decide if a worry is solvable or unsolvable.', ?)
        `, [JSON.stringify(thoughtRecordSchema), JSON.stringify(worryTreeSchema)]);

        console.log('Data inserted successfully!');
        
        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

updateDatabase();

