import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, MapPin, Calendar, Users, Clock, User } from 'lucide-react';
import { projectsAPI } from '../api/projects';
import { publicApiClient } from '../api/publicClient';
import type { Project } from '../types/api';
import type { RootState } from '../store';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  
  const getBackPath = () => {
    return user?.role?.toLowerCase() === 'leader' ? '/my-projects' : '/projects';
  };

  const handleJoinLeave = async () => {
    if (!project || !user) {
      console.log('No project or user:', { project: !!project, user: !!user });
      return;
    }
    
    console.log('Join/Leave action:', { 
      projectId: project.id, 
      isRegistered: project.is_user_registered,
      action: project.is_user_registered ? 'leave' : 'join'
    });
    
    setIsJoining(true);
    try {
      if (project.is_user_registered) {
        console.log('Leaving project...');
        await projectsAPI.leaveProject(project.id);
        setProject(prev => prev ? { ...prev, is_user_registered: false, volunteer_count: prev.volunteer_count - 1 } : null);
      } else {
        console.log('Joining project...');
        await projectsAPI.joinProject(project.id);
        setProject(prev => prev ? { ...prev, is_user_registered: true, volunteer_count: prev.volunteer_count + 1 } : null);
      }
      console.log('Action completed successfully');
    } catch (err: any) {
      console.error('Join/Leave error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.detail || 'Failed to update registration');
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      console.log('📄 Fetching project:', projectId);
      console.log('🔑 Token exists:', !!localStorage.getItem('access_token'));
      
      const data = await projectsAPI.getProject(Number(projectId));
      console.log('✅ Project loaded successfully:', data.title);
      setProject(data);
    } catch (err: any) {
      console.error('❌ Project fetch failed:', {
        status: err.response?.status,
        message: err.message,
        url: err.config?.url
      });
      
      if (err.response?.status === 401) {
        console.log('🚫 401 Unauthorized - token might be invalid');
      }
      
      setError('Failed to load project details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primaryColor-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Project not found'}</p>
          <button
            onClick={() => navigate(getBackPath())}
            className="bg-primaryColor-900 text-white px-4 py-2 rounded-lg hover:bg-accent-900 transition-colors"
          >
            {user?.role?.toLowerCase() === 'leader' ? 'Back to My Projects' : 'Back to Projects'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(getBackPath())}
          className="flex items-center gap-2 text-gray-600 hover:text-primaryColor-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {user?.role?.toLowerCase() === 'leader' ? 'Back to My Projects' : 'Back to Projects'}
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {project.image_url && (
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  project.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {project.status}
                </span>
              </div>
              

              
              {user && user.role?.toLowerCase() === 'volunteer' && (
                <button 
                  onClick={handleJoinLeave}
                  disabled={isJoining}
                  className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                    project.is_user_registered 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-primaryColor-900 hover:bg-accent-900 text-white'
                  } disabled:opacity-50`}
                >
                  {isJoining ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {project.is_user_registered ? 'Leaving...' : 'Joining...'}
                    </>
                  ) : (
                    project.is_user_registered ? 'Leave Project' : 'Join Project'
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>{project.location}, {project.sector}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>{new Date(project.datetime).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3" />
                  <span>{project.volunteer_count}/{project.required_volunteers} volunteers</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-3" />
                  <span>Organized by {project.admin_name}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3" />
                  <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Description</h2>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
            
            {/* Join/Leave button for authenticated users */}
            {user && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleJoinLeave}
                  disabled={isJoining}
                  className={`w-full px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    project.is_user_registered 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-primaryColor-900 hover:bg-accent-900 text-white'
                  } disabled:opacity-50`}
                >
                  {/* {isJoining ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {project.is_user_registered ? 'Leaving Project...' : 'Joining Project...'}
                    </>
                  ) : (
                    project.is_user_registered ? 'Leave Project' : 'Join Project'
                  )} */}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;