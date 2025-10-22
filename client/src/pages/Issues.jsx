import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import issueAPI from '../api/issueAPI';
import useAuthStore from '../store/useAuthStore';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const { token, user } = useAuthStore();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issueAPI.getIssues(token);
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      }
    };

    if (token) {
      fetchIssues();
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-orange-100 text-orange-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Issues</h1>
        {(user?.role === 'tester' || user?.role === 'admin') && (
          <Link
            to="/issues/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Issue
          </Link>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {issues.map((issue) => (
            <li key={issue._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Link
                      to={`/issues/${issue._id}`}
                      className="text-lg font-medium text-blue-600 hover:underline"
                    >
                      {issue.title}
                    </Link>
                    <p className="mt-1 text-sm text-gray-600">{issue.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                    <span className="text-sm text-gray-500">
                      {issue.priority}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Reporter: {issue.reporter?.username}
                    </p>
                    {issue.assignee && (
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        Assignee: {issue.assignee.username}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Created: {new Date(issue.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Issues;