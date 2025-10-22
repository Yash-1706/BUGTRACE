const Issue = require('../models/Issue');
const Project = require('../models/Project');

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({})
      .populate('reporter', 'username email')
      .populate('assignee', 'username email')
      .populate('project', 'name')
      .populate('comments');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
const getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reporter', 'username email')
      .populate('assignee', 'username email')
      .populate('project', 'name')
      .populate('comments');
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private/Tester
const createIssue = async (req, res) => {
  const { title, description, severity, priority, project } = req.body;

  try {
    const issue = await Issue.create({
      title,
      description,
      severity,
      priority,
      reporter: req.user._id,
      project,
    });

    // Add issue to project
    await Project.findByIdAndUpdate(project, {
      $push: { issues: issue._id },
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Private
const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Only assignee or admin can update status
    if (req.body.status && req.user.role !== 'admin' && req.user._id.toString() !== issue.assignee?.toString()) {
      return res.status(403).json({ message: 'Not authorized to update status' });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private/Admin
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    await Issue.findByIdAndDelete(req.params.id);

    // Remove issue from project
    await Project.findByIdAndUpdate(issue.project, {
      $pull: { issues: req.params.id },
    });

    res.json({ message: 'Issue removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
};