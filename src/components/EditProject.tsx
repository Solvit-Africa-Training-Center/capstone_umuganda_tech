import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, FileText, ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import { projectsAPI } from '../api/projects';
import { useAuth } from '../hooks/useAuth';
import type { Project } from '../types/api';

const EditProject: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: '',
    datetime: '',
    location: '',
    required_volunteers: '',
    status: 'planned' as const
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const projectData = await projectsAPI.getProject(Number(projectId));
      setProject(projectData);
      
      // Populate form with project data
      setFormData({
        title: projectData.title,
        description: projectData.description,
        sector: projectData.sector,
        datetime: new Date(projectData.datetime).toISOString().slice(0, 16),
        location: projectData.location,
        required_volunteers: projectData.required_volunteers.toString(),
        status: projectData.status as any
      });
    } catch (error) {
      console.error('Failed to fetch project:', error);
      setErrors({ general: 'Failed to load project data' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.sector.trim()) newErrors.sector = 'Sector is required';
    if (!formData.datetime) newErrors.datetime = 'Date and time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.required_volunteers || parseInt(formData.required_volunteers) < 1) {
      newErrors.required_volunteers = 'At least 1 volunteer is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !project || !projectId) {
      console.error('Missing required data:', { project: !!project, projectId });
      return;
    }
    
    setIsSaving(true);
    try {
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        sector: formData.sector.trim(),
        datetime: new Date(formData.datetime).toISOString().replace('.000Z', 'Z'),
        location: formData.location.trim(),
        required_volunteers: parseInt(formData.required_volunteers),
        status: formData.status
      };
      
      console.log('Updating project with ID:', projectId);
      const updatedProject = await projectsAPI.updateProject(Number(projectId), updateData);
      setProject(updatedProject);
      
      // Navigate back to project management
      navigate('/leader-dashboard');
    } catch (error: any) {
      console.error('Failed to update project:', error);
      if (error.response?.status === 404) {
        setErrors({ general: 'Update endpoint not available yet' });
      } else {
        setErrors({ general: 'Failed to update project. Please try again.' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!project || !projectId) {
      console.error('Missing project data for image upload');
      return;
    }
    
    setUploadingImage(true);
    try {
      console.log('📸 Uploading image for project:', projectId);
      console.log('📸 File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        sizeInMB: (file.size / 1024 / 1024).toFixed(2) + 'MB'
      });
      
      const updatedProject = await projectsAPI.uploadImage(Number(projectId), file);
      setProject(updatedProject);
      console.log('✅ Image uploaded successfully');
    } catch (error: any) {
      console.error('❌ Failed to upload image:', error);
      console.error('❌ Error details:', error.response?.data);
      
      let errorMessage = 'Failed to upload image';
      
      if (error.message && error.message.includes('File too large')) {
        errorMessage = error.message;
      } else if (error.message && error.message.includes('Invalid file type')) {
        errorMessage = error.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Image upload endpoint not available yet';
      } else if (error.response?.status === 400) {
        const backendError = error.response?.data;
        if (typeof backendError === 'string') {
          errorMessage = backendError;
        } else if (backendError?.detail) {
          errorMessage = backendError.detail;
        } else if (backendError?.image) {
          errorMessage = Array.isArray(backendError.image) ? backendError.image[0] : backendError.image;
        } else {
          errorMessage = `Bad request - ${JSON.stringify(backendError) || 'file may be invalid or too large'}`;
        }
      } else if (error.response?.status === 413) {
        errorMessage = 'File too large for server';
      }
      
      setErrors({ image: errorMessage });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async () => {
    if (!project || !projectId || !confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const updatedProject = await projectsAPI.deleteImage(Number(projectId));
      setProject(updatedProject);
    } catch (error: any) {
      console.error('Failed to delete image:', error);
      if (error.response?.status === 404) {
        setErrors({ image: 'Image delete endpoint not available yet' });
      } else {
        setErrors({ image: 'Failed to delete image' });
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primaryColor-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <button
            onClick={() => navigate('/leader-dashboard')}
            className="bg-primaryColor-900 text-white px-6 py-2 rounded-lg hover:bg-accent-900 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/leader-dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-primaryColor-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primaryColor-900 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Project</h1>
              <p className="text-gray-600">Update your community initiative</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          {/* Project Image Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Image</h3>
            
            {project.image_url ? (
              <div className="relative inline-block">
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-64 h-40 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={handleImageDelete}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Delete Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No image uploaded</p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Validate file size (5MB max)
                      const maxSize = 5 * 1024 * 1024;
                      if (file.size > maxSize) {
                        setErrors({ image: 'File too large. Maximum size is 5MB.' });
                        return;
                      }
                      
                      // Clear any previous errors
                      setErrors(prev => ({ ...prev, image: '' }));
                      handleImageUpload(file);
                    }
                  }}
                />
                <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors inline-flex">
                  {uploadingImage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {project.image_url ? 'Change Image' : 'Upload Image'}
                    </>
                  )}
                </div>
              </label>
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sector *
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleChange('sector', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent ${
                    errors.sector ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Sector</option>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Community">Community</option>
                </select>
                {errors.sector && <p className="text-red-500 text-sm mt-1">{errors.sector}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.datetime}
                  onChange={(e) => handleChange('datetime', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent ${
                    errors.datetime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.datetime && <p className="text-red-500 text-sm mt-1">{errors.datetime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Volunteers *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.required_volunteers}
                  onChange={(e) => handleChange('required_volunteers', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent ${
                    errors.required_volunteers ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.required_volunteers && <p className="text-red-500 text-sm mt-1">{errors.required_volunteers}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent"
                >
                  <option value="planned">Planned</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/leader-dashboard')}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 px-6 bg-primaryColor-900 text-white rounded-lg hover:bg-accent-900 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject;