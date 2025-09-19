import { apiClient } from './client';
import type {
  Project,
  CreateProjectRequest,
  PaginatedResponse,
  DiscoveryResponse,
  SearchSuggestions,
  DashboardStats,
  Attendance
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
    const formData = new FormData();
    formData.append('image', image);
    const response = await apiClient.post(`/api/projects/projects/${projectId}/upload-image/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete project image
  deleteImage: async (projectId: number): Promise<void> => {
    await apiClient.delete(`/api/projects/projects/${projectId}/delete-image/`);
  }
};