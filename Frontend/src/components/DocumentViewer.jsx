import React from 'react';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { UPLOADS_BASE_URL } from '../utils/constants';

const DocumentViewer = ({ documents = [] }) => {
  const handleView = (filename) => {
    window.open(`${UPLOADS_BASE_URL}/${filename}`, '_blank');
  };

  const handleDownload = (filename) => {
    const link = document.createElement('a');
    link.href = `${UPLOADS_BASE_URL}/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!documents.length) {
    return (
      <div className="text-gray-500 text-sm">
        No documents uploaded
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((filename, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700 truncate max-w-xs">{filename}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleView(filename)}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              <span>View</span>
            </button>
            <button
              onClick={() => handleDownload(filename)}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            >
              <Download className="h-3 w-3" />
              <span>Download</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentViewer;