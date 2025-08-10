import React from 'react';
import { BID_STATUSES } from '../utils/constants';

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case BID_STATUSES.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case BID_STATUSES.UNDER_REVIEW:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case BID_STATUSES.ACCEPTED:
        return 'bg-green-100 text-green-800 border-green-200';
      case BID_STATUSES.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;