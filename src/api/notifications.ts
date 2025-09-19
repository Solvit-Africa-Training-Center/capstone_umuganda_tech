import { apiClient } from './client';
import type { Notification, PaginatedResponse } from '../types/api';

export const notificationsAPI = {
  // Get user notifications
  getNotifications: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get('/api/notifications/notifications/', { params });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/api/notifications/notifications/${id}/mark_as_read/`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/api/notifications/notifications/mark_all_as_read/');
    return response.data;
  },

  // Get notification logs
  getLogs: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get('/api/notifications/logs/', { params });
    return response.data;
  },

  // Get user badges (notifications endpoint)
  getUserBadges: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get('/api/notifications/user-badges/', { params });
    return response.data;
  }
};