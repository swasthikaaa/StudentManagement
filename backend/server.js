const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// ... socket setup ...
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://student-management-swasthikaaa.vercel.app"], // Add your final vercel URL here
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Make io accessible in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/student_management";

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('Student Management System API is running...');
});

// Import Routes
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const timetableRoutes = require('./routes/timetableRoutes');

app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/grades', gradeRoutes);
app.use('/api/v1/timetable', timetableRoutes);
app.use('/api/v1/applications', require('./routes/applicationRoutes'));


// 404 Handler
app.use((req, res) => {
    console.log(`[404] ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
