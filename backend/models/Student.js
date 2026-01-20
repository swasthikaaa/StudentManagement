const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Age is required']
    },
    course: {
        type: String,
        required: [true, 'Course name is required']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Graduated'],
        default: 'Active'
    },
    avatar: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
