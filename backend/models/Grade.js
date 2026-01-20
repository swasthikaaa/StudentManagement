const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    grade: {
        type: String, // A, B, C...
        required: true
    },
    score: {
        type: Number
    },
    semester: {
        type: String,
        default: 'Semester 1'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Grade', gradeSchema);
