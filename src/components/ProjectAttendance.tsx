import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QrCode, Users, Clock, Download, ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { projectsAPI } from '../api/projects';
import type { Project, Attendance } from '../types/api';

const ProjectAttendance: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
      fetchAttendance();
      fetchExistingQRCode();
    }
  }, [projectId]);

  const fetchExistingQRCode = async () => {
    await smartQRDisplay();
  };

  const smartQRDisplay = async () => {
    try {
      setIsGeneratingQR(true);
      
      // Try to get existing QR first
      let qrData;
      
      try {
        const existingData = await projectsAPI.getQRCode(Number(projectId));
        qrData = existingData.qr_code;
        
        if (qrData.is_expired) {
          // Generate new if expired
          const newData = await projectsAPI.generateQRCode(Number(projectId));
          qrData = newData.qr_code;
        }
      } catch (err: any) {
        // No QR exists, generate new
        const newData = await projectsAPI.generateQRCode(Number(projectId));
        qrData = newData.qr_code;
      }
      
      // Display QR code
      setQrCode(qrData.qr_image_url);
      
    } catch (error: any) {
      console.error('Error with QR code:', error);
      setError('Failed to load QR code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const fetchProjectData = async () => {
    try {
      const data = await projectsAPI.getProject(Number(projectId));
      setProject(data);
    } catch (err: any) {
      setError('Failed to load project');
      console.error('Fetch project error:', err);
    }
  };

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const data = await projectsAPI.getProjectAttendance(Number(projectId));
      // Handle both array and object responses
      let attendanceRecords = Array.isArray(data) ? data : data.attendances || [];
      
      // Fetch user details for each attendance record
      const attendanceWithUsers = await Promise.all(
        attendanceRecords.map(async (record: any) => {
          try {
            // If user is just an ID, fetch full user details
            if (typeof record.user === 'number') {
              const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/users/${record.user}/`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                  'Content-Type': 'application/json'
                }
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                return { ...record, user: userData };
              }
            }
            
            // If user is already an object or fetch failed, return as is
            return record;
          } catch (error) {
            console.error('Failed to fetch user details for attendance:', record.id, error);
            // Return with placeholder user data
            return {
              ...record,
              user: {
                id: record.user,
                first_name: 'Unknown',
                last_name: 'User',
                phone_number: 'No phone'
              }
            };
          }
        })
      );
      
      setAttendance(attendanceWithUsers);
    } catch (err: any) {
      setError('Failed to load attendance data');
      console.error('Fetch attendance error:', err);
      setAttendance([]); // Ensure it's always an array
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = async () => {
    await smartQRDisplay();
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${project?.title}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateHours = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return 'In Progress';
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 10) / 10;
    return `${hours}h`;
  };

  const attendanceStats = {
    total: Array.isArray(attendance) ? attendance.length : 0,
    checkedIn: Array.isArray(attendance) ? attendance.filter(a => a.check_in_time && !a.check_out_time).length : 0,
    completed: Array.isArray(attendance) ? attendance.filter(a => a.check_in_time && a.check_out_time).length : 0,
    totalHours: Array.isArray(attendance) ? attendance
      .filter(a => a.check_in_time && a.check_out_time)
      .reduce((sum, a) => {
        const hours = (new Date(a.check_out_time!).getTime() - new Date(a.check_in_time).getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0) : 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primaryColor-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/my-projects')}
            className="flex items-center gap-2 text-gray-600 hover:text-primaryColor-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Projects
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Project Attendance</h1>
              <p className="text-gray-600">{project?.title}</p>
            </div>
            
            <button
              onClick={fetchAttendance}
              className="flex items-center gap-2 text-gray-600 hover:text-primaryColor-900 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-3xl font-bold text-gray-800">{attendanceStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Currently Active</p>
                <p className="text-3xl font-bold text-green-600">{attendanceStats.checkedIn}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-800">{attendanceStats.completed}</p>
              </div>
              <XCircle className="w-8 h-8 text-gray-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-3xl font-bold text-purple-600">{Math.round(attendanceStats.totalHours)}h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QR Code Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Code</h2>
            
            {qrCode ? (
              <div className="text-center">
                <img 
                  src={qrCode} 
                  alt="Project QR Code" 
                  className="w-48 h-48 mx-auto mb-4 border rounded-lg"
                />
                <div className="space-y-2">
                  <button
                    onClick={downloadQRCode}
                    className="w-full flex items-center justify-center gap-2 bg-primaryColor-900 text-white py-2 px-4 rounded-lg hover:bg-accent-900 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download QR Code
                  </button>
                  <button
                    onClick={generateQRCode}
                    disabled={isGeneratingQR}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGeneratingQR ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Generate a QR code for volunteer check-in</p>
                <button
                  onClick={generateQRCode}
                  disabled={isGeneratingQR}
                  className="flex items-center justify-center gap-2 bg-primaryColor-900 text-white py-2 px-4 rounded-lg hover:bg-accent-900 transition-colors mx-auto"
                >
                  {isGeneratingQR ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      Generate QR Code
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Attendance List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Records</h2>
            
            {attendance.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No attendance records yet</p>
                <p className="text-sm text-gray-500">Volunteers will appear here after checking in</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {attendance.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primaryColor-900 rounded-full flex items-center justify-center text-white font-semibold">
                        {record.user?.first_name?.[0] || 'U'}{record.user?.last_name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {record.user?.first_name || 'Unknown'} {record.user?.last_name || 'User'}
                        </p>
                        <p className="text-sm text-gray-500">{record.user?.phone_number || 'No phone'}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Check-in</p>
                          <p className="font-medium">{formatTime(record.check_in_time)}</p>
                        </div>
                        
                        {record.check_out_time ? (
                          <div>
                            <p className="text-gray-600">Check-out</p>
                            <p className="font-medium">{formatTime(record.check_out_time)}</p>
                          </div>
                        ) : (
                          <div>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-medium">{calculateHours(record.check_in_time, record.check_out_time)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAttendance;