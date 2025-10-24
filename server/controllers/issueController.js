const Issue = require('../models/Issue');
const Project = require('../models/Project');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { logError } = require('../utils/logger');

const TERMINAL_STATUSES = ['Resolved', 'Closed'];

const buildIssueFilters = (query) => {
  const filters = {};
  if (query.status) {
    filters.status = query.status;
  }
  if (query.severity) {
    filters.severity = query.severity;
  }
  if (query.priority) {
    filters.priority = query.priority;
  }
  if (query.project) {
    filters.project = query.project;
  }
  if (query.assignee) {
    filters.assignee = query.assignee;
  }
  if (query.reporter) {
    filters.reporter = query.reporter;
  }
  return filters;
};

const populateIssue = (query) =>
  query
    .populate('reporter', 'username email role')
    .populate('assignee', 'username email role')
    .populate('project', 'name')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 1 } },
      populate: { path: 'author', select: 'username email role' },
    });

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
const getIssues = async (req, res) => {
  try {
    const filters = buildIssueFilters(req.query);
    const issuesQuery = Issue.find(filters).sort({ createdAt: -1 });
    const issues = await populateIssue(issuesQuery);
    res.json(issues);
  } catch (error) {
    logError('Failed to fetch issues', error);
    res.status(500).json({ message: 'Failed to fetch issues' });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
const getIssue = async (req, res) => {
  try {
    const issue = await populateIssue(Issue.findById(req.params.id));
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    logError('Failed to fetch issue', error);
    res.status(500).json({ message: 'Failed to fetch issue' });
  }
};

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private/Tester
const createIssue = async (req, res) => {
  const { title, description, severity, priority, project, assignee, status } = req.body;

  try {
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(400).json({ message: 'Invalid project selected' });
    }

    if (assignee && !projectExists.members.includes(assignee)) {
      return res.status(400).json({ message: 'Assignee must be part of the project team' });
    }

    const files = req.files || [];
    let attachmentUrls = [];

    if (files.length > 0) {
      attachmentUrls = await Promise.all(
        files.map(async (file) => uploadToCloudinary(file.buffer))
      );
    }

    const payload = {
      title,
      description,
      severity,
      priority,
      reporter: req.user._id,
      assignee: assignee || undefined,
      project,
      attachments: attachmentUrls,
      status: status || undefined,
    };

    if (status && TERMINAL_STATUSES.includes(status)) {
      payload.resolvedAt = new Date();
      payload.resolutionTimeHours = 0;
    }

    const issue = await Issue.create({
      ...payload,
    });

    // Add issue to project
    await Project.findByIdAndUpdate(project, {
      $push: { issues: issue._id },
    });

    const populatedIssue = await populateIssue(Issue.findById(issue._id));

    res.status(201).json(populatedIssue);
  } catch (error) {
    logError('Failed to create issue', error);
    res.status(500).json({ message: 'Failed to create issue' });
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

    const files = req.files || [];
    const updates = {
      title: req.body.title ?? issue.title,
      description: req.body.description ?? issue.description,
      severity: req.body.severity ?? issue.severity,
      priority: req.body.priority ?? issue.priority,
      assignee: req.body.assignee ?? issue.assignee,
      status: req.body.status ?? issue.status,
    };

    if (req.body.attachmentsToRemove) {
      let toRemove = [];
      if (Array.isArray(req.body.attachmentsToRemove)) {
        toRemove = req.body.attachmentsToRemove;
      } else {
        try {
          toRemove = JSON.parse(req.body.attachmentsToRemove || '[]');
        } catch (parseError) {
          return res.status(400).json({ message: 'Invalid attachmentsToRemove payload' });
        }
      }
      issue.attachments = issue.attachments.filter((url) => !toRemove.includes(url));
    }

    if (files.length > 0) {
      const uploads = await Promise.all(
        files.map(async (file) => uploadToCloudinary(file.buffer))
      );
      issue.attachments.push(...uploads);
    }

    if (req.body.status && TERMINAL_STATUSES.includes(req.body.status) && !TERMINAL_STATUSES.includes(issue.status)) {
      const resolvedAt = new Date();
      const ms = resolvedAt.getTime() - issue.createdAt.getTime();
      updates.resolvedAt = resolvedAt;
      updates.resolutionTimeHours = Math.max(0, Math.round(ms / (1000 * 60 * 60)));
    }

    if (req.body.status && !TERMINAL_STATUSES.includes(req.body.status)) {
      updates.resolvedAt = undefined;
      updates.resolutionTimeHours = undefined;
    }

    issue.set({ ...updates, attachments: issue.attachments });
    await issue.save();

    const updatedIssue = await populateIssue(Issue.findById(issue._id));

    res.json(updatedIssue);
  } catch (error) {
    logError('Failed to update issue', error);
    res.status(500).json({ message: 'Failed to update issue' });
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
    logError('Failed to delete issue', error);
    res.status(500).json({ message: 'Failed to delete issue' });
  }
};

module.exports = {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
};