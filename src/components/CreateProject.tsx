import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Calendar, MapPin, Users, FileText, ArrowLeft, Plus } from 'lucide-react';
import { projectsAPI } from '../api/projects';
import { useAuth } from '../hooks/useAuth';
import type { AppDispatch } from '../store';

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  
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
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!validateForm()) return;
    if (!user?.id) {
      setErrors({ general: 'User not authenticated' });
      return;
    }
    
    setIsLoading(true);
    try {
      // Format datetime to match backend expectation
      const formattedDatetime = formData.datetime ? 
        new Date(formData.datetime).toISOString().replace('.000Z', 'Z') : '';
      
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        sector: formData.sector.trim(),
        datetime: formattedDatetime,
        location: formData.location.trim(),
        required_volunteers: parseInt(formData.required_volunteers),
        admin: user.id,
        status: formData.status
      };
      
      console.log('CreateProject - Sending data:', projectData);
      
      const result = await projectsAPI.createProject(projectData);
      console.log('CreateProject - Success:', result);
      
      navigate('/my-projects');
    } catch (error: any) {
      console.error('CreateProject - Full error:', error);
      
      if (error.response) {
        const status = error.response.status;
        console.error('CreateProject - Response data:', JSON.stringify(error.response.data, null, 2));
        
        if (status === 500) {
          // Handle server errors with user-friendly message
          setErrors({ 
            general: 'Server error: There is a temporary issue with project creation. The backend team has been notified. Please try again later or contact support.' 
          });
        } else {
          // Handle validation errors (400, etc.)
          const backendErrors = error.response.data;
          if (backendErrors && typeof backendErrors === 'object') {
            const fieldErrors: Record<string, string> = {};
            
            Object.keys(backendErrors).forEach(field => {
              if (Array.isArray(backendErrors[field])) {
                fieldErrors[field] = backendErrors[field][0];
              } else if (typeof backendErrors[field] === 'string') {
                fieldErrors[field] = backendErrors[field];
              } else {
                fieldErrors[field] = JSON.stringify(backendErrors[field]);
              }
            });
            
            setErrors(fieldErrors);
          } else {
            setErrors({ general: `Server error: ${status}` });
          }
        }
      } else if (error.request) {
        setErrors({ general: 'Network error: Unable to reach server. Please check your connection.' });
      } else {
        setErrors({ general: `Request error: ${error.message}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-primaryColor-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primaryColor-900 rounded-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Create New Project</h1>
              <p className="text-gray-600">Start a new community initiative</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
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
                    placeholder="e.g., Kigali, Nyarugenge"
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

              <div className="md:col-span-2">
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
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-6 bg-primaryColor-900 text-white rounded-lg hover:bg-accent-900 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Project
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

export default CreateProject;