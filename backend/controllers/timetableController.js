const Timetable = require('../models/Timetable');

const getTimetable = async (req, res) => {
    try {
        const schedule = await Timetable.find();
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch timetable" });
    }
};

const addTimetableEntry = async (req, res) => {
    try {
        const { day, subject, startTime, endTime, location, semester } = req.body;
        const newEntry = new Timetable({ day, subject, startTime, endTime, location, semester });
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: "Failed to add entry" });
    }
};

const deleteTimetableEntry = async (req, res) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete entry" });
    }
};

const updateTimetableEntry = async (req, res) => {
    try {
        const updatedEntry = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedEntry);
    } catch (error) {
        res.status(500).json({ error: "Failed to update entry" });
    }
};

module.exports = { getTimetable, addTimetableEntry, deleteTimetableEntry, updateTimetableEntry };
