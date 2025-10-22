import axios from 'axios';

const API_URL = '/api/issues';

// Get comments for issue
const getComments = async (issueId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${issueId}/comments`, config);
  return response.data;
};

// Add comment to issue
const addComment = async (issueId, commentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/${issueId}/comments`, commentData, config);
  return response.data;
};

const commentAPI = {
  getComments,
  addComment,
};

export default commentAPI;