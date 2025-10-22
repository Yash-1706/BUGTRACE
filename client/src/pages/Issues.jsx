import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import issueAPI from "../api/issueAPI";
import useAuthStore from "../store/useAuthStore";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuthStore();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issueAPI.getIssues(token);
        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchIssues();
    }
  }, [token]);

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

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "Low":
        return "⬇️";
      case "Medium":
        return "➡️";
      case "High":
        return "⬆️";
      case "Critical":
        return "🚨";
      default:
        return "➡️";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return "🔓";
      case "In Progress":
        return "⚡";
      case "Resolved":
        return "✅";
      case "Closed":
        return "🔒";
      default:
        return "❓";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Issues</h1>
            <p className="text-gray-600 text-lg">
              Track and manage bugs, features, and tasks
            </p>
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

        {/* Issues Grid */}
        {issues.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🐛</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No issues yet</h3>
            <p className="text-gray-600 mb-6">Create your first issue to get started!</p>
            {(user?.role === "tester" || user?.role === "admin") && (
              <Link
                to="/issues/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">➕</span>
                Create Your First Issue
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {issues.map((issue, index) => (
              <div
                key={issue._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Header with gradient */}
                <div className={`h-2 bg-gradient-to-r ${getStatusColor(issue.status).includes('yellow') ? 'from-yellow-500 to-yellow-600' : getStatusColor(issue.status).includes('orange') ? 'from-orange-500 to-orange-600' : getStatusColor(issue.status).includes('green') ? 'from-green-500 to-green-600' : 'from-gray-500 to-gray-600'}`}></div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link
                        to={`/issues/${issue._id}`}
                        className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 mb-2 block"
                      >
                        {issue.title}
                      </Link>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {issue.description || "No description provided"}
                      </p>
                    </div>
                    <div className="text-2xl ml-4">{getStatusIcon(issue.status)}</div>
                  </div>

                  {/* Status and Severity Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                    <span className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs font-medium border border-blue-300">
                      <span className="mr-1">{getPriorityIcon(issue.priority)}</span>
                      {issue.priority}
                    </span>
                  </div>

                  {/* Project Info */}
                  {issue.project && (
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-lg">📁</span>
                      <span className="text-sm text-gray-600">
                        Project: <span className="font-medium text-gray-900">{issue.project.name}</span>
                      </span>
                    </div>
                  )}

                  {/* Reporter and Assignee */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">👤</span>
                        <span className="text-sm text-gray-600">
                          Reporter: <span className="font-medium text-gray-900">{issue.reporter?.username}</span>
                        </span>
                      </div>
                      {issue.assignee && (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">👨‍💻</span>
                          <span className="text-sm text-gray-600">
                            Assignee: <span className="font-medium text-gray-900">{issue.assignee.username}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>📅</span>
                      <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/issues/${issue._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Issues;
