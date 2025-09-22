import { apiClient } from './client';

export interface Comment {
  id: number;
  post: number;
  user: number;
  user_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const commentsAPI = {
  // Comments management
  getComments: async (params?: { post?: number; page?: number; page_size?: number }): Promise<Comment[]> => {
    const response = await apiClient.get('/api/community/comments/', { params });
    return response.data;
  },

  createComment: async (data: { post: number; content: string }): Promise<Comment> => {
    const response = await apiClient.post('/api/community/comments/', data);
    return response.data;
  },

  getComment: async (id: number): Promise<Comment> => {
    const response = await apiClient.get(`/api/community/comments/${id}/`);
    return response.data;
  },

  updateComment: async (id: number, data: { content: string }): Promise<Comment> => {
    const response = await apiClient.put(`/api/community/comments/${id}/`, data);
    return response.data;
  },

  deleteComment: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/community/comments/${id}/`);
  }
};