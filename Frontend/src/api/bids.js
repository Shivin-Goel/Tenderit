import api from '../utils/api';

export const bidsApi = {
  // Get vendor's own bids
  getMyBids: async () => {
    const response = await api.get('/bids/my');
    return response.data;
  },

  // Submit a new bid
  submitBid: async (bidData) => {
    const response = await api.post('/bids/submit', bidData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all bids for a tender (institute view)
  getTenderBids: async (tenderId) => {
    const response = await api.get(`/bids/tender/${tenderId}`);
    return response.data;
  },

  // Update bid status
  updateBidStatus: async (bidId, status) => {
    const response = await api.put(`/bids/status/${bidId}`, { status });
    return response.data;
  },
};