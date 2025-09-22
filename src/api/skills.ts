import { apiClient } from './client';

export interface Skill {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface UserSkill {
  id: number;
  user: number;
  skill: Skill;
  proficiency_level?: string;
  created_at: string;
}

export const skillsAPI = {
  // Skills management
  getSkills: async (): Promise<Skill[]> => {
    const response = await apiClient.get('/api/users/skills/');
    return response.data;
  },

  createSkill: async (data: { name: string; description?: string }): Promise<Skill> => {
    const response = await apiClient.post('/api/users/skills/', data);
    return response.data;
  },

  getSkill: async (id: number): Promise<Skill> => {
    const response = await apiClient.get(`/api/users/skills/${id}/`);
    return response.data;
  },

  updateSkill: async (id: number, data: Partial<Skill>): Promise<Skill> => {
    const response = await apiClient.put(`/api/users/skills/${id}/`, data);
    return response.data;
  },

  deleteSkill: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/users/skills/${id}/`);
  },

  // User skills management
  getUserSkills: async (): Promise<UserSkill[]> => {
    const response = await apiClient.get('/api/users/user-skills/');
    return response.data;
  },

  addUserSkill: async (data: { skill: number; proficiency_level?: string }): Promise<UserSkill> => {
    const response = await apiClient.post('/api/users/user-skills/', data);
    return response.data;
  },

  removeUserSkill: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/users/user-skills/${id}/`);
  }
};