const Application = require('../models/Application');
const Student = require('../models/Student');

// @desc    Get all applications (Admin)
// @route   GET /api/v1/applications
exports.getApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('studentId', 'name studentId email semester')
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get student's own applications
// @route   GET /api/v1/applications/my
exports.getMyApplications = async (req, res) => {
    try {
        // Find the student linked to this user
        const student = await Student.findOne({ email: req.user.email });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const applications = await Application.find({ studentId: student._id })
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create new application
// @route   POST /api/v1/applications
exports.createApplication = async (req, res) => {
    try {
        const { targetSemester, type = 'Progression' } = req.body;

        const student = await Student.findOne({ email: req.user.email });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        // Check if a pending application already exists for this semester
        const existing = await Application.findOne({
            studentId: student._id,
            targetSemester,
            status: 'Pending'
        });

        if (existing) {
            return res.status(400).json({ message: 'You already have a pending application for this semester' });
        }

        const application = await Application.create({
            studentId: student._id,
            targetSemester,
            type
        });

        res.status(201).json(application);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update application status (Admin)
// @route   PUT /api/v1/applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;

        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = status;
        if (remarks) application.remarks = remarks;

        await application.save();

        // If approved, automatically update the student's semester to the target semester
        if (status === 'Approved') {
            await Student.findByIdAndUpdate(application.studentId, {
                semester: application.targetSemester
            });
        }

        res.status(200).json(application);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete application
// @route   DELETE /api/v1/applications/:id
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.status(200).json({ message: 'Application deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
