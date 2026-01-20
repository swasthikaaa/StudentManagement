const Stripe = require('stripe');
const Payment = require('../models/Payment');
// Use environment variable, fallback only for safety/testing
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51SfHuXJd4dNkBkph18DQvsdklM7iI7rGPPscSDdgwiTlj0cnqzkNiR2KOX1AslgzDhUn4ZIIiUFa1oYXUe2qWEnL006M6CWFD4');

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'lkr' } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Amount in cents
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
};

const recordPayment = async (req, res) => {
    try {
        const { amount, description, stripePaymentIntentId, course, rollNumber, semester } = req.body;

        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const newPayment = new Payment({
            studentId: req.user.studentProfile || req.user._id, // Prefer Student Profile ID, fallback to User ID
            studentName: req.user.name,
            amount,
            description,
            course,
            rollNumber,
            semester,
            stripePaymentIntentId,
            status: 'succeeded'
        });

        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        console.error("Error recording payment:", error);
        res.status(500).json({ error: "Failed to record payment" });
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        if (!req.user) {
            console.warn("Unauthorized attempt to fetch history");
            return res.status(401).json({ error: "User not authenticated" });
        }

        const studentId = req.user.studentProfile || req.user._id;
        console.log(`Fetching history for User: ${req.user.name}, Linked Student ID: ${req.user.studentProfile}, Fallback ID: ${req.user._id}`);

        const payments = await Payment.find({
            $or: [
                { studentId: studentId },
                { studentId: req.user._id }
            ]
        }).sort({ date: -1 });

        res.status(200).json(payments);
    } catch (error) {
        console.error("Fetch History Error:", error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ date: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch all payments" });
    }
};

module.exports = {
    createPaymentIntent,
    recordPayment,
    getPaymentHistory,
    getAllPayments
};
