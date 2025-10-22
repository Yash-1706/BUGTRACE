import React, { useEffect, useState } from "react";
import issueAPI from "../api/issueAPI";
import useAuthStore from "../store/useAuthStore";

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuthStore();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issueAPI.getIssues(token);
        setIssues(data);

        // Calculate stats
        const statusCounts = data.reduce((acc, issue) => {
          acc[issue.status] = (acc[issue.status] || 0) + 1;
          return acc;
        }, {});
        setStats(statusCounts);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return "📋";
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "from-yellow-400 to-yellow-500";
      case "In Progress":
        return "from-orange-400 to-orange-500";
      case "Resolved":
        return "from-green-400 to-green-500";
      case "Closed":
        return "from-gray-400 to-gray-500";
      default:
        return "from-gray-400 to-gray-500";
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Issues</p>
                <p className="text-3xl font-bold">{issues.length}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Open</p>
                <p className="text-3xl font-bold">{stats.Open || 0}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold">{stats["In Progress"] || 0}</p>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold">{stats.Resolved || 0}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Issues</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Last 5 issues
            </span>
          </div>

          {issues.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No issues yet</h3>
              <p className="text-gray-600">Create your first issue to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.slice(0, 5).map((issue) => (
                <div
                  key={issue._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{issue.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {issue.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By {issue.reporter?.username}</span>
                        <span>•</span>
                        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(
                          issue.status
                        )} text-white flex items-center space-x-1`}
                      >
                        <span>{getStatusIcon(issue.status)}</span>
                        <span>{issue.status}</span>
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {issue.priority}
                      </span>
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

export default Dashboard;
