const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = "mongodb+srv://Swasthika23:IaCQgg9HG7ikEF40@purelyhomecluster.qllxyb5.mongodb.net/student_management_db?appName=PurelyHomeCluster";

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB (student_management_db)'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('Student Management System API is running...');
});

// Import Routes
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/auth', authRoutes);


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
