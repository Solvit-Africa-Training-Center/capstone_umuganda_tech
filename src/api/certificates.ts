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
  }
};