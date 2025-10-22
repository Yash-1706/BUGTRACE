import axios from 'axios';

const API_URL = '/api/issues';

// Get all issues
const getIssues = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get single issue
const getIssue = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
};

// Create issue
const createIssue = async (issueData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, issueData, config);
  return response.data;
};

// Update issue
const updateIssue = async (id, issueData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${id}`, issueData, config);
  return response.data;
};

// Delete issue
const deleteIssue = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

// Get comments for issue
const getComments = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${id}/comments`, config);
  return response.data;
};

// Add comment to issue
const addComment = async (id, commentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/${id}/comments`, commentData, config);
  return response.data;
};

const issueAPI = {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  getComments,
  addComment,
};

export default issueAPI;