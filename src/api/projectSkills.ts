import { apiClient } from './client';

export interface ProjectSkill {
  id: number;
  project: number;
  skill: number;
  skill_name?: string;
  required_level?: string;
  created_at: string;
}

export const projectSkillsAPI = {
  // Project skills management
  getProjectSkills: async (): Promise<ProjectSkill[]> => {
    const response = await apiClient.get('/api/projects/project-skills/');
    return response.data;
  },

  addProjectSkill: async (data: { project: number; skill: number; required_level?: string }): Promise<ProjectSkill> => {
    const response = await apiClient.post('/api/projects/project-skills/', data);
    return response.data;
  },

  getProjectSkill: async (id: number): Promise<ProjectSkill> => {
    const response = await apiClient.get(`/api/projects/project-skills/${id}/`);
    return response.data;
  },

  updateProjectSkill: async (id: number, data: Partial<ProjectSkill>): Promise<ProjectSkill> => {
    const response = await apiClient.put(`/api/projects/project-skills/${id}/`, data);
    return response.data;
  },

  deleteProjectSkill: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/projects/project-skills/${id}/`);
  }
};