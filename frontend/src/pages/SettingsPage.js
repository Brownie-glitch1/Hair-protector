import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [cameraPermission, setCameraPermission] = useState('unknown');
  const [microphonePermission, setMicrophonePermission] = useState('unknown');

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // Check camera permission
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const cameraStatus = await navigator.permissions.query({ name: 'camera' });
        setCameraPermission(cameraStatus.state);
        
        cameraStatus.onchange = () => {
          setCameraPermission(cameraStatus.state);
        };
      } catch (err) {
        console.log('Camera permission check not supported');
        setCameraPermission('unsupported');
      }

      try {
        const micStatus = await navigator.permissions.query({ name: 'microphone' });
        setMicrophonePermission(micStatus.state);
        
        micStatus.onchange = () => {
          setMicrophonePermission(micStatus.state);
        };
      } catch (err) {
        console.log('Microphone permission check not supported');
        setMicrophonePermission('unsupported');
      }
    } else {
      setCameraPermission('unsupported');
      setMicrophonePermission('unsupported');
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Permission granted
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
      alert('Camera permission granted!');
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraPermission('denied');
        alert('Camera permission denied. Please enable it in your browser settings.');
        openBrowserSettings();
      } else {
        alert('Error requesting camera permission: ' + err.message);
      }
    }
  };

  const openBrowserSettings = () => {
    // For different browsers, guide user to settings
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome')) {
      alert(
        'To enable camera access in Chrome:\n\n' +
        '1. Click the lock icon in the address bar\n' +
        '2. Click "Site settings"\n' +
        '3. Change Camera permission to "Allow"\n' +
        '4. Refresh the page'
      );
    } else if (userAgent.includes('firefox')) {
      alert(
        'To enable camera access in Firefox:\n\n' +
        '1. Click the camera icon in the address bar\n' +
        '2. Click the "X" next to Blocked Temporarily\n' +
        '3. Select "Always Allow"\n' +
        '4. Refresh the page'
      );
    } else if (userAgent.includes('safari')) {
      alert(
        'To enable camera access in Safari:\n\n' +
        '1. Go to Safari > Settings > Websites\n' +
        '2. Click Camera in the left sidebar\n' +
        '3. Find this website and change to "Allow"\n' +
        '4. Refresh the page'
      );
    } else if (userAgent.includes('edg')) {
      alert(
        'To enable camera access in Edge:\n\n' +
        '1. Click the lock icon in the address bar\n' +
        '2. Click "Permissions for this site"\n' +
        '3. Change Camera to "Allow"\n' +
        '4. Refresh the page'
      );
    } else {
      alert(
        'To enable camera access:\n\n' +
        '1. Check your browser settings\n' +
        '2. Look for Privacy or Permissions\n' +
        '3. Allow camera access for this site\n' +
        '4. Refresh the page'
      );
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const getPermissionBadge = (status) => {
    switch (status) {
      case 'granted':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Granted</span>;
      case 'denied':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">Denied</span>;
      case 'prompt':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-semibold">Not Set</span>;
      case 'unsupported':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-semibold">N/A</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-semibold">Unknown</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <Link to="/scan" className="text-gray-600 hover:text-gray-900">
              Done
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
          </div>
          
          <Link
            to="/account-settings"
            className="flex justify-between items-center p-4 hover:bg-gray-50 transition border-b"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">👤</span>
              <div>
                <p className="font-semibold text-gray-900">Account Information</p>
                <p className="text-sm text-gray-500">Email, password, and basic info</p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>

          <Link
            to="/permissions"
            className="flex justify-between items-center p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="font-semibold text-gray-900">Permissions</p>
                <p className="text-sm text-gray-500">Camera and device access</p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
          </div>
          
          <Link
            to="/profile"
            className="flex justify-between items-center p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💇‍♀️</span>
              <div>
                <p className="font-semibold text-gray-900">Hair Profile</p>
                <p className="text-sm text-gray-500">Porosity, curl pattern, scalp type</p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl shadow-lg">
          <button
            onClick={handleLogout}
            className="w-full p-4 text-red-600 font-semibold hover:bg-red-50 transition rounded-xl"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
