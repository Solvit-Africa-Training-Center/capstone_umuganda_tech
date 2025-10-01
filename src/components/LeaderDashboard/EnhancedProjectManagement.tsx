import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, Users, MapPin, Upload, X, Save, Image as ImageIcon } from 'lucide-react';
import { projectsAPI } from '../../api/projects';
import { useAuth } from '../../hooks/useAuth';
import type { Project, CreateProjectRequest } from '../../types/api';

interface EnhancedProjectManagementProps {
  projects: Project[];
  isLoading?: boolean;
  onProjectsUpdate: () => void;
}

interface ProjectFormData {
  title: string;
  description: string;
  location: string;
  sector: string;
  datetime: string;
  required_volunteers: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
}

const EnhancedProjectManagement: React.FC<EnhancedProjectManagementProps> = ({ 
  projects, 
  isLoading, 
  onProjectsUpdate 
}) => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    location: '',
    sector: '',
    datetime: '',
    required_volunteers: 10,
    status: 'planned'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProject, setDeletingProject] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      sector: '',
      datetime: '',
      required_volunteers: 10,
      status: 'planned'
    });
    setShowCreateForm(false);
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      location: project.location,
      sector: project.sector,
      datetime: new Date(project.datetime).toISOString().slice(0, 16),
      required_volunteers: project.required_volunteers,
      status: project.status as any
    });
    setShowCreateForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Authentication required. Please sign in again.');
      window.location.href = '/signin';
      return;
    }
    
    console.log('🔑 Token check passed, proceeding with project creation...');
    setIsSubmitting(true);

    try {
      const projectData = {
        ...formData,
        datetime: new Date(formData.datetime).toISOString().replace('.000Z', 'Z'),
        admin: user?.id // Add admin field for project creation
      };

      if (editingProject) {
        // Remove admin field for updates
        const { admin, ...updateData } = projectData;
        await projectsAPI.updateProject(editingProject.id, updateData);
      } else {
        await projectsAPI.createProject(projectData);
      }

      resetForm();
      onProjectsUpdate();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeletingProject(projectId);
    try {
      await projectsAPI.deleteProject(projectId);
      onProjectsUpdate();
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setDeletingProject(null);
    }
  };

  const handleImageUpload = async (projectId: number, file: File) => {
    setUploadingImage(projectId);
    try {
      await projectsAPI.uploadImage(projectId, file);
      onProjectsUpdate();
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleImageDelete = async (projectId: number) => {
    try {
      await projectsAPI.deleteImage(projectId);
      onProjectsUpdate();
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
        <button
          onClick={() => window.open('/create-project', '_blank')}
          className="flex items-center gap-2 bg-primaryColor-600 text-white px-4 py-2 rounded-lg hover:bg-primaryColor-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Edit Form Only */}
      {editingProject && showCreateForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Edit Project</h2>
            <button
              onClick={resetForm}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sector *
                </label>
                <select
                  required
                  value={formData.sector}
                  onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor-600 focus:border-transparent"
                >
                  <option value="">Select Sector</option>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Community">Community</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.datetime}
                  onChange={(e) => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Volunteers *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.required_volunteers}
                  onChange={(e) => setFormData(prev => ({ ...prev, required_volunteers: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor-600 focus:border-transparent"
                >
                  <option value="planned">Planned</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor-600 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primaryColor-600 text-white px-6 py-2 rounded-lg hover:bg-primaryColor-700 disabled:bg-gray-400 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Updating...' : 'Update Project'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Projects</h2>
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No projects created yet</p>
            <p className="text-sm text-gray-500 mb-4">Create your first project to start managing community activities</p>
            <button
              onClick={() => window.open('/create-project', '_blank')}
              className="bg-primaryColor-600 text-white px-6 py-2 rounded-lg hover:bg-primaryColor-700 transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(project.datetime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.volunteer_count || 0}/{project.required_volunteers}
                      </span>
                    </div>

                    {/* Project Image */}
                    {project.image_url && (
                      <div className="mt-3 relative inline-block">
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-32 h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleImageDelete(project.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {/* Image Upload */}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(project.id, file);
                        }}
                      />
                      <div className="p-2 text-gray-600 hover:text-blue-600 transition-colors" title="Upload Image">
                        {uploadingImage === project.id ? (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                      </div>
                    </label>

                    <button
                      onClick={() => window.open(`/project/${project.id}`, '_blank')}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="View Project"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                      title="Edit Project"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingProject === project.id}
                      className="p-2 text-gray-600 hover:text-red-600 disabled:opacity-50 transition-colors"
                      title="Delete Project"
                    >
                      {deletingProject === project.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedProjectManagement;