import React, { useState } from 'react';
import { QrCode, Download, RefreshCw } from 'lucide-react';
import { attendanceAPI, type QRCode } from '../api/attendance';

interface QRGeneratorProps {
  projectId: number;
  projectTitle: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ projectId, projectTitle }) => {
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const generateQRCode = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await attendanceAPI.generateQRCode(projectId);
      console.log('QR Generator Response:', response); // Debug log
      setQrCode(response.qr_code);
    } catch (error: any) {
      console.error('QR Generation Error:', error);
      setError(error.response?.data?.detail || 'Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQR = () => {
    if (qrCode?.qr_image_url) {
      const link = document.createElement('a');
      link.href = qrCode.qr_image_url;
      link.download = `qr-code-project-${projectId}.png`;
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <QrCode className="w-12 h-12 text-primaryColor-900 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">QR Code Generator</h3>
        <p className="text-gray-600">{projectTitle}</p>
      </div>

      {!qrCode ? (
        <div className="text-center">
          <button
            onClick={generateQRCode}
            disabled={isLoading}
            className="bg-primaryColor-900 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto hover:bg-primaryColor-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <QrCode size={20} />
            )}
            Generate QR Code
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <img
              src={qrCode.qr_image_url}
              alt="QR Code"
              className="w-48 h-48 mx-auto border border-gray-200 rounded-lg"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm space-y-2">
              <div><strong>Code:</strong> {qrCode.code}</div>
              <div><strong>Expires:</strong> {new Date(qrCode.expires_at).toLocaleString()}</div>
              <div><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  qrCode.is_expired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {qrCode.is_expired ? 'Expired' : 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={downloadQR}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={generateQRCode}
              disabled={isLoading}
              className="flex-1 bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Regenerate
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;