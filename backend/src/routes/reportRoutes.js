const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  addReportUpdate,
  voteReport,
  addComment,
  getReportStats
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const { reportValidation, validate } = require('../middleware/validator');

// Public stats for admins/moderators
router.get('/stats/overview', protect, authorize('admin', 'moderator'), getReportStats);

// Report CRUD
router.post('/', protect, reportValidation, validate, createReport);
router.get('/', protect, getReports);
router.get('/:id', protect, getReport);
router.put('/:id', protect, updateReport);
router.delete('/:id', protect, deleteReport);

// Report interactions
router.post('/:id/update', protect, authorize('admin', 'moderator'), addReportUpdate);
router.post('/:id/vote', protect, voteReport);
router.post('/:id/comments', protect, addComment);

module.exports = router;
