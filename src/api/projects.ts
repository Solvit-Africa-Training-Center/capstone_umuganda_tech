import { apiClient } from './client';
import type {
  Project,
  CreateProjectRequest,
  PaginatedResponse,
  DiscoveryResponse,
  SearchSuggestions,
  DashboardStats,
  LeaderDashboardStats,
  Attendance,
  ProjectRegistrationsResponse
} from '../types/api';

export const projectsAPI = {
  // Get all projects with filters
  getProjects: async (params?: {
    search?: string;
    status?: string;
    location?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Project>> => {
    const response = await apiClient.get('/api/projects/projects/', { params });
    return response.data;
  },

  // Get single project
  getProject: async (id: number): Promise<Project> => {
    const response = await apiClient.get(`/api/projects/projects/${id}/`);
    return response.data;
  },

  // Create project (leaders only)
  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post('/api/projects/projects/', data);
    return response.data;
  },

  // Update project
  updateProject: async (id: number, data: Partial<CreateProjectRequest>): Promise<Project> => {
    const response = await apiClient.put(`/api/projects/projects/${id}/`, data);
    return response.data;
  },

  // Delete project
  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/projects/projects/${id}/`);
  },

  // Get my projects
  getMyProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get('/api/projects/projects/my_projects/');
    return response.data;
  },

  // Discover projects
  discoverProjects: async (location?: string): Promise<DiscoveryResponse> => {
    const params = location ? { location } : {};
    const response = await apiClient.get('/api/projects/projects/discover/', { params });
    return response.data;
  },

  // Search suggestions
  getSearchSuggestions: async (query: string): Promise<SearchSuggestions> => {
    const response = await apiClient.get('/api/projects/projects/search_suggestions/', {
      params: { q: query }
    });
    return response.data;
  },

  // Sorted projects
  getSortedProjects: async (params?: {
    sort_by?: string;
    order?: 'asc' | 'desc';
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Project>> => {
    const response = await apiClient.get('/api/projects/projects/sorted_projects/', { params });
    return response.data;
  },

  // Generate QR code (leaders only)
  generateQRCode: async (projectId: number): Promise<{ message: string; qr_code: any }> => {
    const response = await apiClient.post(`/api/projects/projects/${projectId}/generate_qr_code/`);
    return response.data;
  },

  // Get existing QR code for project
  getQRCode: async (projectId: number): Promise<{ qr_code: any }> => {
    const response = await apiClient.get(`/api/projects/projects/${projectId}/get_qr_code/`);
    return response.data;
  },

  // Check in to project
  checkIn: async (qrCode: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/api/projects/checkin/', { qr_code: qrCode });
    return response.data;
  },

  // Check out from project
  checkOut: async (qrCode: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/api/projects/checkout/', { qr_code: qrCode });
    return response.data;
  },

  // Dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/api/projects/projects/dashboard/');
    return response.data;
  },

  // Leader dashboard stats
  getLeaderDashboardStats: async (): Promise<LeaderDashboardStats> => {
    const response = await apiClient.get('/api/projects/projects/dashboard/');
    return response.data;
  },

  // Register for project
  registerForProject: async (projectId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/api/projects/projects/${projectId}/register/`);
    return response.data;
  },

  // Unregister from project
  unregisterFromProject: async (projectId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/projects/projects/${projectId}/register/`);
    return response.data;
  },

  // Get project attendance
  getProjectAttendance: async (projectId: number): Promise<Attendance[]> => {
    const response = await apiClient.get(`/api/projects/projects/${projectId}/attendance/`);
    return response.data;
  },

  // Join project - using the correct endpoints from your API docs
  joinProject: async (projectId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/api/projects/projects/${projectId}/join/`);
    return response.data;
  },

  // Leave project - using the correct endpoints from your API docs  
  leaveProject: async (projectId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/projects/projects/${projectId}/leave/`);
    return response.data;
  },

  // Get all attendances
  getAttendances: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Attendance>> => {
    const response = await apiClient.get('/api/projects/attendances/', { params });
    return response.data;
  },

  // Upload project image
  uploadImage: async (projectId: number, image: File): Promise<Project> => {
    console.log('🔧 Creating FormData for upload...');
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      throw new Error('Invalid file type. Please upload a valid image file.');
    }
    
    // Try different field names that Django might expect
    const fieldNames = ['image', 'file', 'picture', 'photo'];
    
    for (const fieldName of fieldNames) {
      try {
        console.log(`🔄 Trying field name: '${fieldName}'`);
        
        const formData = new FormData();
        formData.append(fieldName, image, image.name);
        
        // Debug FormData contents
        console.log('🔍 FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value);
          if (value instanceof File) {
            console.log(`    File details: name=${value.name}, size=${value.size}, type=${value.type}`);
          }
        }
        
        console.log('🚀 Sending POST request to:', `/api/projects/projects/${projectId}/upload-image/`);
        
        // Explicitly configure for file upload
        const config = {
          headers: {
            // Don't set Content-Type - let browser set it with boundary
          },
          timeout: 30000, // 30 second timeout for file uploads
        };
        
        const response = await apiClient.post(`/api/projects/projects/${projectId}/upload-image/`, formData, config);
        console.log(`✅ Success with field name: '${fieldName}'`);
        return response.data;
        
      } catch (error: any) {
        console.log(`❌ Failed with field name '${fieldName}':`, error.response?.data);
        
        // If this is the last field name to try, throw the error
        if (fieldName === fieldNames[fieldNames.length - 1]) {
          throw error;
        }
        
        // If it's a "No image file provided" error, try the next field name
        if (error.response?.data?.error?.includes('No image file provided')) {
          continue;
        }
        
        // For other errors, don't retry
        throw error;
      }
    }
    
    throw new Error('Failed to upload with any field name');
  },

  // Delete project image
  deleteImage: async (projectId: number): Promise<Project> => {
    const response = await apiClient.delete(`/api/projects/projects/${projectId}/delete-image/`);
    return response.data;
  },

  // Generate QR code for project
  generateQRCode: async (projectId: number): Promise<any> => {
    const response = await apiClient.post(`/api/projects/projects/${projectId}/generate_qr_code/`);
    return response.data;
  },

  // Get existing QR code for project
  getQRCode: async (projectId: number): Promise<any> => {
    const response = await apiClient.get(`/api/projects/projects/${projectId}/get_qr_code/`);
    return response.data;
  },

  // View project registrations (leaders only)
  getProjectRegistrations: async (projectId: number): Promise<any[]> => {
    const response = await apiClient.get(`/api/projects/projects/${projectId}/registrations/`);
    return response.data;
  }
};