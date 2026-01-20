const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // Optional if anonymous, but better with auth
    studentName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'lkr' },
    course: { type: String },
    rollNumber: { type: String },
    semester: { type: String },
    description: { type: String },
    status: { type: String, default: 'pending' }, // pending, succeeded, failed
    stripePaymentIntentId: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
