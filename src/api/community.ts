import { apiClient } from './client';
import type { Post, Comment, PaginatedResponse } from '../types/api';

export const communityAPI = {
  // Post Management
  getPosts: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get('/api/community/posts/', { params });
    return response.data;
  },

  createPost: async (post: {
    title: string;
    description?: string;
    sector?: string;
    datetime?: string;
    location?: string;
    content: string;
    type: 'feedback' | 'suggestion' | 'discussion';
    project?: number;
  }): Promise<Post> => {
    const response = await apiClient.post('/api/community/posts/', post);
    return response.data;
  },

  getPost: async (id: number): Promise<Post> => {
    const response = await apiClient.get(`/api/community/posts/${id}/`);
    return response.data;
  },

  updatePost: async (id: number, post: {
    title?: string;
    description?: string;
    sector?: string;
    datetime?: string;
    location?: string;
    content?: string;
    type?: 'feedback' | 'suggestion' | 'discussion';
    project?: number;
  }): Promise<Post> => {
    const response = await apiClient.put(`/api/community/posts/${id}/`, post);
    return response.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/community/posts/${id}/`);
  },

  // Upvoting System
  upvotePost: async (id: number): Promise<{ message: string; upvoted: boolean }> => {
    const response = await apiClient.post(`/api/community/posts/${id}/upvote/`);
    return response.data;
  },

  getPostUpvotes: async (id: number): Promise<any[]> => {
    const response = await apiClient.get(`/api/community/posts/${id}/upvotes/`);
    return response.data;
  },

  // Comments System
  getPostComments: async (postId: number): Promise<Comment[]> => {
    const response = await apiClient.get(`/api/community/posts/${postId}/comments/`);
    return response.data;
  },

  createPostComment: async (postId: number, content: string): Promise<Comment> => {
    const response = await apiClient.post(`/api/community/posts/${postId}/comments/`, { content });
    return response.data;
  },

  getAllComments: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Comment>> => {
    const response = await apiClient.get('/api/community/comments/', { params });
    return response.data;
  },

  updateComment: async (id: number, content: string): Promise<Comment> => {
    const response = await apiClient.put(`/api/community/comments/${id}/`, { content });
    return response.data;
  },

  deleteComment: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/community/comments/${id}/`);
  }
};