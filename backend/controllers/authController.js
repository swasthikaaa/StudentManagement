const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });
};

// @desc    Register new student
// @route   POST /api/v1/auth/register
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'student'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error("Register Error:", err);
        res.status(500).json({ message: 'Server error processing registration' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check for Admin Hardcoded Credentials
        if (email === 'admin@school.com' && password === 'admin123') {
            return res.json({
                _id: 'admin_id_fixed',
                name: 'Administrator',
                email: 'admin@school.com',
                role: 'admin',
                token: generateToken('admin_id_fixed', 'admin')
            });
        }

        // 2. Check for Student in Database
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/profile
exports.getProfile = async (req, res) => {
    // This would need middleware to decode token first.
    // For now, simple return of user data based on ID in request (assumed set by middleware)
    try {
        if (req.user.role === 'admin') {
            return res.json({
                _id: 'admin_id_fixed',
                name: 'Administrator',
                email: 'admin@school.com',
                role: 'admin'
            });
        }
        const user = await User.findById(req.user.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
