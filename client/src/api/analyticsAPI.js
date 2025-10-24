import axios from 'axios';

const API_URL = '/api/analytics';

// Get dashboard overview with analytics
const getDashboardOverview = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/overview`, config);
  return response.data;
};

const analyticsAPI = {
  getDashboardOverview,
};

export default analyticsAPI;
