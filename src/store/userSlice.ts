import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersAPI, certificatesAPI, notificationsAPI } from '../api';
import type { User, Skill, Badge, Certificate, Notification } from '../types/api';

interface UserState {
  profile: User | null;
  skills: Skill[];
  badges: Badge[];
  certificates: Certificate[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  skills: [],
  badges: [],
  certificates: [],
  notifications: [],
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getUser(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, data }: { userId: number; data: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.updateUser(userId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update profile');
    }
  }
);

export const fetchUserSkills = createAsyncThunk(
  'user/fetchSkills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getUserSkills();
      return Array.isArray(response) ? response : [];
    } catch (error: any) {
      console.error('Fetch skills error:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch skills');
    }
  }
);

export const fetchUserBadges = createAsyncThunk(
  'user/fetchBadges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getUserBadges();
      return Array.isArray(response) ? response : [];
    } catch (error: any) {
      console.error('Fetch badges error:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch badges');
    }
  }
);

export const fetchUserCertificates = createAsyncThunk(
  'user/fetchCertificates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await certificatesAPI.getCertificates();
      return Array.isArray(response?.results) ? response.results : Array.isArray(response) ? response : [];
    } catch (error: any) {
      console.error('Fetch certificates error:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch certificates');
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'user/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsAPI.getNotifications();
      return Array.isArray(response?.results) ? response.results : Array.isArray(response) ? response : [];
    } catch (error: any) {
      console.error('Fetch notifications error:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch notifications');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchUserSkills.fulfilled, (state, action) => {
        state.skills = action.payload;
      })
      .addCase(fetchUserBadges.fulfilled, (state, action) => {
        state.badges = action.payload;
      })
      .addCase(fetchUserCertificates.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;