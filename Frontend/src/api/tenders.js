import api from '../utils/api';

export const tendersApi = {
  // Get tenders posted by this institute
  getMyTenders: async () => {
    const response = await api.get('/tenders/my-tenders');
    return response.data;
  },

  // Get tender details
  getTenderById: async (tenderId) => {
    const response = await api.get(`/tenders/${tenderId}`);
    return response.data;
  },

  // Create new tender
  createTender: async (tenderData) => {
    const response = await api.post('/tenders', tenderData);
    return response.data;
  },

  // Get active tenders for vendors
  getAllTenders: async () => {   // <-- renamed here
    const response = await api.get('/tenders');
    return response.data;
  }
};