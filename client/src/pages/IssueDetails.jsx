import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import issueAPI from "../api/issueAPI";
import commentAPI from "../api/commentAPI";
import useAuthStore from "../store/useAuthStore";

const IssueDetails = () => {
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const { id } = useParams();
  const { token, user } = useAuthStore();

  useEffect(() => {
    const fetchIssueData = async () => {
      try {
        const [issueData, commentsData] = await Promise.all([
          issueAPI.getIssue(id, token),
          commentAPI.getComments(id, token),
        ]);

        setIssue(issueData);
        setComments(commentsData);
      } catch (error) {
        console.error("Failed to fetch issue data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchIssueData();
    }
  }, [id, token]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const commentData = {
        issue: id,
        text: newComment.trim(),
      };

      const addedComment = await commentAPI.addComment(id, commentData, token);
      setComments((prev) => [...prev, addedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpdateIssue = async () => {
    try {
      const updatedIssue = await issueAPI.updateIssue(id, editData, token);
      setIssue(updatedIssue);
      setEditMode(false);
      setEditData({});
    } catch (error) {
      console.error("Failed to update issue:", error);
    }
  };

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

  const canEditIssue = () => {
    return (
      user?.role === "admin" ||
      (user?.role === "developer" && issue?.assignee?._id === user._id)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🐛</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Issue not found
          </h3>
          <p className="text-gray-600 mb-6">
            The issue you're looking for doesn't exist.
          </p>
          <Link
            to="/issues"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {issue.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Issue #{issue._id.slice(-6)}</span>
                <span>•</span>
                <span>
                  Created {new Date(issue.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {canEditIssue() && (
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                {editMode ? "Cancel Edit" : "Edit Issue"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h3>
              {editMode ? (
                <textarea
                  value={editData.description || issue.description}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={6}
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {issue.description}
                </p>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comments</h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="space-y-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={commentLoading || !newComment.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {commentLoading ? "Posting..." : "Add Comment"}
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💬</div>
                    <p className="text-gray-500">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {comment.author?.username?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">
                              {comment.author?.username || "Unknown User"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Issue Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Details</h3>
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  {editMode ? (
                    <select
                      value={editData.status || issue.status}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  )}
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  {editMode ? (
                    <select
                      value={editData.severity || issue.severity}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          severity: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(
                        issue.severity
                      )}`}
                    >
                      {issue.severity}
                    </span>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  {editMode ? (
                    <select
                      value={editData.priority || issue.priority}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="P1">P1 - Critical</option>
                      <option value="P2">P2 - High</option>
                      <option value="P3">P3 - Normal</option>
                    </select>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-300">
                      <span className="mr-1">
                        {getPriorityIcon(issue.priority)}
                      </span>
                      {issue.priority}
                    </span>
                  )}
                </div>

                {/* Project */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <Link
                    to={`/projects/${issue.project._id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {issue.project.name}
                  </Link>
                </div>

                {/* Reporter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporter
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {issue.reporter?.username?.charAt(0)?.toUpperCase() ||
                        "?"}
                    </div>
                    <span className="text-gray-900">
                      {issue.reporter?.username || "Unknown User"}
                    </span>
                  </div>
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignee
                  </label>
                  {editMode ? (
                    <select
                      value={editData.assignee || issue.assignee?._id || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          assignee: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Unassigned</option>
                      {issue.project.members
                        .filter((member) => member.role === "developer")
                        .map((developer) => (
                          <option key={developer._id} value={developer._id}>
                            {developer.username}
                          </option>
                        ))}
                    </select>
                  ) : issue.assignee ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {issue.assignee.username?.charAt(0)?.toUpperCase() ||
                          "?"}
                      </div>
                      <span className="text-gray-900">
                        {issue.assignee.username || "Unknown User"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Unassigned</span>
                  )}
                </div>

                {/* Save Changes */}
                {editMode && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleUpdateIssue}
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
