import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';

function BarcodeScanner({ onScan, onClose, onPermissionDenied }) {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const codeReaderRef = useRef(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    startScanning();

    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    setScanning(true);
    setError('');
    
    const interval = setInterval(() => {
      captureAndDecode();
    }, 500); // Scan every 500ms

    return () => clearInterval(interval);
  };

  const stopScanning = () => {
    setScanning(false);
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
  };

  const captureAndDecode = async () => {
    if (!webcamRef.current || !scanning) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      // Convert base64 to image element
      const img = new Image();
      img.src = imageSrc;
      
      img.onload = async () => {
        try {
          const result = await codeReaderRef.current.decodeFromImageElement(img);
          if (result && result.getText()) {
            stopScanning();
            onScan(result.getText());
          }
        } catch (err) {
          // No barcode found in this frame, continue scanning
        }
      };
    } catch (err) {
      console.error('Decoding error:', err);
    }
  };

  const handleUserMediaError = (err) => {
    console.error('Camera error:', err);
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      onPermissionDenied();
    } else if (err.name === 'NotFoundError') {
      setError('No camera found on this device.');
    } else {
      setError('Error accessing camera: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Scan Barcode</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 text-2xl"
        >
          ✕
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {!error ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: { ideal: 'environment' }, // Use back camera on mobile
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }}
              onUserMediaError={handleUserMediaError}
              className="w-full h-full object-cover"
            />
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Scanning frame */}
                <div className="w-64 h-40 border-4 border-primary-500 rounded-lg relative">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                  
                  {/* Scanning line animation */}
                  {scanning && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500 animate-pulse"></div>
                  )}
                </div>
                
                <p className="text-white text-center mt-4 text-sm">
                  Position barcode within the frame
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-white text-lg mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!error && (
        <div className="bg-white p-4 text-center">
          <p className="text-sm text-gray-600">
            Point your camera at the product barcode
          </p>
        </div>
      )}
    </div>
  );
}

export default BarcodeScanner;
