import { apiClient } from './client';
import type { User, Skill, Badge, PaginatedResponse } from '../types/api';

export const usersAPI = {
  // User management
  getUsers: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get('/api/users/users/', { params });
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/api/users/users/${id}/`);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/api/users/users/${id}/`, data);
    return response.data;
  },

  // Avatar management
  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/api/users/upload-avatar/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteAvatar: async (): Promise<void> => {
    await apiClient.delete('/api/users/delete-avatar/');
  },

  // Leader following
  followLeader: async (leaderId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/api/projects/leaders/${leaderId}/follow/`);
    return response.data;
  },

  unfollowLeader: async (leaderId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/projects/leaders/${leaderId}/unfollow/`);
    return response.data;
  },

  // Skills
  getSkills: async (): Promise<Skill[]> => {
    const response = await apiClient.get('/api/users/skills/');
    return response.data;
  },

  createSkill: async (skill: { name: string; description?: string }): Promise<Skill> => {
    const response = await apiClient.post('/api/users/skills/', skill);
    return response.data;
  },

  getUserSkills: async (): Promise<Skill[]> => {
    const response = await apiClient.get('/api/users/user-skills/');
    return response.data;
  },

  // Badges
  getBadges: async (): Promise<Badge[]> => {
    const response = await apiClient.get('/api/users/badges/');
    return response.data;
  },

  getUserBadges: async (): Promise<Badge[]> => {
    const response = await apiClient.get('/api/users/user-badges/');
    return response.data;
  }
};