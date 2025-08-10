import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, DollarSign, FileText, Send } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { bidsApi } from '../../api/bids';
import { showToast } from '../../utils/toast';

const SubmitBid = () => {
  const [formData, setFormData] = useState({
    tenderId: '',
    bidAmount: '',
    bidNote: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tenderId || !formData.bidAmount) {
      showToast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('tenderId', formData.tenderId);
      submitData.append('bidAmount', formData.bidAmount);
      submitData.append('bidNote', formData.bidNote);
      
      selectedFiles.forEach((file) => {
        submitData.append('documents', file);
      });

      await bidsApi.submitBid(submitData);
      showToast.success('Bid submitted successfully!');
      navigate('/vendor/dashboard');
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to submit bid');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Submit New Bid</h1>
              <p className="mt-2 text-sm text-gray-600">
                Fill in the details below to submit your bid for a tender
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tender ID */}
              <div>
                <label htmlFor="tenderId" className="block text-sm font-medium text-gray-700">
                  Tender ID <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="tenderId"
                    id="tenderId"
                    required
                    value={formData.tenderId}
                    onChange={handleChange}
                    className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tender ID"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Bid Amount */}
              <div>
                <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">
                  Bid Amount <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="bidAmount"
                    id="bidAmount"
                    required
                    min="0"
                    step="0.01"
                    value={formData.bidAmount}
                    onChange={handleChange}
                    className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Bid Note */}
              <div>
                <label htmlFor="bidNote" className="block text-sm font-medium text-gray-700">
                  Bid Note
                </label>
                <div className="mt-1">
                  <textarea
                    id="bidNote"
                    name="bidNote"
                    rows={4}
                    value={formData.bidNote}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any additional notes or comments about your bid..."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Optional: Provide additional details about your bid
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supporting Documents
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleFileSelect}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, JPEG, PNG up to 10MB each
                    </p>
                  </div>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/vendor/dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Bid
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitBid;