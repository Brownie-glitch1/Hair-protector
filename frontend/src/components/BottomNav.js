import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function BottomNav() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/scan"
            className={`flex flex-col items-center justify-center flex-1 h-full transition ${
              isActive('/scan')
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl mb-1">🔍</span>
            <span className="text-xs font-medium">Scan</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center flex-1 h-full transition ${
              isActive('/profile')
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl mb-1">💇‍♀️</span>
            <span className="text-xs font-medium">Profile</span>
          </Link>

          <Link
            to="/history"
            className={`flex flex-col items-center justify-center flex-1 h-full transition ${
              isActive('/history')
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl mb-1">📜</span>
            <span className="text-xs font-medium">History</span>
          </Link>

          <Link
            to="/settings"
            className={`flex flex-col items-center justify-center flex-1 h-full transition ${
              isActive('/settings') || 
              isActive('/account-settings') || 
              isActive('/permissions')
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl mb-1">⚙️</span>
            <span className="text-xs font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BottomNav;
