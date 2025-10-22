import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import issueAPI from "../api/issueAPI";
import projectAPI from "../api/projectAPI";
import authAPI from "../api/authAPI";
import useAuthStore from "../store/useAuthStore";

const CreateIssue = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Open",
    severity: "Medium",
    priority: "P2",
    project: "",
    assignee: "",
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, usersData] = await Promise.all([
          projectAPI.getProjects(token),
          authAPI.getUsers(token),
        ]);
        setProjects(projectsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Issue title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Issue description is required";
    }
    if (!formData.project) {
      newErrors.project = "Project selection is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const issueData = {
        ...formData,
        reporter: user._id,
      };

      await issueAPI.createIssue(issueData, token);
      navigate("/issues");
    } catch (error) {
      console.error("Failed to create issue:", error);
      setErrors({ submit: "Failed to create issue. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Low":
        return "bg-green-100 text-green-800 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Critical":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "P1":
        return "🚨";
      case "P2":
        return "⚡";
      case "P3":
        return "📋";
      default:
        return "📋";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Issue
          </h1>
          <p className="text-gray-600 text-lg">
            Report a bug or create a new task for your team
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Brief description of the issue"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Detailed description of the issue, steps to reproduce, expected vs actual behavior"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Project Selection */}
            <div>
              <label
                htmlFor="project"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Project *
              </label>
              <select
                id="project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.project ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.project && (
                <p className="mt-1 text-sm text-red-600">{errors.project}</p>
              )}
            </div>

            {/* Severity and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Severity */}
              <div>
                <label
                  htmlFor="severity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Severity
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                      formData.severity
                    )}`}
                  >
                    {formData.severity}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="P1">P1 - Critical</option>
                  <option value="P2">P2 - High</option>
                  <option value="P3">P3 - Normal</option>
                </select>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs font-medium border border-blue-300">
                    <span className="mr-1">
                      {getPriorityIcon(formData.priority)}
                    </span>
                    {formData.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label
                htmlFor="assignee"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Assign To (Optional)
              </label>
              <select
                id="assignee"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Unassigned</option>
                {users
                  .filter((u) => u.role === "developer")
                  .map((developer) => (
                    <option key={developer._id} value={developer._id}>
                      {developer.username} ({developer.email})
                    </option>
                  ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Only developers can be assigned to issues
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/issues")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </span>
                ) : (
                  "Create Issue"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIssue;
