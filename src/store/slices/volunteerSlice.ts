import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { VolunteerProfile, Project, FilterState, SortState, PaginationState } from '../../types/volunteer';

const BASE_URL = 'https://umuganda-tech-backend.onrender.com';

// Fetch volunteer profile
export const fetchVolunteerProfile = createAsyncThunk(
  'volunteer/fetchProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      const user = state.auth.user;
      
      // Since there's no specific profile endpoint, compute from user data and projects
      const projectsResponse = await fetch(`${BASE_URL}/api/projects/projects/my_projects/`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (!projectsResponse.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const projects = await projectsResponse.json();
      const projectsData = projects.results || projects;
      
      const profile: VolunteerProfile = {
        id: user?.id || 0,
        name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Volunteer',
        email: user?.email || '',
        avatar_url: user?.avatar_url,
        projectsCompleted: projectsData.filter((p: Project) => p.status === 'completed').length,
        hoursContributed: projectsData.filter((p: Project) => p.status === 'completed').length * 8,
        totalProjects: projectsData.length,
        activeProjects: projectsData.filter((p: Project) => p.status === 'ongoing').length
      };
      
      return profile;
    } catch (error: any) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// Fetch projects with filters and pagination
export const fetchFilteredProjects = createAsyncThunk(
  'volunteer/fetchFilteredProjects',
  async ({ filters, sort, pagination, loadMore = false }: {
    filters: FilterState;
    sort: SortState;
    pagination: PaginationState;
    loadMore?: boolean;
  }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      
      const params = new URLSearchParams();
      
      // Add pagination
      params.append('page', pagination.page.toString());
      params.append('page_size', pagination.pageSize.toString());
      
      // Add sorting
      params.append('sort_by', sort.sortBy);
      params.append('order', sort.order);
      
      // Add filters
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      
      // Choose endpoint based on tab
      const endpoint = filters.tab === 'my-projects' 
        ? `${BASE_URL}/api/projects/projects/my_projects/`
        : `${BASE_URL}/api/projects/projects/sorted_projects/?${params.toString()}`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      return {
        projects: data.results || data,
        total: data.count || (data.results || data).length,
        hasMore: !!data.next,
        loadMore
      };
    } catch (error: any) {
      return rejectWithValue({ message: error.message });
    }
  }
);

interface VolunteerState {
  profile: VolunteerProfile | null;
  projects: Project[];
  filters: FilterState;
  sort: SortState;
  pagination: PaginationState;
  loading: boolean;
  profileLoading: boolean;
  error: string | null;
}

const initialState: VolunteerState = {
  profile: null,
  projects: [],
  filters: {
    search: '',
    status: '',
    location: '',
    tab: 'all'
  },
  sort: {
    sortBy: 'datetime',
    order: 'desc'
  },
  pagination: {
    page: 1,
    pageSize: 12,
    hasMore: true,
    total: 0
  },
  loading: false,
  profileLoading: false,
  error: null
};

const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset pagination when filters change
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.pagination.page = 1;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Profile
      .addCase(fetchVolunteerProfile.pending, (state) => {
        state.profileLoading = true;
      })
      .addCase(fetchVolunteerProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchVolunteerProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = (action.payload as any)?.message || 'Failed to fetch profile';
      })
      // Projects
      .addCase(fetchFilteredProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFilteredProjects.fulfilled, (state, action) => {
        state.loading = false;
        const { projects, total, hasMore, loadMore } = action.payload;
        
        if (loadMore) {
          state.projects = [...state.projects, ...projects];
        } else {
          state.projects = projects;
        }
        
        state.pagination.total = total;
        state.pagination.hasMore = hasMore;
      })
      .addCase(fetchFilteredProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || 'Failed to fetch projects';
      });
  }
});

export const { setFilters, setSort, setPagination, clearError } = volunteerSlice.actions;
export default volunteerSlice.reducer;