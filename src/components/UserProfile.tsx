import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {  
  Award, 
  BookOpen, 
  Bell, 
  Download, 
  FileText, 
  Camera, 
  Edit3, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Settings,
  Shield,
  Activity,
  TrendingUp
} from 'lucide-react';
import type { RootState } from '../store';
import { usersAPI } from '../api/users';
import type { User, Badge, Skill, Certificate } from '../types/api';

const UserProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notifications, setNotifications] = useState<{message: string; date: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    sector: ''
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [generatingCert, setGeneratingCert] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalHours: 0,
    rank: 0
  });

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('No access token found');
        return;
      }
      
      // Fetch user profile
      const userProfile = await usersAPI.getUser(user!.id);
      setProfile(userProfile);
      
      // Initialize edit form with current data
      setEditForm({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
        sector: userProfile.sector || ''
      });
      
      // Fetch user skills
      const userSkills = await usersAPI.getUserSkills();
      setSkills(userSkills);
      
      // Fetch user badges using existing endpoint
      try {
        const userBadges = await usersAPI.getUserBadges();
        setBadges(userBadges);
      } catch (error) {
        console.error('Failed to fetch badges:', error);
        setBadges([]);
      }
      
      // Fetch certificates
      const userCertificates = await fetchUserCertificates();
      setCertificates(userCertificates);
      
      // Fetch notifications (placeholder)
      setNotifications([
        { message: 'Welcome to UmugandaTech!', date: new Date().toLocaleDateString() },
        { message: 'Profile updated successfully', date: new Date().toLocaleDateString() }
      ]);
      
      // Calculate stats
      setStats({
        totalProjects: userCertificates.length,
        completedProjects: userCertificates.filter((c: any) => c.status === 'completed').length,
        totalHours: userCertificates.reduce((sum: number, c: any) => sum + (c.hours || 0), 0),
        rank: Math.floor(Math.random() * 100) + 1 // Placeholder
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCertificates = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://umuganda-tech-backend.onrender.com/api/projects/certificates/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data : data.results || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      return [];
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      console.log('Uploading avatar...', file.name);
      
      const updatedUser = await usersAPI.uploadAvatar(file);
      console.log('Avatar upload response:', updatedUser);
      
      // Update both profile state and refresh user data
      setProfile(updatedUser);
      
      // Don't refresh all data, just update the avatar URL
      // await fetchUserData();
      
      // Add success notification
      setNotifications(prev => [{
        message: 'Avatar updated successfully!',
        date: new Date().toLocaleDateString()
      }, ...prev]);
      
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      
      // Add error notification
      setNotifications(prev => [{
        message: 'Failed to upload avatar. Please try again.',
        date: new Date().toLocaleDateString()
      }, ...prev]);
    } finally {
      setUploadingAvatar(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Validate required fields
      if (!editForm.first_name.trim() || !editForm.last_name.trim()) {
        setNotifications(prev => [{
          message: 'First name and last name are required.',
          date: new Date().toLocaleDateString()
        }, ...prev]);
        return;
      }

      // Prepare clean data for API
      const updateData = {
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        email: editForm.email.trim() || undefined,
        sector: editForm.sector.trim() || undefined
      };

      console.log('Updating profile with data:', updateData);
      
      const updatedUser = await usersAPI.updateUser(user!.id, updateData);
      console.log('Profile update response:', updatedUser);
      
      setProfile(updatedUser);
      setIsEditing(false);
      
      // Add success notification
      setNotifications(prev => [{
        message: 'Profile updated successfully!',
        date: new Date().toLocaleDateString()
      }, ...prev]);
      
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.first_name) {
          errorMessage = `First name: ${errorData.first_name[0]}`;
        } else if (errorData.email) {
          errorMessage = `Email: ${errorData.email[0]}`;
        }
      }
      
      // Add error notification
      setNotifications(prev => [{
        message: errorMessage,
        date: new Date().toLocaleDateString()
      }, ...prev]);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setUploadingAvatar(true);
      await usersAPI.deleteAvatar();
      
      // Clear avatar from both profile and user state
      setProfile(prev => prev ? { ...prev, avatar_url: '' } : null);
      
      // Add success notification
      setNotifications(prev => [{
        message: 'Avatar removed successfully!',
        date: new Date().toLocaleDateString()
      }, ...prev]);
      
    } catch (error) {
      console.error('Failed to delete avatar:', error);
      
      // Add error notification
      setNotifications(prev => [{
        message: 'Failed to remove avatar. Please try again.',
        date: new Date().toLocaleDateString()
      }, ...prev]);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleGenerateCertificate = async (projectId: number) => {
    setGeneratingCert(projectId);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://umuganda-tech-backend.onrender.com/api/projects/certificates/generate/${projectId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Certificate generated:', result);
        // Refresh certificates
        const updatedCertificates = await fetchUserCertificates();
        setCertificates(updatedCertificates);
      }
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setGeneratingCert(null);
    }
  };

  const handleDownloadCertificate = async (certificateId: number, projectTitle: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://umuganda-tech-backend.onrender.com/api/projects/certificates/${certificateId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${projectTitle}-certificate.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download certificate:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primaryColor-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primaryColor-50 to-primaryColor-100 rounded-2xl p-8 border border-primaryColor-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {(profile?.avatar_url || user?.avatar_url) && (profile?.avatar_url !== '' && user?.avatar_url !== '') ? (
                <img 
                  src={profile?.avatar_url || user?.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onLoad={() => console.log('Avatar loaded successfully')}
                  onError={(e) => {
                    console.error('Avatar image failed to load:', profile?.avatar_url || user?.avatar_url);
                    console.log('Falling back to initials');
                    // Force re-render by clearing avatar URL
                    setProfile(prev => prev ? { ...prev, avatar_url: '' } : null);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primaryColor-600 to-primaryColor-800 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-0 right-0 flex gap-1">
              <label className="bg-primaryColor-600 text-white p-2 rounded-full cursor-pointer hover:bg-primaryColor-700 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </label>
              {(profile?.avatar_url || user?.avatar_url) && (
                <button
                  onClick={handleDeleteAvatar}
                  disabled={uploadingAvatar}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                  title="Remove avatar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                    className="text-2xl font-bold bg-white border border-gray-300 rounded px-2 py-1"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                    className="text-2xl font-bold bg-white border border-gray-300 rounded px-2 py-1"
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <h1 className="text-3xl font-bold text-gray-800">
                  {profile?.first_name || user?.first_name} {profile?.last_name || user?.last_name}
                </h1>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (isEditing) {
                      handleUpdateProfile();
                    } else {
                      setIsEditing(true);
                      setEditForm({
                        first_name: profile?.first_name || user?.first_name || '',
                        last_name: profile?.last_name || user?.last_name || '',
                        email: profile?.email || user?.email || '',
                        sector: profile?.sector || user?.sector || ''
                      });
                    }
                  }}
                  className="p-2 text-gray-600 hover:text-primaryColor-600 transition-colors"
                  title={isEditing ? 'Save changes' : 'Edit profile'}
                >
                  {isEditing ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Edit3 className="w-5 h-5" />
                  )}
                </button>
                
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Cancel editing"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white border border-gray-300 rounded px-2 py-1 flex-1"
                    placeholder="Email address"
                  />
                ) : (
                  <span>{profile?.email || user?.email || 'No email provided'}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{user?.phone_number}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.sector}
                    onChange={(e) => setEditForm(prev => ({ ...prev, sector: e.target.value }))}
                    className="bg-white border border-gray-300 rounded px-2 py-1 flex-1"
                    placeholder="Sector/Location"
                  />
                ) : (
                  <span>{profile?.sector || user?.sector || 'No sector specified'}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user?.created_at || '').toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                user?.role === 'Leader' 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}>
                {user?.role === 'Leader' ? '👑 Leader' : '🤝 Volunteer'}
              </span>
              
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200">
                Rank #{stats.rank}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalProjects}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-800">{stats.completedProjects}</p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hours Contributed</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalHours}h</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Badges Earned</p>
              <p className="text-3xl font-bold text-gray-800">{badges.length}</p>
            </div>
            <Shield className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-500" />
              Skills & Expertise
            </h2>
            <span className="text-sm text-gray-500">{skills.length} skills</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {Array.isArray(skills) && skills.length > 0 ? (
              skills.map((skill: Skill, index: number) => (
                <span 
                  key={skill.id || index} 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:shadow-md transition-shadow"
                >
                  {skill.name}
                </span>
              ))
            ) : (
              <div className="text-center py-8 w-full">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No skills added yet</p>
                <p className="text-gray-400 text-sm">Add skills to showcase your expertise</p>
              </div>
            )}
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Achievements & Badges
            </h2>
            <span className="text-sm text-gray-500">{badges.length} earned</span>
          </div>
          
          <div className="space-y-4">
            {Array.isArray(badges) && badges.length > 0 ? (
              badges.map((badge: Badge & { earned_date?: string }) => (
                <div key={badge.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    {badge.icon_url ? (
                      <img src={badge.icon_url} alt={badge.name} className="w-8 h-8" />
                    ) : (
                      <Award className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{badge.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{badge.description}</p>
                    {badge.earned_date && (
                      <p className="text-xs text-orange-600 font-medium">
                        🏆 Earned {new Date(badge.earned_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">No badges earned yet</p>
                <p className="text-gray-400 text-sm">Complete projects and contribute to earn your first badge!</p>
              </div>
            )}
          </div>
        </div>

        {/* Certificates Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-500" />
              Certificates & Awards
            </h2>
            <span className="text-sm text-gray-500">{certificates.length} earned</span>
          </div>
          
          <div className="space-y-4">
            {Array.isArray(certificates) && certificates.length > 0 ? (
              certificates.map((cert: any) => (
                <div key={cert.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{cert.project_title || cert.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Issued: {new Date(cert.issued_date || cert.created_at).toLocaleDateString()}
                        </p>
                        {cert.description && (
                          <p className="text-sm text-gray-700">{cert.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {cert.certificate_url || cert.file_url ? (
                        <button
                          onClick={() => handleDownloadCertificate(cert.id, cert.project_title || cert.title)}
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGenerateCertificate(cert.project_id || cert.id)}
                          disabled={generatingCert === (cert.project_id || cert.id)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {generatingCert === (cert.project_id || cert.id) ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                          {generatingCert === (cert.project_id || cert.id) ? 'Generating...' : 'Generate'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">No certificates yet</p>
                <p className="text-gray-400 text-sm">Complete projects to earn your first certificate!</p>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-red-500" />
              Recent Activity
            </h2>
            <button
              onClick={() => setNotifications([])}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification: any, index: number) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">No recent activity</p>
              <p className="text-gray-400 text-sm">Your notifications and updates will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;