const Comment = require('../models/Comment');
const Issue = require('../models/Issue');
const { logError } = require('../utils/logger');

// @desc    Get comments for an issue
// @route   GET /api/issues/:id/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ issue: req.params.id }).populate('author', 'username email');
    res.json(comments);
  } catch (error) {
    logError('Failed to fetch comments', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// @desc    Add comment to issue
// @route   POST /api/issues/:id/comments
// @access  Private
const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const comment = await Comment.create({
      issue: req.params.id,
      author: req.user._id,
      text,
    });

    // Add comment to issue
    await Issue.findByIdAndUpdate(req.params.id, {
      $push: { comments: comment._id },
    });

    // Populate author before returning
    const populatedComment = await Comment.findById(comment._id).populate('author', 'username email');

    res.status(201).json(populatedComment);
  } catch (error) {
    logError('Failed to add comment', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

module.exports = {
  getComments,
  addComment,
};