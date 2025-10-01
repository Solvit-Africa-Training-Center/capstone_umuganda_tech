import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, Users, MapPin, Upload, X, FolderOpen } from 'lucide-react';
import { projectsAPI } from '../../api/projects';
import type { Project } from '../../types/api';

interface SimpleProjectManagementProps {
  projects: Project[];
  isLoading?: boolean;
  onProjectsUpdate: () => void;
}

const SimpleProjectManagement: React.FC<SimpleProjectManagementProps> = ({ 
  projects, 
  isLoading, 
  onProjectsUpdate 
}) => {
  const [deletingProject, setDeletingProject] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  const handleDelete = async (projectId: number) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setDeletingProject(projectId);
    try {
      await projectsAPI.deleteProject(projectId);
      onProjectsUpdate();
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert('Delete endpoint not available yet');
      } else {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project');
      }
    } finally {
      setDeletingProject(null);
    }
  };

  const handleImageUpload = async (projectId: number, file: File) => {
    setUploadingImage(projectId);
    try {
      await projectsAPI.uploadImage(projectId, file);
      onProjectsUpdate();
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      if (error.response?.status === 404) {
        alert('Image upload endpoint not available yet');
      } else {
        alert('Failed to upload image');
      }
    } finally {
      setUploadingImage(null);
    }
  };

  const handleImageDelete = async (projectId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      await projectsAPI.deleteImage(projectId);
      onProjectsUpdate();
    } catch (error: any) {
      console.error('Failed to delete image:', error);
      if (error.response?.status === 404) {
        alert('Image delete endpoint not available yet');
      } else {
        alert('Failed to delete image');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primaryColor-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primaryColor-600 via-primaryColor-700 to-primaryColor-800 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
          
          <div className="relative flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Project Management</h1>
                <p className="text-primaryColor-100 text-lg">Manage your community initiatives and track progress</p>
              </div>
            </div>
            
            <button
              onClick={() => window.open('/create-project', '_blank')}
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold border border-white/30"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Project</span>
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Projects</h2>
              <p className="text-gray-600">Manage and track all your community initiatives</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primaryColor-50 px-4 py-2 rounded-lg">
                <span className="text-primaryColor-800 font-semibold">{projects.length} Total Projects</span>
              </div>
            </div>
          </div>
        
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-primaryColor-100 to-primaryColor-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-12 h-12 text-primaryColor-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No projects yet</h3>
              <p className="text-gray-600 mb-6 text-lg max-w-md mx-auto">Start your journey by creating your first community project and make a difference!</p>
              <button
                onClick={() => window.open('/create-project', '_blank')}
                className="bg-gradient-to-r from-primaryColor-600 to-primaryColor-700 text-white px-8 py-4 rounded-xl hover:from-primaryColor-700 hover:to-primaryColor-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 overflow-hidden group hover:scale-[1.02] hover:bg-white">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-primaryColor-700 transition-colors">{project.title}</h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(project.status)}`}>
                        {project.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
                    
                    {/* Project Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs font-medium text-blue-800">Date</div>
                        <div className="text-sm font-bold text-blue-900">{new Date(project.datetime).toLocaleDateString()}</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <MapPin className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <div className="text-xs font-medium text-green-800">Location</div>
                        <div className="text-sm font-bold text-green-900">{project.location}</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <div className="text-xs font-medium text-purple-800">Volunteers</div>
                        <div className="text-sm font-bold text-purple-900">{project.volunteer_count || 0}/{project.required_volunteers}</div>
                      </div>
                    </div>

                    {/* Project Image */}
                    {project.image_url && (
                      <div className="mb-4 relative">
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                        <button
                          onClick={() => handleImageDelete(project.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          title="Delete Image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Image Upload */}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(project.id, file);
                            }
                          }}
                        />
                        <div className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg transition-colors border border-green-200 hover:border-green-300" title="Upload Image">
                          {uploadingImage === project.id ? (
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          <span className="text-xs font-medium">Upload</span>
                        </div>
                      </label>

                      <button
                        onClick={() => window.open(`/project/${project.id}`, '_blank')}
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                        title="View Project"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-xs font-medium">View</span>
                      </button>
                      
                      <button
                        onClick={() => window.open(`/project/${project.id}/edit`, '_blank')}
                        className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-2 rounded-lg transition-colors border border-amber-200 hover:border-amber-300"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-xs font-medium">Edit</span>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingProject === project.id}
                        className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg transition-colors border border-red-200 hover:border-red-300 disabled:opacity-50"
                        title="Delete Project"
                      >
                        {deletingProject === project.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span className="text-xs font-medium">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleProjectManagement;