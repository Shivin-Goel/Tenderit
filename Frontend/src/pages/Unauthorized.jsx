import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    return user?.role === 'vendor' ? '/vendor/dashboard' : '/institute/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            to={getDashboardPath()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;