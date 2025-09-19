import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/api';
import type { Project, FilterState, SortState, PaginationState } from '../../types/Volunteer';

export const fetchSortedProjects = createAsyncThunk(
  'volunteerDashboard/fetchSortedProjects',
  async (params: {
    filter: FilterState;
    sort: SortState;
    pagination: PaginationState;
  }, { rejectWithValue }) => {
    try {
      const { filter, sort, pagination } = params;
      const queryParams: any = {
        page: pagination.page,
        page_size: pagination.pageSize,
        sort_by: sort.sortBy,
        order: sort.order,
      };
      if (filter.status) queryParams.status = filter.status;
      if (filter.location) queryParams.location = filter.location;
      if (filter.search) queryParams.search = filter.search;

      console.log('Fetching projects with params:', queryParams);
      // Try the sorted endpoint first, fallback to regular projects endpoint
      let response;
      try {
        response = await api.get('/api/projects/projects/sorted_projects/', {
          params: queryParams,
        });
      } catch (sortedError) {
        console.log('Sorted endpoint failed, trying regular endpoint');
        response = await api.get('/api/projects/projects/', {
          params: queryParams,
        });
      }
      console.log('API Response:', response.data);
      
      // Debug image URLs in projects
      const projects = response.data.results || response.data;
      if (Array.isArray(projects)) {
        console.log('Projects with image info:');
        projects.forEach((project, index) => {
          console.log(`Project ${index + 1}: ${project.title}`);
          console.log(`  - ID: ${project.id}`);
          console.log(`  - image_url: ${project.image_url}`);
          console.log(`  - Has image: ${!!project.image_url}`);
        });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

interface VolunteerDashboardState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  filter: FilterState;
  sort: SortState;
  pagination: PaginationState;
}

const initialState: VolunteerDashboardState = {
  projects: [],
  loading: false,
  error: null,
  filter: { tab: 'all' },
  sort: {
    sortBy: 'created_at',
    order: 'desc',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    hasMore: false,
    total: 0,
    totalPages: 1,
  },
};

const volunteerDashboardSlice = createSlice({
  name: 'volunteerDashboard',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterState>) => {
      state.filter = action.payload;
      state.pagination.page = 1;
    },
    setSort: (state, action: PayloadAction<SortState>) => {
      state.sort = action.payload;
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSortedProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSortedProjects.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both paginated and non-paginated responses
        const projects = action.payload.results || action.payload;
        state.projects = projects;
        state.pagination.totalPages = action.payload.total_pages ?? 1;
        state.pagination.total = action.payload.count ?? (action.payload.length || 0);
        
        // Debug projects in Redux store
        console.log('Projects stored in Redux:', projects);
        if (Array.isArray(projects)) {
          console.log(`Total projects: ${projects.length}`);
          projects.forEach((project, index) => {
            console.log(`Redux Project ${index + 1}: ${project.title} - Image: ${project.image_url}`);
          });
        }
      })
      .addCase(fetchSortedProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching projects';
      });
  },
});

export const { setFilter, setSort, setPage, clearError } = volunteerDashboardSlice.actions;
export default volunteerDashboardSlice.reducer;