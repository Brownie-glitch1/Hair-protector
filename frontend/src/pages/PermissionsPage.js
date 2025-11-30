import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PermissionsPage() {
  const [cameraPermission, setCameraPermission] = useState('checking');
  const [microphonePermission, setMicrophonePermission] = useState('checking');

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
        setCameraPermission('unsupported');
      }

      try {
        const micStatus = await navigator.permissions.query({ name: 'microphone' });
        setMicrophonePermission(micStatus.state);
        
        micStatus.onchange = () => {
          setMicrophonePermission(micStatus.state);
        };
      } catch (err) {
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
      stream.getTracks().forEach(track => track.stop());
      await checkPermissions();
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraPermission('denied');
        showBrowserSettingsGuide();
      } else if (err.name === 'NotFoundError') {
        alert('No camera found on this device.');
      } else {
        alert('Error accessing camera: ' + err.message);
      }
    }
  };

  const showBrowserSettingsGuide = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let message = '';

    if (userAgent.includes('chrome') || userAgent.includes('edg')) {
      message = 
        'Camera access was blocked. To enable it:\n\n' +
        '1. Click the lock/camera icon in the address bar\n' +
        '2. Click "Site settings" or "Permissions"\n' +
        '3. Change Camera to "Allow"\n' +
        '4. Refresh the page';
    } else if (userAgent.includes('firefox')) {
      message = 
        'Camera access was blocked. To enable it:\n\n' +
        '1. Click the camera icon in the address bar\n' +
        '2. Remove the block by clicking the X\n' +
        '3. Click "Allow" when prompted\n' +
        '4. Refresh the page';
    } else if (userAgent.includes('safari')) {
      message = 
        'Camera access was blocked. To enable it:\n\n' +
        '1. Go to Safari → Settings for This Website\n' +
        '2. Or Safari → Settings → Websites → Camera\n' +
        '3. Allow access for this site\n' +
        '4. Refresh the page';
    } else {
      message = 
        'Camera access was blocked. To enable it:\n\n' +
        '1. Open your browser settings\n' +
        '2. Find Privacy or Permissions section\n' +
        '3. Allow camera for this website\n' +
        '4. Refresh the page';
    }

    alert(message);
  };

  const openSystemSettings = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let message = '';

    if (userAgent.includes('android')) {
      message = 
        'To manage camera permissions on Android:\n\n' +
        '1. Open Settings app\n' +
        '2. Go to Apps or Applications\n' +
        '3. Find your browser (Chrome, Firefox, etc.)\n' +
        '4. Tap Permissions\n' +
        '5. Enable Camera';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      message = 
        'To manage camera permissions on iOS:\n\n' +
        '1. Open Settings app\n' +
        '2. Scroll down to Safari or your browser\n' +
        '3. Tap Camera\n' +
        '4. Select "Allow"\n\n' +
        'Or:\n' +
        '1. Settings → Privacy & Security\n' +
        '2. Camera\n' +
        '3. Enable for Safari/Browser';
    } else if (userAgent.includes('mac')) {
      message = 
        'To manage camera permissions on Mac:\n\n' +
        '1. Open System Settings\n' +
        '2. Go to Privacy & Security\n' +
        '3. Click Camera\n' +
        '4. Enable for your browser';
    } else if (userAgent.includes('windows')) {
      message = 
        'To manage camera permissions on Windows:\n\n' +
        '1. Open Settings\n' +
        '2. Go to Privacy & Security\n' +
        '3. Click Camera\n' +
        '4. Enable "Camera access" and browser access';
    } else {
      message = 
        'To manage camera permissions:\n\n' +
        '1. Open your device Settings\n' +
        '2. Find Privacy or Permissions\n' +
        '3. Look for Camera settings\n' +
        '4. Enable for your browser';
    }

    alert(message);
  };

  const getPermissionStatus = (status) => {
    switch (status) {
      case 'granted':
        return { text: 'Granted', color: 'bg-green-100 text-green-700', icon: '✓' };
      case 'denied':
        return { text: 'Denied', color: 'bg-red-100 text-red-700', icon: '✗' };
      case 'prompt':
        return { text: 'Not Set', color: 'bg-yellow-100 text-yellow-700', icon: '?' };
      case 'unsupported':
        return { text: 'Not Available', color: 'bg-gray-100 text-gray-700', icon: '−' };
      case 'checking':
        return { text: 'Checking...', color: 'bg-gray-100 text-gray-700', icon: '⋯' };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-700', icon: '?' };
    }
  };

  const cameraStatus = getPermissionStatus(cameraPermission);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/settings" className="text-primary-600 hover:text-primary-700">
              ← Back
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Permissions</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="font-semibold text-blue-900 mb-1">About Permissions</p>
              <p className="text-sm text-blue-800">
                Camera access is needed for scanning product labels with OCR. 
                You can manage these permissions at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Camera Permission */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📷</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Camera</h2>
                  <p className="text-sm text-gray-600">For scanning product labels</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cameraStatus.color}`}>
                {cameraStatus.icon} {cameraStatus.text}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {cameraPermission === 'granted' && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✓ Camera access is enabled. You can scan product labels.
                </p>
              </div>
            )}

            {cameraPermission === 'denied' && (
              <div className="p-4 bg-red-50 rounded-lg mb-3">
                <p className="text-red-800 text-sm mb-2">
                  ✗ Camera access is blocked. To use image scanning, you need to enable it.
                </p>
              </div>
            )}

            {cameraPermission === 'prompt' && (
              <div className="p-4 bg-yellow-50 rounded-lg mb-3">
                <p className="text-yellow-800 text-sm">
                  Camera permission not set. Click below to allow access.
                </p>
              </div>
            )}

            {(cameraPermission === 'prompt' || cameraPermission === 'denied') && (
              <>
                <button
                  onClick={requestCameraPermission}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  {cameraPermission === 'denied' ? 'Request Camera Access Again' : 'Allow Camera Access'}
                </button>

                <button
                  onClick={showBrowserSettingsGuide}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Browser Settings Guide
                </button>

                <button
                  onClick={openSystemSettings}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  System Settings Guide
                </button>
              </>
            )}

            {cameraPermission === 'unsupported' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 text-sm">
                  Camera permission API is not supported on this device or browser. 
                  You may still be able to use the camera through the file picker.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6">
            <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Desktop:</strong> Click the lock or camera icon in your browser's address bar</p>
              <p><strong>Mobile:</strong> Go to device Settings → Privacy → Camera → Enable for browser</p>
              <p><strong>Note:</strong> Some browsers may require a secure connection (HTTPS) for camera access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PermissionsPage;
