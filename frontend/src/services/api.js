import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = {
  // Auth methods
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },

  // Get all reviews
  getAllReviews: async () => {
    const response = await axios.get(`${API_URL}/reviews`);
    return response.data;
  },

  // Get user's reviews
  getUserReviews: async () => {
    const response = await axios.get(`${API_URL}/reviews/my-reviews`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Create a review
  createReview: async (reviewData) => {
    const response = await axios.post(`${API_URL}/reviews`, reviewData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Update a review
  updateReview: async (id, reviewData) => {
    const response = await axios.put(`${API_URL}/reviews/${id}`, reviewData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Delete a review
  deleteReview: async (id) => {
    const response = await axios.delete(`${API_URL}/reviews/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Vote on a review
  voteReview: async (reviewId, vote) => {
    const response = await axios.post(
      `${API_URL}/reviews/${reviewId}/vote`,
      { vote },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get user's vote for a review
  getReviewVote: async (reviewId) => {
    const response = await axios.get(
      `${API_URL}/reviews/${reviewId}/vote`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get a single review by ID
  getReview: async (id) => {
    const response = await axios.get(`${API_URL}/reviews/${id}`);
    return response.data;
  }
};

export default api;