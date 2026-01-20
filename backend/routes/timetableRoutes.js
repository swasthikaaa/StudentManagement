const express = require('express');
const router = express.Router();
const { getTimetable, addTimetableEntry, updateTimetableEntry, deleteTimetableEntry } = require('../controllers/timetableController');

router.get('/', getTimetable);
router.post('/', addTimetableEntry);
router.put('/:id', updateTimetableEntry);
router.delete('/:id', deleteTimetableEntry);

module.exports = router;
