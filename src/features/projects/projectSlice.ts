import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../store';   // ✅ updated path

export interface Project {
  id?: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: string;
  budget?: string;
  volunteers?: number;
}

export interface ProjectState {
  items: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  items: [],
  loading: false,
  error: null,
};

const API_URL = 'https://your-render-api.onrender.com/api/projects/projects/';

export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData: Project, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, projectData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Error creating project');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectSlice.reducer;

export const selectProjects = (state: RootState) => state.projects;
