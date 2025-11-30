import React from 'react';
import { useNavigate } from 'react-router-dom';

function PermissionModal({ onClose, onRequestPermission }) {
  const navigate = useNavigate();

  const handleGoToSettings = () => {
    navigate('/permissions');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Icon */}
        <div className="text-center mb-4">
          <div className="text-6xl mb-2">📷</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Camera Access Required
          </h2>
          <p className="text-gray-600">
            To scan barcodes with your camera, we need permission to access it.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900 font-semibold mb-2">Why we need this:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Scan product barcodes instantly</li>
            <li>✓ No manual typing required</li>
            <li>✓ Faster product analysis</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onRequestPermission}
            className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Allow Camera Access
          </button>
          
          <button
            onClick={handleGoToSettings}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            ⚙️ Open Settings
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 text-gray-600 hover:text-gray-900 transition"
          >
            Cancel
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          You can change this permission anytime in Settings
        </p>
      </div>
    </div>
  );
}

export default PermissionModal;
