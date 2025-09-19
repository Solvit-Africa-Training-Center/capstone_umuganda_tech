import React, { useEffect, useState } from 'react';
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

  const handleGenerateCertificate = async (projectId: number) => {
    setGeneratingCert(projectId);
    try {
      const response = await certificateAPI.generateCertificate(projectId);
      // Refresh certificates after generation
      dispatch(fetchUserCertificates());
      // Download the certificate if URL is provided
      if (response.certificate_url) {
        window.open(response.certificate_url, '_blank');
      }
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setGeneratingCert(null);
    }
  };

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
          </div>
        </div>
      </div>

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
                  {skill.name}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills added yet</p>
            )}
          </div>
        </div>

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
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No badges earned yet</p>
                <p className="text-gray-400 text-sm">Complete projects to earn your first badge!</p>
              </div>
            )}
          </div>
        </div>

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
                          Issued: {new Date(cert.issued_date || cert.created_at).toLocaleDateString()}
                        </p>
                        {cert.description && (
                          <p className="text-sm text-gray-700">{cert.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {cert.certificate_url ? (
                        <button
                          onClick={() => handleDownloadCertificate(cert.certificate_url, cert.project_title)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Download size={14} />
                          Download
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGenerateCertificate(cert.project_id || cert.id)}
                          disabled={generatingCert === (cert.project_id || cert.id)}
                          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                        >
                          {generatingCert === (cert.project_id || cert.id) ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FileText size={14} />
                          )}
                          {generatingCert === (cert.project_id || cert.id) ? 'Generating...' : 'Generate'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No certificates yet</p>
                <p className="text-gray-400 text-sm">Complete projects and check out to earn certificates!</p>
              </div>
            )}
          </div>
        </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;