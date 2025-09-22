import { apiClient } from './client';

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon_url?: string;
  criteria: string;
  created_at: string;
}

export interface UserBadge {
  id: number;
  user: number;
  badge: Badge;
  earned_at: string;
  project?: number;
}

export const badgesAPI = {
  // Badge management
  getBadges: async (): Promise<Badge[]> => {
    const response = await apiClient.get('/api/users/badges/');
    return response.data;
  },

  createBadge: async (data: { name: string; description: string; criteria: string; icon_url?: string }): Promise<Badge> => {
    const response = await apiClient.post('/api/users/badges/', data);
    return response.data;
  },

  getBadge: async (id: number): Promise<Badge> => {
    const response = await apiClient.get(`/api/users/badges/${id}/`);
    return response.data;
  },

  updateBadge: async (id: number, data: Partial<Badge>): Promise<Badge> => {
    const response = await apiClient.put(`/api/users/badges/${id}/`, data);
    return response.data;
  },

  deleteBadge: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/users/badges/${id}/`);
  },

  // User badges management
  getUserBadges: async (): Promise<UserBadge[]> => {
    const response = await apiClient.get('/api/users/user-badges/');
    return response.data;
  },

  awardBadge: async (data: { user: number; badge: number; project?: number }): Promise<UserBadge> => {
    const response = await apiClient.post('/api/users/user-badges/', data);
    return response.data;
  },

  getUserBadge: async (id: number): Promise<UserBadge> => {
    const response = await apiClient.get(`/api/users/user-badges/${id}/`);
    return response.data;
  }
};