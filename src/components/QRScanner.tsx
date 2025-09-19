import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, CheckCircle, XCircle } from 'lucide-react';
import { attendanceAPI } from '../api/attendance';
import { useAuth } from '../hooks/useAuth';

const QRScanner: React.FC = () => {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        setError('');
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleCheckIn = async (qrCode: string) => {
    setIsLoading(true);
    setError('');
    setMessage('');
    
    // Validate QR code format
    if (!qrCode.startsWith('umuganda_checkin:')) {
      setError('Invalid QR code format. Please scan a valid project QR code.');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Checking in with QR:', qrCode);
      const response = await attendanceAPI.checkIn(qrCode);
      setMessage(`✅ ${response.message}`);
      setResult('check-in-success');
    } catch (error: any) {
      console.error('Checkin error:', error);
      let errorMsg = 'Check-in failed';
      
      if (error.code === 'ERR_NETWORK') {
        errorMsg = 'Network error. Please check your connection and try again.';
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. The backend may be down or experiencing issues.';
      } else if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async (qrCode: string) => {
    setIsLoading(true);
    setError('');
    setMessage('');
    
    // Validate QR code format
    if (!qrCode.startsWith('umuganda_checkin:')) {
      setError('Invalid QR code format. Please scan a valid project QR code.');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Checking out with QR:', qrCode);
      const response = await attendanceAPI.checkOut(qrCode);
      setMessage(`✅ ${response.message}`);
      if (response.new_badges?.length) {
        setMessage(prev => prev + ` 🏆 New badges earned: ${response.new_badges.map(b => b.name).join(', ')}`);
      }
      setResult('check-out-success');
    } catch (error: any) {
      console.error('Checkout error:', error);
      let errorMsg = 'Check-out failed';
      
      if (error.code === 'ERR_NETWORK') {
        errorMsg = 'Network error. Please check your connection and try again.';
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. The backend may be down or experiencing issues.';
      } else if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const processQRCode = (qrData: string) => {
    // Format: umuganda_checkin:1:abc123-def456-ghi789
    if (!qrData.startsWith('umuganda_checkin:')) {
      setError('Invalid QR code format');
      return;
    }
    
    // For demo, we'll use manual input
    setResult(qrData);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <QrCode className="w-16 h-16 text-primaryColor-900 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Scanner</h1>
          <p className="text-gray-600">Scan QR code to check-in or check-out</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {!isScanning ? (
            <div className="text-center">
              <button
                onClick={startCamera}
                className="bg-primaryColor-900 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto hover:bg-primaryColor-800 transition-colors"
              >
                <Camera size={20} />
                Start Scanner
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-black rounded-lg"
              />
              <button
                onClick={stopCamera}
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Stop Scanner
              </button>
            </div>
          )}

          {/* Manual QR Input for Testing */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Manual QR Code Entry</h3>
            <input
              type="text"
              placeholder="umuganda_checkin:1:abc123-def456-ghi789"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900 mb-3"
              onChange={(e) => setResult(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleCheckIn(result)}
                disabled={!result || isLoading}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Check In
              </button>
              <button
                onClick={() => handleCheckOut(result)}
                disabled={!result || isLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Check Out
              </button>
            </div>
          </div>

          {/* Results */}
          {isLoading && (
            <div className="mt-4 text-center">
              <div className="w-6 h-6 border-2 border-primaryColor-900 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Processing...</p>
            </div>
          )}

          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;