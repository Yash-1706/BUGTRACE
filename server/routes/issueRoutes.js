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
const { upload } = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(protect, getIssues)
  .post(protect, authorize('tester', 'admin'), upload.array('attachments', 5), createIssue);

router
  .route('/:id')
  .get(protect, getIssue)
  .put(protect, upload.array('attachments', 5), updateIssue)
  .delete(protect, authorize('admin'), deleteIssue);

router.route('/:id/comments').get(protect, getComments).post(protect, addComment);

module.exports = router;