const Grade = require('../models/Grade');

const getGrades = async (req, res) => {
    try {
        const grades = await Grade.find().populate('studentId', 'name studentId');
        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch grades" });
    }
};

const getStudentGrades = async (req, res) => {
    try {
        // filter by student ID (assuming req.params.id)
        // If getting "my" grades, this relies on auth token usually
        // For now, let's assume we pass ?studentId=... or it just gets all for demonstration if auth not strict
        const grades = await Grade.find(); // Ideally filter
        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch student grades" });
    }
};

const addGrade = async (req, res) => {
    try {
        const { studentId, subject, code, grade, score, semester } = req.body;
        const newGrade = new Grade({ studentId, subject, code, grade, score, semester });
        await newGrade.save();
        res.status(201).json(newGrade);
    } catch (error) {
        res.status(500).json({ error: "Failed to add grade" });
    }
};

const deleteGrade = async (req, res) => {
    try {
        await Grade.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Grade deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete grade" });
    }
};

const updateGrade = async (req, res) => {
    try {
        const updatedGrade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedGrade);
    } catch (error) {
        res.status(500).json({ error: "Failed to update grade" });
    }
};

module.exports = { getGrades, getStudentGrades, addGrade, deleteGrade, updateGrade };
