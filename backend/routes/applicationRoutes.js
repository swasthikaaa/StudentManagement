const express = require('express');
const router = express.Router();
const {
    getApplications,
    getMyApplications,
    createApplication,
    updateApplicationStatus,
    deleteApplication
} = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createApplication);
router.get('/my', getMyApplications);

router.get('/', admin, getApplications);
router.put('/:id/status', admin, updateApplicationStatus);
router.delete('/:id', admin, deleteApplication);

module.exports = router;
