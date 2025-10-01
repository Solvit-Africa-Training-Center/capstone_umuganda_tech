import React, { useState, useEffect } from 'react';
import { QrCode, Download, RefreshCw, Eye, Calendar, MapPin, Users, Share2, Copy, Check } from 'lucide-react';
import { projectsAPI } from '../../api/projects';
import type { Project } from '../../types/api';

interface QRCodeCenterProps {
  projects: Project[];
  isLoading?: boolean;
}

interface QRCodeData {
  qr_code_url: string;
  qr_code_data: string;
  project_id: number;
  created_at: string;
  expires_at?: string;
  is_expired?: boolean;
  client_generated?: boolean;
}

const QRCodeCenter: React.FC<QRCodeCenterProps> = ({ projects, isLoading }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Client-side QR code generation fallback
  const generateClientSideQR = (data: string): string => {
    try {
      // Create a simple QR code using a public API as fallback
      const encodedData = encodeURIComponent(data);
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;
    } catch (error) {
      console.error('Failed to generate client-side QR code:', error);
      return '';
    }
  };

  const activeProjects = projects.filter(p => p.status === 'ongoing' || p.status === 'planned');

  useEffect(() => {
    if (selectedProject) {
      fetchExistingQRCode();
    }
  }, [selectedProject]);

  const fetchExistingQRCode = async () => {
    if (!selectedProject) return;
    
    setLoadingQR(true);
    try {
      // Use the same approach as ProjectAttendance component
      const existingData = await projectsAPI.getQRCode(selectedProject.id);
      console.log('🔍 QR Code data received:', existingData);
      
      // Extract QR code from nested structure like ProjectAttendance does
      const qrCodeInfo = existingData.qr_code || existingData;
      console.log('🔍 QR Code info:', qrCodeInfo);
      
      let processedData = {
        qr_code_url: String(qrCodeInfo?.qr_image_url || existingData?.qr_image_url || ''),
        qr_code_data: String(qrCodeInfo?.code || existingData?.code || `${window.location.origin}/project/${selectedProject.id}/checkin`),
        project_id: Number(qrCodeInfo?.project || existingData?.project || selectedProject.id),
        created_at: String(qrCodeInfo?.created_at || existingData?.created_at || new Date().toISOString()),
        expires_at: qrCodeInfo?.expires_at || existingData?.expires_at ? String(qrCodeInfo?.expires_at || existingData?.expires_at) : undefined,
        is_expired: Boolean(qrCodeInfo?.is_expired || existingData?.is_expired)
      };
      
      // Check if expired and regenerate if needed
      if (processedData.is_expired) {
        console.log('🔄 QR Code expired, generating new one');
        await generateQRCode();
        return;
      }
      
      // If no URL from backend, generate client-side QR code
      if (!processedData.qr_code_url) {
        console.log('🔄 No existing URL, generating client-side QR code');
        const qrCodeDataUrl = generateClientSideQR(processedData.qr_code_data);
        processedData.qr_code_url = qrCodeDataUrl;
        processedData.client_generated = true;
      }
      
      setQrCodeData(processedData);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Failed to fetch QR code:', error);
      }
      // If no existing QR code, that's fine - user can generate one
      setQrCodeData(null);
    } finally {
      setLoadingQR(false);
    }
  };

  const generateQRCode = async () => {
    if (!selectedProject) return;
    
    setGeneratingQR(true);
    try {
      // Use the same approach as ProjectAttendance component
      const newData = await projectsAPI.generateQRCode(selectedProject.id);
      console.log('🔍 Generated QR Code data:', newData);
      
      // Extract QR code from nested structure like ProjectAttendance does
      const qrCodeInfo = newData.qr_code || newData;
      console.log('🔍 Generated QR Code info:', qrCodeInfo);
      
      let processedData = {
        qr_code_url: String(qrCodeInfo?.qr_image_url || newData?.qr_image_url || ''),
        qr_code_data: String(qrCodeInfo?.code || newData?.code || `${window.location.origin}/project/${selectedProject.id}/checkin`),
        project_id: Number(qrCodeInfo?.project || newData?.project || selectedProject.id),
        created_at: String(qrCodeInfo?.created_at || newData?.created_at || new Date().toISOString()),
        expires_at: qrCodeInfo?.expires_at || newData?.expires_at ? String(qrCodeInfo?.expires_at || newData?.expires_at) : undefined,
        is_expired: Boolean(qrCodeInfo?.is_expired || newData?.is_expired)
      };
      
      // If no URL from backend, generate client-side QR code
      if (!processedData.qr_code_url) {
        console.log('🔄 No URL from backend, generating client-side QR code');
        const qrCodeDataUrl = generateClientSideQR(processedData.qr_code_data);
        processedData.qr_code_url = qrCodeDataUrl;
        processedData.client_generated = true;
      }
      
      console.log('🔍 Processed QR Code data:', processedData);
      setQrCodeData(processedData);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    } finally {
      setGeneratingQR(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeData?.qr_code_url) return;
    
    const link = document.createElement('a');
    link.href = qrCodeData.qr_code_url;
    link.download = `qr-code-project-${selectedProject?.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyQRUrl = async () => {
    if (!qrCodeData?.qr_code_url) return;
    
    try {
      await navigator.clipboard.writeText(qrCodeData.qr_code_url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const shareQRCode = async () => {
    if (!qrCodeData?.qr_code_url || !selectedProject) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for ${selectedProject.title}`,
          text: `Scan this QR code to check in to the project: ${selectedProject.title}`,
          url: qrCodeData.qr_code_url
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      copyQRUrl();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primaryColor-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primaryColor-600 via-primaryColor-700 to-primaryColor-800 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24"></div>
          
          <div className="relative text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">QR Code Center</h1>
                <p className="text-primaryColor-100 text-lg">Generate and manage QR codes for project attendance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-primaryColor-100">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                <span>{activeProjects.length} Active Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Attendance Tracking</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Select Project</h2>
            
            {activeProjects.length === 0 ? (
              <div className="text-center py-8">
                <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No active projects</p>
                <p className="text-sm text-gray-500">Create a project to generate QR codes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                      selectedProject?.id === project.id
                        ? 'border-primaryColor-600 bg-primaryColor-50'
                        : 'border-gray-200 hover:border-primaryColor-300 hover:bg-gray-50'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">{project.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.datetime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{project.volunteer_count || 0}/{project.required_volunteers} volunteers</span>
                      </div>
                    </div>
                    <div className={`mt-2 px-2 py-1 text-xs font-medium rounded-full inline-block ${
                      project.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QR Code Display */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
            {!selectedProject ? (
              <div className="text-center py-16">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Project</h3>
                <p className="text-gray-600">Choose a project from the list to generate or view its QR code</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Project Info */}
                <div className="bg-gradient-to-r from-primaryColor-50 to-primaryColor-100 p-4 rounded-xl border-l-4 border-primaryColor-600">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedProject.title}</h3>
                  <p className="text-gray-700">{selectedProject.description}</p>
                </div>

                {/* QR Code Section */}
                {loadingQR ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-primaryColor-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading QR code...</p>
                  </div>
                ) : qrCodeData ? (
                  <div className="text-center space-y-6">
                    {/* QR Code Image */}
                    {qrCodeData.qr_code_url ? (
                      <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
                        <img 
                          src={qrCodeData.qr_code_url} 
                          alt="QR Code"
                          className="w-64 h-64 mx-auto"
                          onError={(e) => {
                            console.error('QR Code image failed to load:', qrCodeData.qr_code_url);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                          onLoad={() => console.log('QR Code image loaded successfully')}
                        />
                        <div className="hidden w-64 h-64 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">QR Code failed to load</p>
                            <p className="text-xs text-gray-400 mt-1">URL: {qrCodeData.qr_code_url}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
                        <div className="w-64 h-64 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No QR Code URL</p>
                            <p className="text-xs text-gray-400 mt-1">Backend response missing URL</p>
                            <button
                              onClick={() => {
                                console.log('Full QR Data:', JSON.stringify(qrCodeData, null, 2));
                                console.log('QR Data Type:', typeof qrCodeData);
                                console.log('QR Data Keys:', Object.keys(qrCodeData || {}));
                              }}
                              className="text-xs text-blue-500 underline mt-2"
                            >
                              Debug Data
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* QR Code Info */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">
                          Generated: {new Date(qrCodeData.created_at || new Date()).toLocaleString()}
                        </p>
                        {qrCodeData.client_generated && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Client Generated
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-mono break-all">
                        {String(qrCodeData.qr_code_data || '')}
                      </p>
                      {qrCodeData.client_generated && (
                        <p className="text-xs text-blue-600 mt-2">
                          ℹ️ Using fallback QR generator since backend URL not available
                        </p>
                      )}
                      {qrCodeData.expires_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {new Date(qrCodeData.expires_at).toLocaleString()}
                        </p>
                      )}
                      {qrCodeData.is_expired && (
                        <p className="text-xs text-red-600 mt-1 font-medium">
                          ⚠️ This QR code has expired
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={downloadQRCode}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      
                      <button
                        onClick={copyQRUrl}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          copiedUrl 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                      >
                        {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedUrl ? 'Copied!' : 'Copy URL'}
                      </button>
                      
                      <button
                        onClick={shareQRCode}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      
                      <button
                        onClick={generateQRCode}
                        disabled={generatingQR}
                        className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${generatingQR ? 'animate-spin' : ''}`} />
                        Regenerate
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No QR Code Found</h3>
                    <p className="text-gray-600 mb-6">Generate a QR code for this project to enable attendance tracking</p>
                    
                    <button
                      onClick={generateQRCode}
                      disabled={generatingQR}
                      className="flex items-center gap-2 bg-primaryColor-600 text-white px-6 py-3 rounded-xl hover:bg-primaryColor-700 disabled:bg-gray-400 transition-colors mx-auto"
                    >
                      {generatingQR ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-5 h-5" />
                          Generate QR Code
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Use QR Codes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">1. Generate QR Code</h4>
              <p className="text-sm text-gray-600">Select a project and generate its unique QR code for attendance tracking</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">2. Share with Volunteers</h4>
              <p className="text-sm text-gray-600">Download, copy, or share the QR code with project volunteers</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">3. Track Attendance</h4>
              <p className="text-sm text-gray-600">Volunteers scan the QR code to check in and out of the project</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeCenter;