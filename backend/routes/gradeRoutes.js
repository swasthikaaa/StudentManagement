const express = require('express');
const router = express.Router();
const { getGrades, getStudentGrades, addGrade, updateGrade, deleteGrade } = require('../controllers/gradeController');

router.get('/', getGrades);
router.get('/student/:id', getStudentGrades); // Specific student
router.post('/', addGrade);
router.put('/:id', updateGrade);
router.delete('/:id', deleteGrade);

module.exports = router;
