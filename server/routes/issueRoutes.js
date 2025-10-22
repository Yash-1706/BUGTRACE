const express = require('express');
const router = express.Router();
const {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
} = require('../controllers/issueController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getIssues).post(protect, authorize('tester', 'admin'), createIssue);
router.route('/:id').get(protect, getIssue).put(protect, updateIssue).delete(protect, authorize('admin'), deleteIssue);
router.route('/:id/comments').get(protect, getComments).post(protect, addComment);

module.exports = router;