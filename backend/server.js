const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const counsellorRoutes = require('./routes/counsellorRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/counsellor', counsellorRoutes);
app.use('/api/admin', adminRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Counselling System API is running...');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
