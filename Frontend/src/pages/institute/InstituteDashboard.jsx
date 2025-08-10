import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Clock, CheckCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { tendersApi } from '../../api/tenders';
import { showToast } from '../../utils/toast';

const InstituteDashboard = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
  try {
    const tenders = await tendersApi.getMyTenders();
    setTenders(tenders || []);
  } catch (error) {
    showToast.error('Failed to fetch tenders');
  } finally {
    setLoading(false);
  }
};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Institute Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your tenders and review incoming bids
          </p>
        </div>
        <Link to="/institute/create">
           <button className="bg-green-600 text-white px-3 py-1 rounded">+ Create Tender</button>
        </Link>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Tenders
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tenders.length}
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
                  <Clock className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Open Tenders
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tenders.filter(tender => tender.status === 'open').length}
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
                  <CheckCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Closed Tenders
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tenders.filter(tender => tender.status === 'closed').length}
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
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Bids
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tenders.reduce((sum, tender) => sum + (tender.bidCount || 0), 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tenders List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              All Tenders
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Click on a tender to view and manage bids
            </p>
          </div>
          
          {tenders.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tenders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No tenders have been posted yet.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tenders.map((tender) => (
                <li key={tender.id}>
                  <Link 
                    to={`/institute/tender/${tender.id}/bids`}
                    className="block hover:bg-gray-50 px-4 py-6 sm:px-6 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-blue-600 truncate">
                            {tender.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(tender.status)}`}>
                              {tender.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {tender.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>
                            Deadline: {formatDate(tender.deadline)}
                          </p>
                          <span className="mx-2">•</span>
                          <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>
                            {tender.bidCount || 0} bid{(tender.bidCount || 0) !== 1 ? 's' : ''}
                          </p>
                          <span className="mx-2">•</span>
                          <p>
                            Created {formatDate(tender.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InstituteDashboard;