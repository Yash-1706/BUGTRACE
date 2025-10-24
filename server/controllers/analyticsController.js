const Issue = require('../models/Issue');
const Project = require('../models/Project');
const User = require('../models/User');
const { logError } = require('../utils/logger');

const TERMINAL_STATUSES = ['Resolved', 'Closed'];

const getStatusBreakdown = async (filters = {}) => {
  const data = await Issue.aggregate([
    { $match: filters },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
  return data.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {});
};

const getSeverityDistribution = async (filters = {}) => {
  const data = await Issue.aggregate([
    { $match: filters },
    {
      $group: {
        _id: '$severity',
        count: { $sum: 1 },
      },
    },
  ]);
  return data.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {});
};

const getAverageResolutionTime = async (filters = {}) => {
  const data = await Issue.aggregate([
    {
      $match: {
        ...filters,
        status: { $in: TERMINAL_STATUSES },
        resolutionTimeHours: { $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        averageResolutionTime: { $avg: '$resolutionTimeHours' },
      },
    },
  ]);

  return data.length ? Number(data[0].averageResolutionTime.toFixed(2)) : 0;
};

const getDeveloperPerformance = async () => {
  const data = await Issue.aggregate([
    {
      $match: {
        assignee: { $ne: null },
        status: { $in: TERMINAL_STATUSES },
        resolutionTimeHours: { $ne: null },
      },
    },
    {
      $group: {
        _id: '$assignee',
        issuesClosed: { $sum: 1 },
        averageResolutionTime: { $avg: '$resolutionTimeHours' },
      },
    },
    { $sort: { issuesClosed: -1 } },
    { $limit: 5 },
  ]);

  const developers = await User.find({ _id: { $in: data.map((item) => item._id) } }).select('username email');
  const developerMap = developers.reduce((acc, dev) => ({ ...acc, [dev._id.toString()]: dev }), {});

  return data.map((item) => ({
    developer: developerMap[item._id.toString()] || null,
    issuesClosed: item.issuesClosed,
    averageResolutionTime: Number(item.averageResolutionTime.toFixed(2)),
  }));
};

const getProjectActivity = async () => {
  const recentIssues = await Issue.find()
    .sort({ updatedAt: -1 })
    .limit(10)
    .select('title status severity priority project updatedAt assignee reporter')
    .populate('project', 'name')
    .populate('assignee', 'username email')
    .populate('reporter', 'username email');

  return recentIssues;
};

const getProjectSummary = async () => {
  const projects = await Project.find()
    .select('name issues members createdAt')
    .populate('members', 'username role');

  return projects.map((project) => ({
    _id: project._id,
    name: project.name,
    memberCount: project.members.length,
    issueCount: project.issues.length,
    createdAt: project.createdAt,
  }));
};

const getDashboardOverview = async (req, res) => {
  try {
    const [statusBreakdown, severityDistribution, averageResolutionTime, developerPerformance, projectActivity, projectSummary] = await Promise.all([
      getStatusBreakdown(),
      getSeverityDistribution(),
      getAverageResolutionTime(),
      getDeveloperPerformance(),
      getProjectActivity(),
      getProjectSummary(),
    ]);

    res.json({
      statusBreakdown,
      severityDistribution,
      averageResolutionTime,
      developerPerformance,
      projectActivity,
      projectSummary,
    });
  } catch (error) {
    logError('Failed to load dashboard overview', error);
    res.status(500).json({ message: 'Failed to load dashboard overview' });
  }
};

module.exports = {
  getDashboardOverview,
};
