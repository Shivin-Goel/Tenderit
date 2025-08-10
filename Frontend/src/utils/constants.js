export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

export const BID_STATUSES = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

export const USER_ROLES = {
  VENDOR: 'vendor',
  INSTITUTE: 'institute'
};