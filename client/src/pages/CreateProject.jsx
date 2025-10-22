import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import projectAPI from "../api/projectAPI";
import authAPI from "../api/authAPI";
import useAuthStore from "../store/useAuthStore";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
    members: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await authAPI.getUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    if (token) {
      fetchUsers();
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

  const handleMemberChange = (userId) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter((id) => id !== userId)
        : [...prev.members, userId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    }
    if (formData.members.length === 0) {
      newErrors.members = "At least one team member is required";
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
      const projectData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      await projectAPI.createProject(projectData, token);
      navigate("/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
      setErrors({ submit: "Failed to create project. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-teal-400/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4 animate-fade-in">
              Create New Project
            </h1>
            <div className="w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full animate-scale-in"></div>
          </div>
          <p className="text-gray-600 text-xl mt-6 animate-fade-in delay-300">
            Set up a new project and assign team members
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 animate-fade-in delay-500">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Name */}
            <div className="relative group">
              <label
                htmlFor="name"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  formData.name
                    ? "top-2 text-xs text-emerald-600 font-medium"
                    : "top-1/2 -translate-y-1/2 text-gray-500"
                } group-focus-within:top-2 group-focus-within:text-xs group-focus-within:text-emerald-600 group-focus-within:font-medium`}
              >
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 pt-6 pb-3 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm ${
                  errors.name
                    ? "border-red-400 bg-red-50/50"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
                placeholder=""
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Description */}
            <div className="relative group">
              <label
                htmlFor="description"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  formData.description
                    ? "top-2 text-xs text-emerald-600 font-medium"
                    : "top-6 text-gray-500"
                } group-focus-within:top-2 group-focus-within:text-xs group-focus-within:text-emerald-600 group-focus-within:font-medium`}
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 pt-8 pb-3 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm resize-none ${
                  errors.description
                    ? "border-red-400 bg-red-50/50"
                    : "border-gray-200 hover:border-emerald-300"
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

            {/* Tags */}
            <div className="relative group">
              <label
                htmlFor="tags"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  formData.tags
                    ? "top-2 text-xs text-emerald-600 font-medium"
                    : "top-1/2 -translate-y-1/2 text-gray-500"
                } group-focus-within:top-2 group-focus-within:text-xs group-focus-within:text-emerald-600 group-focus-within:font-medium`}
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 pt-6 pb-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm hover:border-emerald-300"
                placeholder=""
              />
              <p className="mt-2 text-sm text-gray-500 flex items-center space-x-1">
                <span>🏷️</span>
                <span>Separate tags with commas (optional)</span>
              </p>
            </div>

            {/* Team Members */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <span>👥</span>
                <span>Team Members *</span>
              </label>
              <div className="space-y-4 max-h-80 overflow-y-auto border-2 border-gray-200 rounded-2xl p-6 bg-gray-50/50 backdrop-blur-sm">
                {users.map((user, index) => (
                  <label
                    key={user._id}
                    className={`flex items-center space-x-4 cursor-pointer p-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:bg-white/80 animate-slide-up ${
                      formData.members.includes(user._id)
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-md"
                        : "hover:bg-white/60"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.members.includes(user._id)}
                        onChange={() => handleMemberChange(user._id)}
                        className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded-lg opacity-0 absolute"
                      />
                      <div
                        className={`h-5 w-5 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          formData.members.includes(user._id)
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-gray-300 hover:border-emerald-400"
                        }`}
                      >
                        {formData.members.includes(user._id) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900 text-lg">
                          {user.username}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium shadow-sm ${
                            user.role === "admin"
                              ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300"
                              : user.role === "developer"
                              ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
                              : "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.members && (
                <p className="mt-3 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.members}</span>
                </p>
              )}
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
                onClick={() => navigate("/projects")}
                className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-3">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Project...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Create Project</span>
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

export default CreateProject;
