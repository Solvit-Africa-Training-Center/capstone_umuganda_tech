import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users, 
  FileText,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { projectsAPI } from '../api/projects';
import type { Project } from '../types/api';

const ProjectManagement: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
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
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const data = await projectsAPI.getProject(Number(projectId));
      setProject(data);
      
      // Populate form with existing data
      setFormData({
        title: data.title,
        description: data.description,
        sector: data.sector,
        datetime: data.datetime.slice(0, 16), // Format for datetime-local input
        location: data.location,
        required_volunteers: data.required_volunteers.toString(),
        status: data.status
      });
      
      if (data.image_url) {
        setImagePreview(data.image_url);
      }
    } catch (err: any) {
      console.error('Fetch project error:', err);
      navigate('/my-projects');
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
    
    if (!validateForm() || !projectId) return;
    
    setIsSaving(true);
    try {
      // Format datetime properly for backend
      const datetime = new Date(formData.datetime).toISOString();
      
      const updateData = {
        title: formData.title,
        description: formData.description,
        sector: formData.sector,
        datetime: datetime,
        location: formData.location,
        required_volunteers: parseInt(formData.required_volunteers),
        status: formData.status,
        admin: project?.admin || project?.created_by // Include admin field from existing project
      };
      
      console.log('Updating project with data:', updateData);
      const updatedProject = await projectsAPI.updateProject(Number(projectId), updateData);
      
      setProject(updatedProject);
      navigate('/my-projects');
    } catch (error: any) {
      console.error('Update project error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMsg = 'Failed to update project. Please try again.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else {
          // Handle field-specific errors
          const fieldErrors = Object.entries(error.response.data)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          if (fieldErrors) errorMsg = fieldErrors;
        }
      }
      
      setErrors({ general: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !projectId) return;
    
    setIsUploadingImage(true);
    try {
      const updatedProject = await projectsAPI.uploadImage(Number(projectId), selectedImage);
      setProject(updatedProject);
      setSelectedImage(null);
      setImagePreview(updatedProject.image_url);
    } catch (error: any) {
      console.error('Upload image error:', error);
      setErrors({ image: 'Failed to upload image' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageDelete = async () => {
    if (!projectId) return;
    
    try {
      await projectsAPI.deleteImage(Number(projectId));
      setImagePreview(null);
      setSelectedImage(null);
      if (project) {
        setProject({ ...project, image_url: undefined });
      }
    } catch (error: any) {
      console.error('Delete image error:', error);
      setErrors({ image: 'Failed to delete image' });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/my-projects')}
            className="flex items-center gap-2 text-gray-600 hover:text-primaryColor-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Projects
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primaryColor-900 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Project</h1>
              <p className="text-gray-600">Update your project details</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-8">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Tree Planting Initiative"
                  />
                </div>
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sector *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.sector}
                      onChange={(e) => handleChange('sector', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent ${
                        errors.sector ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Kigali"
                    />
                  </div>
                  {errors.sector && <p className="text-red-500 text-sm mt-1">{errors.sector}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Nyamirambo Park"
                    />
                  </div>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="datetime-local"
                      value={formData.datetime}
                      onChange={(e) => handleChange('datetime', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent ${
                        errors.datetime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.datetime && <p className="text-red-500 text-sm mt-1">{errors.datetime}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Volunteers *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="1"
                      value={formData.required_volunteers}
                      onChange={(e) => handleChange('required_volunteers', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent ${
                        errors.required_volunteers ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="50"
                    />
                  </div>
                  {errors.required_volunteers && <p className="text-red-500 text-sm mt-1">{errors.required_volunteers}</p>}
                </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor-900 focus:border-transparent resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your project goals, activities, and impact..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/my-projects')}
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Image Management */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Image</h2>
            
            {imagePreview ? (
              <div className="space-y-4">
                <img 
                  src={imagePreview} 
                  alt="Project" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={handleImageDelete}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No image uploaded</p>
              </div>
            )}

            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Choose Image
              </label>
              
              {selectedImage && (
                <button
                  onClick={handleImageUpload}
                  disabled={isUploadingImage}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 bg-primaryColor-900 text-white rounded-lg hover:bg-accent-900 disabled:bg-gray-400 transition-colors"
                >
                  {isUploadingImage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </>
                  )}
                </button>
              )}
            </div>
            
            {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;