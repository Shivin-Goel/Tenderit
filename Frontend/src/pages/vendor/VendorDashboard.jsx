import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Calendar, DollarSign, Briefcase } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import DocumentViewer from '../../components/DocumentViewer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { bidsApi } from '../../api/bids';
import { tendersApi } from '../../api/tenders';
import { showToast } from '../../utils/toast';

const VendorDashboard = () => {
  const [bids, setBids] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [loadingBids, setLoadingBids] = useState(true);
  const [loadingTenders, setLoadingTenders] = useState(true);

  useEffect(() => {
    fetchMyBids();
    fetchAllTenders();
  }, []);

  const fetchMyBids = async () => {
    try {
      const response = await bidsApi.getMyBids();
      setBids(response.bids || []);
    } catch (error) {
      showToast.error('Failed to fetch bids');
    } finally {
      setLoadingBids(false);
    }
  };

  const fetchAllTenders = async () => {
    try {
      const response = await tendersApi.getAllTenders();
      setTenders(response.tenders || []);
    } catch (error) {
      showToast.error('Failed to fetch tenders');
    } finally {
      setLoadingTenders(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <Layout>
      <div className="space-y-10">
        {/* ---------------- My Bids ---------------- */}
        <section>
          {loadingBids ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Bids</h1>
                  <p className="mt-2 text-gray-600">Track and manage all your submitted bids</p>
                </div>
                <Link
                  to="/vendor/submit-bid"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit New Bid
                </Link>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                {[
                  { title: 'Total Bids', value: bids.length, icon: FileText, color: 'text-gray-400' },
                  { title: 'Pending', value: bids.filter((b) => b.status === 'pending').length, icon: Calendar, color: 'text-yellow-400' },
                  { title: 'Accepted', value: bids.filter((b) => b.status === 'accepted').length, icon: DollarSign, color: 'text-green-400' },
                  { title: 'Rejected', value: bids.filter((b) => b.status === 'rejected').length, icon: FileText, color: 'text-red-400' },
                ].map(({ title, value, icon: Icon, color }) => (
                  <div key={title} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5 flex items-center">
                      <Icon className={`h-6 w-6 ${color}`} />
                      <div className="ml-5">
                        <dt className="text-sm font-medium text-gray-500">{title}</dt>
                        <dd className="text-lg font-medium text-gray-900">{value}</dd>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bids List */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md mt-6">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Bids</h3>
                </div>
                {bids.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bids submitted</h3>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {bids.map((bid) => (
                      <li key={bid.id} className="px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600">Bid #{bid.id}</p>
                          <StatusBadge status={bid.status} />
                        </div>
                        <div className="mt-2 text-sm text-gray-500 flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          {formatCurrency(bid.bidAmount)}
                          <span className="mx-2">•</span>
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(bid.createdAt)}
                        </div>
                        {bid.bidNote && <p className="mt-2 text-sm text-gray-600"><strong>Note:</strong> {bid.bidNote}</p>}
                        {bid.documents?.length > 0 && (
                          <div className="mt-3">
                            <DocumentViewer documents={bid.documents} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>

        {/* ---------------- All Tenders ---------------- */}
        <section>
          <div className="flex items-center mb-4">
            <Briefcase className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">All Tenders</h2>
          </div>

          {loadingTenders ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="large" />
            </div>
          ) : tenders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-md shadow">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tenders available</h3>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {tenders.map((tender) => (
                  <li key={tender.id} className="px-4 py-6 sm:px-6">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-blue-600">{tender.title}</p>
                      <StatusBadge status={tender.status} /> {/* status: 'open' | 'closed' */}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 text-gray-400 inline mr-1" />
                      Closing: {formatDate(tender.closingDate)}
                    </div>
                    {tender.description && (
                      <p className="mt-2 text-sm text-gray-600">{tender.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default VendorDashboard;
