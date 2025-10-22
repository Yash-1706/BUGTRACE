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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-pink-400/15 to-purple-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-fade-in">
              Create New Issue
            </h1>
            <div className="w-full h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-full animate-scale-in"></div>
          </div>
          <p className="text-gray-600 text-xl mt-6 animate-fade-in delay-300">
            Report a bug or create a new task for your team
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 animate-fade-in delay-500">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="relative group">
              <label
                htmlFor="title"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  formData.title
                    ? "top-2 text-xs text-rose-600 font-medium"
                    : "top-1/2 -translate-y-1/2 text-gray-500"
                } group-focus-within:top-2 group-focus-within:text-xs group-focus-within:text-rose-600 group-focus-within:font-medium`}
              >
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 pt-6 pb-3 border-2 rounded-2xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm ${
                  errors.title
                    ? "border-red-400 bg-red-50/50"
                    : "border-gray-200 hover:border-rose-300"
                }`}
                placeholder=""
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            {/* Description */}
            <div className="relative group">
              <label
                htmlFor="description"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  formData.description
                    ? "top-2 text-xs text-rose-600 font-medium"
                    : "top-6 text-gray-500"
                } group-focus-within:top-2 group-focus-within:text-xs group-focus-within:text-rose-600 group-focus-within:font-medium`}
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 pt-8 pb-3 border-2 rounded-2xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm resize-none ${
                  errors.description
                    ? "border-red-400 bg-red-50/50"
                    : "border-gray-200 hover:border-rose-300"
                }`}
                placeholder=""
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* Project Selection */}
            <div className="relative group">
              <label
                htmlFor="project"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  formData.project
                    ? "top-2 text-xs text-rose-600 font-medium"
                    : "top-1/2 -translate-y-1/2 text-gray-500"
                } group-focus-within:top-2 group-focus-within:text-xs group-focus-within:text-rose-600 group-focus-within:font-medium`}
              >
                Project *
              </label>
              <select
                id="project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                className={`w-full px-4 pt-6 pb-3 border-2 rounded-2xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm appearance-none ${
                  errors.project
                    ? "border-red-400 bg-red-50/50"
                    : "border-gray-200 hover:border-rose-300"
                }`}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </div>
              {errors.project && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.project}</span>
                </p>
              )}
            </div>

            {/* Severity and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Severity */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>Severity</span>
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm hover:border-rose-300 appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 shadow-lg animate-pulse ${
                      formData.severity === "Low"
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300"
                        : formData.severity === "Medium"
                        ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300"
                        : formData.severity === "High"
                        ? "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-300"
                        : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300"
                    }`}
                  >
                    <span className="mr-2">
                      {formData.severity === "Low"
                        ? "🟢"
                        : formData.severity === "Medium"
                        ? "🟡"
                        : formData.severity === "High"
                        ? "🟠"
                        : "🔴"}
                    </span>
                    {formData.severity}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Priority</span>
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm hover:border-rose-300 appearance-none"
                >
                  <option value="P1">P1 - Critical</option>
                  <option value="P2">P2 - High</option>
                  <option value="P3">P3 - Normal</option>
                </select>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-blue-800 rounded-full text-sm font-semibold border-2 border-blue-300 shadow-lg">
                    <span className="mr-2 text-lg">
                      {formData.priority === "P1"
                        ? "🚨"
                        : formData.priority === "P2"
                        ? "⚡"
                        : "📋"}
                    </span>
                    {formData.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <span>👤</span>
                <span>Assign To (Optional)</span>
              </label>
              <div className="relative group">
                <select
                  id="assignee"
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm hover:border-rose-300 appearance-none"
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
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  ▼
                </div>
              </div>
              <p className="text-sm text-gray-500 flex items-center space-x-1">
                <span>💡</span>
                <span>Only developers can be assigned to issues</span>
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 animate-pulse">
                <p className="text-red-700 font-medium flex items-center space-x-2">
                  <span>🚫</span>
                  <span>{errors.submit}</span>
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-6 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/issues")}
                className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white rounded-2xl hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-3">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Issue...</span>
                    </>
                  ) : (
                    <>
                      <span>🐛</span>
                      <span>Create Issue</span>
                      <span>🚀</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIssue;
