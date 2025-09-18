import React from 'react';
import { User, Award, Clock, FolderOpen, MapPin, Calendar, Target } from 'lucide-react';
import type { VolunteerProfile } from '../../types/volunteer';

interface VolunteerProfileProps {
  profile: VolunteerProfile | null;
  loading: boolean;
}

const VolunteerProfile: React.FC<VolunteerProfileProps> = ({ profile, loading }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-primaryColor-50 to-blue-50 rounded-lg shadow-sm border p-6 mb-6 animate-pulse">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="h-8 bg-gray-200 rounded w-12 mb-1 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-gradient-to-r from-primaryColor-50 to-blue-50 rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-primaryColor-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User size={36} className="text-primaryColor-600" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <Award size={12} className="text-white" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-sm text-gray-600 mb-1">{profile.email}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {profile.location && (
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.joinDate && (
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <Target className="text-primaryColor-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-primaryColor-600">{profile.projectsCompleted}</div>
            <div className="text-xs text-gray-600 font-medium">Completed</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-blue-600">{profile.hoursContributed}</div>
            <div className="text-xs text-gray-600 font-medium">Hours</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <FolderOpen className="text-green-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-green-600">{profile.totalProjects}</div>
            <div className="text-xs text-gray-600 font-medium">Total Projects</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <div className="w-6 h-6 bg-orange-500 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-600">{profile.activeProjects}</div>
            <div className="text-xs text-gray-600 font-medium">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(VolunteerProfile);