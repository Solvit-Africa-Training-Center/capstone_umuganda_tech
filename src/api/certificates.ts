import { apiClient } from './client';
import type { Certificate, PaginatedResponse } from '../types/api';

export const certificatesAPI = {
  // Get user certificates
  getCertificates: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Certificate>> => {
    const response = await apiClient.get('/api/projects/certificates/', { params });
    return response.data;
  },

  // Generate certificate for completed project
  generateCertificate: async (projectId: number): Promise<Certificate> => {
    const response = await apiClient.post(`/api/projects/certificates/generate/${projectId}/`);
    return response.data;
  },

  // Leader: Get all certificates for leader's projects
  getLeaderCertificates: async (): Promise<Certificate[]> => {
    const response = await apiClient.get('/api/projects/certificates/leader/');
    return response.data;
  },

  // Leader: Generate certificate for specific volunteer
  generateVolunteerCertificate: async (projectId: number, userId: number): Promise<Certificate> => {
    const response = await apiClient.post(`/api/projects/certificates/generate/${projectId}/`, { user_id: userId });
    return response.data;
  },

  // Leader: Bulk generate certificates for all project volunteers
  bulkGenerateCertificates: async (projectId: number): Promise<{ message: string; certificates: Certificate[] }> => {
    const response = await apiClient.post(`/api/projects/certificates/bulk-generate/${projectId}/`);
    return response.data;
  },

  // Download certificate
  downloadCertificate: async (certificateId: number): Promise<Blob> => {
    const response = await apiClient.get(`/api/projects/certificates/${certificateId}/download/`, {
      responseType: 'blob'
    });
    return response.data;
  }
};