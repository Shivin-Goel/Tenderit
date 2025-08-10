import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Building2, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to={user?.role === 'vendor' ? '/vendor/dashboard' : '/institute/dashboard'} 
                    className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">TenderPlatform</span>
              </Link>
            </div>

            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.role === 'vendor' ? (
                    <Building2 className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Package className="h-5 w-5 text-gray-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.name || user.email}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    ({user.role})
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;