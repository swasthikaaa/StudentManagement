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
    studentId: {
        type: String,
        unique: true
    },
    semester: {
        type: String,
        default: 'Semester 1'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Graduated'],
        default: 'Active'
    },
    avatar: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    guardian: {
        name: String,
        phone: String,
        relation: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
