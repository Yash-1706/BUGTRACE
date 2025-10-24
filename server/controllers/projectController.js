const Project = require('../models/Project');
const User = require('../models/User');
const { logError } = require('../utils/logger');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate('members', 'username email role');
    res.json(projects);
  } catch (error) {
    logError('Failed to fetch projects', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'username email role').populate('issues');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    logError('Failed to fetch project', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  const { name, description, tags, members } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      tags,
      members,
    });

    // Add project to members' assignedProjects
    if (members && members.length > 0) {
      await User.updateMany(
        { _id: { $in: members } },
        { $push: { assignedProjects: project._id } }
      );
    }

    res.status(201).json(project);
  } catch (error) {
    logError('Failed to create project', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const { name, description, tags, members } = req.body;

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (tags) project.tags = Array.isArray(tags) ? tags : tags.split(',').map((tag) => tag.trim()).filter(Boolean);

    if (members) {
      const memberIds = Array.isArray(members) ? members : [];
      const currentMemberIds = project.members.map((member) => member.toString());
      const toAdd = memberIds.filter((id) => !currentMemberIds.includes(id));
      const toRemove = currentMemberIds.filter((id) => !memberIds.includes(id));

      project.members = memberIds;

      if (toAdd.length > 0) {
        await User.updateMany(
          { _id: { $in: toAdd } },
          { $addToSet: { assignedProjects: project._id } }
        );
      }

      if (toRemove.length > 0) {
        await User.updateMany(
          { _id: { $in: toRemove } },
          { $pull: { assignedProjects: project._id } }
        );
      }
    }

    await project.save();

    const populatedProject = await Project.findById(req.params.id).populate('members', 'username email role').populate('issues');

    res.json(populatedProject);
  } catch (error) {
    logError('Failed to update project', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);

    // Remove project from members' assignedProjects
    await User.updateMany(
      { assignedProjects: req.params.id },
      { $pull: { assignedProjects: req.params.id } }
    );

    res.json({ message: 'Project removed' });
  } catch (error) {
    logError('Failed to delete project', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};