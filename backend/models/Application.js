const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    type: {
        type: String,
        default: 'Progression'
    },
    targetSemester: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
