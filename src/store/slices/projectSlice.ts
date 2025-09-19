import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://umuganda-tech-backend.onrender.com';

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      
      const response = await fetch(`${BASE_URL}/api/projects/projects/`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      
      const data = await response.json();
      return data.results || data;
    } catch (error: any) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// Fetch volunteer's projects
export const fetchMyProjects = createAsyncThunk(
  'projects/fetchMyProjects',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      
      const response = await fetch(`${BASE_URL}/api/projects/projects/my_projects/`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      
      const data = await response.json();
      return data.results || data;
    } catch (error: any) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// Discover projects
export const discoverProjects = createAsyncThunk(
  'projects/discoverProjects',
  async (location: string | undefined, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      
      const url = location 
        ? `${BASE_URL}/api/projects/projects/discover/?location=${location}`
        : `${BASE_URL}/api/projects/projects/discover/`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      
      return await response.json();
    } catch (error: any) {
      return rejectWithValue({ message: error.message });
    }
  }
);

interface Project {
  id: number;
  title: string;
  description: string;
  sector: string;
  datetime: string;
  location: string;
  required_volunteers: number;
  image_url?: string;
  admin: number;
  admin_name: string;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  volunteer_count: number;
  is_user_registered: boolean;
  skills: any[];
}

interface ProjectState {
  projects: Project[];
  myProjects: Project[];
  discoveredProjects: any;
  dashboardStats: any;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  myProjects: [],
  discoveredProjects: null,
  dashboardStats: null,
  loading: false,
  error: null
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || 'Failed to fetch projects';
      })
      // My projects
      .addCase(fetchMyProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.myProjects = action.payload;
      })
      .addCase(fetchMyProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || 'Failed to fetch my projects';
      })
      // Discover projects
      .addCase(discoverProjects.fulfilled, (state, action) => {
        state.discoveredProjects = action.payload;
      });
  }
});

export const { clearError } = projectSlice.actions;
export default projectSlice.reducer;