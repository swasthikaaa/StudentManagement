const express = require('express');
const router = express.Router();
const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');

const upload = require('../middleware/uploadMiddleware');

router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ url: imageUrl });
});

router.route('/')
    .get(getStudents)
    .post(createStudent);

router.route('/:id')
    .get(getStudentById)
    .put(updateStudent)
    .delete(deleteStudent);

module.exports = router;
