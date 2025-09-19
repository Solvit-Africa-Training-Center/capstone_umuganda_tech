import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsAPI } from '../api/projects';
import type { Project, DiscoveryResponse } from '../types/api';

interface ProjectsState {
  projects: Project[];
  discoveryProjects: DiscoveryResponse | null;
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  dashboardStats: any;
  filters: {
    status?: string;
    location?: string;
    date_from?: string;
    date_to?: string;
  };
}

const initialState: ProjectsState = {
  projects: [],
  discoveryProjects: null,
  currentProject: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  dashboardStats: null,
  filters: {},
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params?: { search?: string; status?: string; location?: string }, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getProjects(params);
      return response.results;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch projects');
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getProject(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch project');
    }
  }
);

export const discoverProjects = createAsyncThunk(
  'projects/discoverProjects',
  async (location: string | undefined, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.discoverProjects(location);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to discover projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: {
    title: string;
    description: string;
    sector: string;
    datetime: string;
    location: string;
    required_volunteers: number;
  }, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.createProject(projectData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create project');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
      state.searchQuery = '';
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single project
      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Discover projects
      .addCase(discoverProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(discoverProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discoveryProjects = action.payload;
      })
      .addCase(discoverProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Dashboard stats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      });
  },
});

export const fetchDashboardStats = createAsyncThunk(
  'projects/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getDashboardStats();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch dashboard stats');
    }
  }
);

export const { setSearchQuery, setFilters, clearFilters, clearError } = projectsSlice.actions;
export default projectsSlice.reducer;