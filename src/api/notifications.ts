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

  // Get unread notifications
  getUnreadNotifications: async (): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get('/api/notifications/notifications/unread/');
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get('/api/notifications/notifications/unread/');
    return { count: response.data.count || response.data.length || 0 };
  },

  // Mark multiple notifications as read
  markMultipleAsRead: async (notificationIds: number[]): Promise<{ message: string }> => {
    const response = await apiClient.post('/api/notifications/notifications/mark_multiple_as_read/', {
      notification_ids: notificationIds
    });
    return response.data;
  },

  // Create notification
  createNotification: async (data: {
    user: number;
    title: string;
    message: string;
    notification_type: string;
    project?: number;
  }): Promise<Notification> => {
    const response = await apiClient.post('/api/notifications/notifications/', data);
    return response.data;
  },

  // Update notification
  updateNotification: async (id: number, data: Partial<Notification>): Promise<Notification> => {
    const response = await apiClient.put(`/api/notifications/notifications/${id}/`, data);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/notifications/notifications/${id}/`);
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