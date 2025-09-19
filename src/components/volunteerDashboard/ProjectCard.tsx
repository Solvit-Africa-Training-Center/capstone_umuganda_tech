import React, { useState } from 'react';
import { MapPin, Calendar, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import type { Project } from '../../types/Volunteer';

interface ProjectCardProps {
  project: Project;
  onJoin?: (projectId: number) => void;
  onLeave?: (projectId: number) => void;
  onUploadImage?: (projectId: number, file: File) => Promise<any>;
  onDeleteImage?: (projectId: number) => Promise<void>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onJoin, onLeave }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Debug image URL and construct full URL if needed
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `https://umuganda-tech-backend.onrender.com${imageUrl}`;
  };

  const fullImageUrl = getImageUrl(project.image_url);

  React.useEffect(() => {
    console.log('Project:', project.title);
    console.log('Raw image_url:', project.image_url);
    console.log('Full image URL:', fullImageUrl);
  }, [project.image_url, fullImageUrl, project.title]);

  const getStatusConfig = (status: Project['status']) => {
    switch (status) {
      case 'ongoing':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: Clock,
          label: 'Ongoing'
        };
      case 'planned':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Calendar,
          label: 'Planned'
        };
      case 'completed':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle,
          label: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Calendar,
          label: status
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;
  const volunteerPercentage = (project.volunteer_count / project.required_volunteers) * 100;
  const isFullyBooked = project.volunteer_count >= project.required_volunteers;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {!imageError && fullImageUrl ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              </div>
            )}
            <img
              src={fullImageUrl}
              alt={project.title}
              className={`w-full h-full object-cover duration-300 group-hover:scale-105 transform transition-transform ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => {
                console.log('Image loaded successfully:', fullImageUrl);
                setImageLoaded(true);
              }}
              onError={(e) => {
                console.error('Image failed to load:', fullImageUrl, e);
                setImageError(true);
              }}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primaryColor-100 to-primaryColor-200 flex items-center justify-center">
            <div className="text-primaryColor-600">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${statusConfig.color}`}>
            <StatusIcon size={12} />
            <span>{statusConfig.label}</span>
          </span>
        </div>

        {/* Registration Status */}
        {project.is_user_registered && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full bg-primaryColor-600 text-white">
              <CheckCircle size={12} />
              <span>Joined</span>
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primaryColor-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {project.description}
          </p>
        </div>

        {/* Project Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={14} className="mr-2 text-gray-400" />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={14} className="mr-2 text-gray-400" />
            <span>{new Date(project.datetime).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User size={14} className="mr-2 text-gray-400" />
            <span>By {project.admin_name}</span>
          </div>
        </div>

        {/* Volunteer Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Volunteers</span>
            <span className={`font-medium ${
              isFullyBooked ? 'text-green-600' : 'text-gray-900'
            }`}>
              {project.volunteer_count}/{project.required_volunteers}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isFullyBooked ? 'bg-green-500' : 'bg-primaryColor-500'
              }`}
              style={{ width: `${Math.min(volunteerPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {project.sector}
            </span>
          </div>
          
          {project.status === 'ongoing' || project.status === 'planned' ? (
            project.is_user_registered ? (
              <button
                onClick={() => onLeave?.(project.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Leave
              </button>
            ) : (
              <button
                onClick={() => onJoin?.(project.id)}
                disabled={isFullyBooked}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isFullyBooked
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-white bg-primaryColor-600 hover:bg-primaryColor-700'
                }`}
              >
                {isFullyBooked ? 'Full' : 'Join'}
              </button>
            )
          ) : (
            <span className="text-sm text-gray-500">
              {project.status === 'completed' ? 'Completed' : 'Cancelled'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProjectCard);
