import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { useDispatch, useSelector } from 'react-redux';
import { User, Award, BookOpen, Bell, Download, FileText } from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import { fetchUserProfile, fetchUserSkills, fetchUserBadges, fetchUserCertificates, fetchNotifications } from '../store/userSlice';
import { certificateAPI } from '../api/attendance';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, skills, badges, certificates, notifications, isLoading } = useSelector((state: RootState) => state.user);
  const [generatingCert, setGeneratingCert] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
      dispatch(fetchUserSkills());
      dispatch(fetchUserBadges());
      dispatch(fetchUserCertificates());
      dispatch(fetchNotifications());
    }
  }, [dispatch, user?.id]);
=======
import { useSelector } from 'react-redux';
import { 
  User, 
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

const UserProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [badges, setBadges] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
      
      // Fetch user profile
      const userProfile = await usersAPI.getUser(user.id);
      setProfile(userProfile);
      
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
      
      // Fetch certificates (placeholder)
      const userCertificates = await fetchUserCertificates();
      setCertificates(userCertificates);
      
      // Calculate stats
      setStats({
        totalProjects: userCertificates.length,
        completedProjects: userCertificates.filter(c => c.status === 'completed').length,
        totalHours: userCertificates.reduce((sum, c) => sum + (c.hours || 0), 0),
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
      const response = await fetch('http://localhost:8000/api/projects/certificates/', {
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
      const updatedUser = await usersAPI.uploadAvatar(file);
      setProfile(updatedUser);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      const updatedUser = await usersAPI.updateUser(user.id, updatedData);
      setProfile(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
>>>>>>> main

  const handleGenerateCertificate = async (projectId: number) => {
    setGeneratingCert(projectId);
    try {
<<<<<<< HEAD
      const response = await certificateAPI.generateCertificate(projectId);
      // Refresh certificates after generation
      dispatch(fetchUserCertificates());
      // Download the certificate if URL is provided
      if (response.certificate_url) {
        window.open(response.certificate_url, '_blank');
=======
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/projects/certificates/generate/${projectId}/`, {
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
>>>>>>> main
      }
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setGeneratingCert(null);
    }
  };

<<<<<<< HEAD
  const handleDownloadCertificate = (certificateUrl: string, projectTitle: string) => {
    const link = document.createElement('a');
    link.href = certificateUrl;
    link.download = `${projectTitle}-certificate.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <div className="flex justify-center p-8">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <User size={40} className="text-gray-500" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.first_name} {profile?.last_name}</h1>
            <p className="text-gray-600">{profile?.email}</p>
            <p className="text-gray-600">{profile?.phone_number}</p>
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mt-2">
              {profile?.role}
            </span>
=======
  const handleDownloadCertificate = async (certificateId: number, projectTitle: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/projects/certificates/${certificateId}/`, {
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
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primaryColor-600 to-primaryColor-800 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 bg-primaryColor-600 text-white p-2 rounded-full cursor-pointer hover:bg-primaryColor-700 transition-colors shadow-lg">
              <Camera className="w-4 h-4" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploadingAvatar}
              />
            </label>
            
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">
                {user?.first_name} {user?.last_name}
              </h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-600 hover:text-primaryColor-600 transition-colors"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user?.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{user?.phone_number}</span>
              </div>
              {user?.sector && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{user.sector}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user?.created_at || '').toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                user?.role?.toLowerCase() === 'leader' 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}>
                {user?.role === 'leader' ? '👑 Leader' : '🤝 Volunteer'}
              </span>
              
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200">
                Rank #{stats.rank}
              </span>
            </div>
>>>>>>> main
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="text-yellow-500" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(skills) && skills.length > 0 ? (
              skills.map((skill) => (
                <span key={skill.id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
=======
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
              skills.map((skill, index) => (
                <span 
                  key={skill.id || index} 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:shadow-md transition-shadow"
                >
>>>>>>> main
                  {skill.name}
                </span>
              ))
            ) : (
<<<<<<< HEAD
              <p className="text-gray-500">No skills added yet</p>
=======
              <div className="text-center py-8 w-full">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No skills added yet</p>
                <p className="text-gray-400 text-sm">Add skills to showcase your expertise</p>
              </div>
>>>>>>> main
            )}
          </div>
        </div>

<<<<<<< HEAD
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="text-purple-500" />
            Badges ({Array.isArray(badges) ? badges.length : 0})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.isArray(badges) && badges.length > 0 ? (
              badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    {badge.icon_url ? (
                      <img src={badge.icon_url} alt={badge.name} className="w-8 h-8" />
                    ) : (
                      <Award className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{badge.name}</p>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                    {badge.earned_date && (
                      <p className="text-xs text-purple-600 mt-1">
                        Earned: {new Date(badge.earned_date).toLocaleDateString()}
=======
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
              badges.map((badge) => (
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
>>>>>>> main
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
<<<<<<< HEAD
              <div className="col-span-2 text-center py-8">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No badges earned yet</p>
                <p className="text-gray-400 text-sm">Complete projects to earn your first badge!</p>
=======
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">No badges earned yet</p>
                <p className="text-gray-400 text-sm">Complete projects and contribute to earn your first badge!</p>
>>>>>>> main
              </div>
            )}
          </div>
        </div>

<<<<<<< HEAD
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="text-blue-500" />
            Certificates ({Array.isArray(certificates) ? certificates.length : 0})
          </h2>
          <div className="space-y-4">
            {Array.isArray(certificates) && certificates.length > 0 ? (
              certificates.map((cert) => (
                <div key={cert.id} className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{cert.project_title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
=======
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
              certificates.map((cert) => (
                <div key={cert.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{cert.project_title || cert.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">
>>>>>>> main
                          Issued: {new Date(cert.issued_date || cert.created_at).toLocaleDateString()}
                        </p>
                        {cert.description && (
                          <p className="text-sm text-gray-700">{cert.description}</p>
                        )}
                      </div>
                    </div>
<<<<<<< HEAD
                    <div className="flex flex-col gap-2">
                      {cert.certificate_url ? (
                        <button
                          onClick={() => handleDownloadCertificate(cert.certificate_url, cert.project_title)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Download size={14} />
=======
                    
                    <div className="flex gap-2">
                      {cert.certificate_url || cert.file_url ? (
                        <button
                          onClick={() => handleDownloadCertificate(cert.id, cert.project_title || cert.title)}
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
>>>>>>> main
                          Download
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGenerateCertificate(cert.project_id || cert.id)}
                          disabled={generatingCert === (cert.project_id || cert.id)}
<<<<<<< HEAD
                          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
=======
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
>>>>>>> main
                        >
                          {generatingCert === (cert.project_id || cert.id) ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
<<<<<<< HEAD
                            <FileText size={14} />
=======
                            <FileText className="w-4 h-4" />
>>>>>>> main
                          )}
                          {generatingCert === (cert.project_id || cert.id) ? 'Generating...' : 'Generate'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
<<<<<<< HEAD
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No certificates yet</p>
                <p className="text-gray-400 text-sm">Complete projects and check out to earn certificates!</p>
=======
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">No certificates yet</p>
                <p className="text-gray-400 text-sm">Complete projects to earn your first certificate!</p>
>>>>>>> main
              </div>
            )}
          </div>
        </div>

<<<<<<< HEAD
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="text-red-500" />
            Notifications
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {Array.isArray(notifications) && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No notifications</p>
            )}
=======
        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-red-500" />
              Recent Activity
            </h2>
            <span className="text-sm text-gray-500">All caught up</span>
          </div>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">No recent activity</p>
            <p className="text-gray-400 text-sm">Your notifications and updates will appear here</p>
>>>>>>> main
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;