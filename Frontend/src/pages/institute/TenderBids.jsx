import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, Calendar, Mail } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import DocumentViewer from '../../components/DocumentViewer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { bidsApi } from '../../api/bids';
import { tendersApi } from '../../api/tenders';
import { showToast } from '../../utils/toast';
import { BID_STATUSES } from '../../utils/constants';

const TenderBids = () => {
  const { tenderId } = useParams();
  const [bids, setBids] = useState([]);
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchTenderAndBids();
  }, [tenderId]);

  const fetchTenderAndBids = async () => {
    try {
      const [tenderResponse, bidsResponse] = await Promise.all([
        tendersApi.getTenderById(tenderId),
        bidsApi.getTenderBids(tenderId)
      ]);
      
      setTender(tenderResponse.tender);
      setBids(bidsResponse.bids || []);
    } catch (error) {
      showToast.error('Failed to fetch tender details and bids');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bidId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [bidId]: true }));
    
    try {
      await bidsApi.updateBidStatus(bidId, newStatus);
      setBids(prev => prev.map(bid => 
        bid.id === bidId ? { ...bid, status: newStatus } : bid
      ));
      showToast.success(`Bid status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      showToast.error('Failed to update bid status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [bidId]: false }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Button and Header */}
        <div className="flex items-center space-x-4">
          <Link
            to="/institute/dashboard"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Tender Information */}
        {tender && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-2xl font-bold text-gray-900">{tender.title}</h1>
              <p className="mt-2 text-gray-600">{tender.description}</p>
              <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Deadline: {formatDate(tender.deadline)}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {bids.length} bid{bids.length !== 1 ? 's' : ''} received
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bids Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Bids
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {bids.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Review
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {bids.filter(bid => bid.status === BID_STATUSES.PENDING).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Accepted
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {bids.filter(bid => bid.status === BID_STATUSES.ACCEPTED).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg. Bid Amount
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {bids.length > 0 
                        ? formatCurrency(bids.reduce((sum, bid) => sum + bid.bidAmount, 0) / bids.length)
                        : '$0'
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bids List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Submitted Bids
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Review and manage all bids submitted for this tender
            </p>
          </div>
          
          {bids.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bids submitted</h3>
              <p className="mt-1 text-sm text-gray-500">
                No vendors have submitted bids for this tender yet.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {bids.map((bid) => (
                <li key={bid.id} className="px-4 py-6 sm:px-6">
                  <div className="space-y-4">
                    {/* Bid Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {bid.vendor?.name || 'Unknown Vendor'}
                            </h4>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Mail className="h-4 w-4 mr-1" />
                              {bid.vendor?.email}
                            </div>
                          </div>
                          <div className="ml-4 flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                {formatCurrency(bid.bidAmount)}
                              </div>
                              <div className="text-sm text-gray-500">
                                Submitted {formatDate(bid.createdAt)}
                              </div>
                            </div>
                            <StatusBadge status={bid.status} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bid Note */}
                    {bid.bidNote && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Vendor Note:</h5>
                        <p className="text-gray-700">{bid.bidNote}</p>
                      </div>
                    )}

                    {/* Documents */}
                    {bid.documents && bid.documents.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Supporting Documents:</h5>
                        <DocumentViewer documents={bid.documents} />
                      </div>
                    )}

                    {/* Status Update Controls */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-700">Update Status:</span>
                      <div className="flex space-x-2">
                        {Object.values(BID_STATUSES).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(bid.id, status)}
                            disabled={bid.status === status || updatingStatus[bid.id]}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                              bid.status === status
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                          >
                            {updatingStatus[bid.id] && bid.status !== status ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              status.replace('_', ' ').toUpperCase()
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TenderBids;