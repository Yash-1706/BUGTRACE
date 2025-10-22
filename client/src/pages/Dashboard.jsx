import React, { useEffect, useState } from 'react';
import issueAPI from '../api/issueAPI';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({});
  const { token } = useAuthStore();

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
        console.error('Failed to fetch issues:', error);
      }
    };

    if (token) {
      fetchIssues();
    }
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Issues</h3>
          <p className="text-3xl font-bold text-blue-600">{issues.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Open</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.Open || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
          <p className="text-3xl font-bold text-orange-600">{stats['In Progress'] || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Resolved</h3>
          <p className="text-3xl font-bold text-green-600">{stats.Resolved || 0}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Issues</h2>
        <div className="space-y-4">
          {issues.slice(0, 5).map((issue) => (
            <div key={issue._id} className="border-b pb-4">
              <h3 className="font-semibold">{issue.title}</h3>
              <p className="text-sm text-gray-600">{issue.description}</p>
              <div className="flex justify-between mt-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  issue.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                  issue.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                  issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {issue.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;