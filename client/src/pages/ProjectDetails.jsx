import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import projectAPI from "../api/projectAPI";
import issueAPI from "../api/issueAPI";
import useAuthStore from "../store/useAuthStore";

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { token, user } = useAuthStore();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [projectData, issuesData] = await Promise.all([
          projectAPI.getProject(id, token),
          issueAPI.getIssues(token),
        ]);

        setProject(projectData);
        // Filter issues for this project
        setIssues(issuesData.filter((issue) => issue.project?._id === id));
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchProjectData();
    }
  }, [id, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300";
      case "In Progress":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300";
      case "Resolved":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300";
      case "Closed":
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Low":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300";
      case "Medium":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300";
      case "High":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300";
      case "Critical":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300";
    }
  };

  const getIssueStats = () => {
    const stats = {
      total: issues.length,
      open: issues.filter((i) => i.status === "Open").length,
      inProgress: issues.filter((i) => i.status === "In Progress").length,
      resolved: issues.filter((i) => i.status === "Resolved").length,
      closed: issues.filter((i) => i.status === "Closed").length,
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">📁</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Project not found
          </h3>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const stats = getIssueStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {project.name}
              </h1>
              <p className="text-gray-600 text-lg">{project.description}</p>
            </div>
            {(user?.role === "tester" || user?.role === "admin") && (
              <Link
                to="/issues/new"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center space-x-2">
                  <span>➕</span>
                  <span>Create Issue</span>
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Issues
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.open}
                </p>
              </div>
              <div className="text-3xl">🔓</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.inProgress}
                </p>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.resolved + stats.closed}
                </p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
        </div>

        {/* Project Info and Team */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Project Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Project Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-600">{project.description}</p>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created
                  </label>
                  <p className="text-gray-600">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Team Members
              </h3>
              {project.members && project.members.length > 0 ? (
                <div className="space-y-3">
                  {project.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {member.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.username}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No team members assigned</p>
              )}
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Issues</h3>
            {(user?.role === "tester" || user?.role === "admin") && (
              <Link
                to="/issues/new"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                + Create Issue
              </Link>
            )}
          </div>

          {issues.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🐛</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No issues yet
              </h4>
              <p className="text-gray-600 mb-4">
                Create the first issue for this project.
              </p>
              {(user?.role === "tester" || user?.role === "admin") && (
                <Link
                  to="/issues/new"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  <span className="mr-2">➕</span>
                  Create First Issue
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div
                  key={issue._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        to={`/issues/${issue._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {issue.title}
                      </Link>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {issue.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            issue.status
                          )}`}
                        >
                          {issue.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                            issue.severity
                          )}`}
                        >
                          {issue.severity}
                        </span>
                        <span className="text-sm text-gray-500">
                          Priority: {issue.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Reporter: {issue.reporter?.username}</p>
                      {issue.assignee && (
                        <p>Assignee: {issue.assignee.username}</p>
                      )}
                      <p className="mt-1">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
