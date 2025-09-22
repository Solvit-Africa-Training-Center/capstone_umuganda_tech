import { apiClient } from './client';

export interface QRCode {
  id: number;
  project: number;
  code: string;
  expires_at: string;
  qr_image_url: string;
  is_expired: boolean;
}

export interface Attendance {
  id: number;
  user: number;
  project: number;
  check_in_time: string;
  check_out_time: string | null;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
}

export const attendanceAPI = {
  // Generate QR code for project (Leaders only)
  generateQRCode: async (projectId: number): Promise<{ message: string; qr_code: QRCode }> => {
    const response = await apiClient.post(`/api/projects/projects/${projectId}/generate_qr_code/`);
    return response.data;
  },

  // Check-in to project
  checkIn: async (qrCode: string): Promise<{ message: string; attendance: Attendance }> => {
    const response = await apiClient.post('/api/projects/checkin/', { qr_code: qrCode });
    return response.data;
  },

  // Check-out from project
  checkOut: async (qrCode: string): Promise<{ message: string; attendance: Attendance; new_badges?: Badge[] }> => {
    const response = await apiClient.post('/api/projects/checkout/', { qr_code: qrCode });
    return response.data;
  },

  // Get project attendance
  getProjectAttendance: async (projectId: number): Promise<{ project: string; attendances: Attendance[] }> => {
    const response = await apiClient.get(`/api/projects/projects/${projectId}/attendance/`);
    return response.data;
  },

  // List all attendances
  listAttendances: async (): Promise<Attendance[]> => {
    const response = await apiClient.get('/api/projects/attendances/');
    return response.data;
  }
};

// Certificate API
export const certificateAPI = {
  // List user certificates
  listCertificates: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/projects/certificates/');
    return response.data;
  },

  // Generate certificate for project
  generateCertificate: async (projectId: number): Promise<any> => {
    const response = await apiClient.post(`/api/projects/certificates/generate/${projectId}/`);
    return response.data;
  }
};