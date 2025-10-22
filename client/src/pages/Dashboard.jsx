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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <div className="inline-block">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in">
              Dashboard Overview
            </h1>
            <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-scale-in"></div>
          </div>
          <p className="text-gray-600 text-lg md:text-xl mt-4 md:mt-6 animate-fade-in delay-300 px-4">
            Monitor your project's progress and manage issues efficiently.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl md:rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-blue-500/25 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-blue-100 text-xs md:text-sm font-medium mb-1 md:mb-2 opacity-90">
                    Total Issues
                  </p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
                    {issues.length}
                  </p>
                  <div className="w-8 md:w-12 h-0.5 md:h-1 bg-white/30 rounded-full"></div>
                </div>
                <div className="text-3xl md:text-4xl lg:text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300 ml-2 md:ml-0">
                  📊
                </div>
              </div>
              <div className="absolute top-2 md:top-4 right-2 md:right-4 w-12 md:w-20 h-12 md:h-20 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl md:rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500 animate-pulse delay-100"></div>
            <div className="relative bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-yellow-500/25 animate-slide-up delay-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-yellow-100 text-xs md:text-sm font-medium mb-1 md:mb-2 opacity-90">
                    Open
                  </p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
                    {stats.Open || 0}
                  </p>
                  <div className="w-8 md:w-12 h-0.5 md:h-1 bg-white/30 rounded-full"></div>
                </div>
                <div className="text-3xl md:text-4xl lg:text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300 ml-2 md:ml-0">
                  📋
                </div>
              </div>
              <div className="absolute top-2 md:top-4 right-2 md:right-4 w-12 md:w-20 h-12 md:h-20 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl md:rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500 animate-pulse delay-200"></div>
            <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-orange-500/25 animate-slide-up delay-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-orange-100 text-xs md:text-sm font-medium mb-1 md:mb-2 opacity-90">
                    In Progress
                  </p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
                    {stats["In Progress"] || 0}
                  </p>
                  <div className="w-8 md:w-12 h-0.5 md:h-1 bg-white/30 rounded-full"></div>
                </div>
                <div className="text-3xl md:text-4xl lg:text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300 ml-2 md:ml-0">
                  ⚡
                </div>
              </div>
              <div className="absolute top-2 md:top-4 right-2 md:right-4 w-12 md:w-20 h-12 md:h-20 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-xl md:rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500 animate-pulse delay-300"></div>
            <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-green-500/25 animate-slide-up delay-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-green-100 text-xs md:text-sm font-medium mb-1 md:mb-2 opacity-90">
                    Resolved
                  </p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
                    {stats.Resolved || 0}
                  </p>
                  <div className="w-8 md:w-12 h-0.5 md:h-1 bg-white/30 rounded-full"></div>
                </div>
                <div className="text-3xl md:text-4xl lg:text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300 ml-2 md:ml-0">
                  ✅
                </div>
              </div>
              <div className="absolute top-2 md:top-4 right-2 md:right-4 w-12 md:w-20 h-12 md:h-20 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border border-white/20 animate-fade-in delay-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Recent Issues
              </h2>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Stay updated with your latest activities
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-3 md:px-4 py-2 rounded-full border border-indigo-200/50 self-start sm:self-auto">
              <span className="text-xs md:text-sm text-indigo-700 font-medium">
                Last 5 issues
              </span>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {issues.length === 0 ? (
            <div className="text-center py-8 md:py-16">
              <div className="relative mb-4 md:mb-6">
                <div className="text-6xl md:text-8xl animate-bounce">📝</div>
                <div className="absolute -top-2 -right-2 w-6 md:w-8 h-6 md:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                No issues yet
              </h3>
              <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6 px-4">
                Create your first issue to get started!
              </p>
              <div className="inline-block">
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-xl md:rounded-2xl">
                  <div className="bg-white rounded-lg md:rounded-xl px-4 md:px-6 py-2 md:py-3">
                    <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text font-semibold text-sm md:text-base">
                      Ready to begin your journey
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {issues.slice(0, 5).map((issue, index) => (
                <div
                  key={issue._id}
                  className="group relative bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-xl transition-all duration-500 hover:border-indigo-200/50 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex flex-col sm:flex-row sm:items-start justify-between">
                    <div className="flex-1 mb-4 sm:mb-0">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors duration-300 text-base md:text-lg">
                        {issue.title}
                      </h3>
                      <p className="text-gray-600 mb-3 md:mb-4 line-clamp-2 leading-relaxed text-sm md:text-base">
                        {issue.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {issue.reporter?.username?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">
                            {issue.reporter?.username}
                          </span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center space-x-1">
                          <span>📅</span>
                          <span>
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end items-start space-y-2 sm:space-y-0 sm:space-x-3 ml-0 sm:ml-6">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold text-white bg-gradient-to-r ${getStatusColor(
                            issue.status
                          )} shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2`}
                        >
                          <span className="text-base md:text-lg">
                            {getStatusIcon(issue.status)}
                          </span>
                          <span>{issue.status}</span>
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-2 md:px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-300/50">
                        {issue.priority}
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 w-8 md:w-16 h-8 md:h-16 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
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
