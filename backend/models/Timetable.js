const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    day: { type: String, required: true }, // Monday, Tuesday...
    subject: { type: String, required: true },
    startTime: { type: String, required: true }, // 10:00 AM
    endTime: { type: String, required: true },   // 11:30 AM
    location: { type: String },
    semester: { type: String } // e.g., "Semester 1"
});

module.exports = mongoose.model('Timetable', timetableSchema);
