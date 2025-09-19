import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { communityAPI } from '../api/community';
import type { Post } from '../types/api';

interface CommunityState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'community/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await communityAPI.getPosts();
      return response.results || response; // Handle both paginated and direct array responses
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to fetch posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'community/createPost',
  async (postData: {
    title: string;
    description?: string;
    sector?: string;
    datetime?: string;
    location?: string;
    content: string;
    type?: 'feedback' | 'suggestion' | 'discussion';
  }, { rejectWithValue }) => {
    try {
      const response = await communityAPI.createPost(postData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to create post');
    }
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.posts = []; // Ensure posts is always an array
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.posts.unshift(action.payload);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = communitySlice.actions;
export default communitySlice.reducer;