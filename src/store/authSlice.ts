import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../api/auth';
import type { User } from '../types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpStep: 'phone' | 'verify' | 'complete' | null;
  phoneNumber: string;
  userType: 'volunteer' | 'leader' | null;
  pendingApproval: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true
  error: null,
  otpStep: null,
  phoneNumber: '',
  userType: null,
  pendingApproval: false,
};

// Check for existing token on app start
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user_data');
      
      if (!token) {
        throw new Error('No token found');
      }
      
      // If we have user data stored, use it
      if (user) {
        return JSON.parse(user);
      }
      throw new Error('No user data found');
    } catch (error: any) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      return rejectWithValue('Session expired');
    }
  }
);

// Refresh token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) {
        throw new Error('No refresh token');
      }
      
      const response = await authAPI.refreshToken(refresh);
      localStorage.setItem('access_token', response.access);
      return response;
    } catch (error: any) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return rejectWithValue('Token refresh failed');
    }
  }
);

// Async thunks
export const registerPhone = createAsyncThunk(
  'auth/registerPhone',
  async ({ phone_number, userType }: { phone_number: string; userType: 'volunteer' | 'leader' }, { rejectWithValue }) => {
    try {
      const response = await authAPI.register({ phone_number });
      return { ...response, phone_number, userType };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ phone_number, otp_code }: { phone_number: string; otp_code: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOTP({ phone_number, otp_code });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'OTP verification failed');
    }
  }
);

export const completeRegistration = createAsyncThunk(
  'auth/completeRegistration',
  async (data: { phone_number: string; password: string; first_name: string; last_name: string }, { rejectWithValue }) => {
    try {
      console.log('Sending complete registration data:', data);
      const response = await authAPI.completeRegistration(data);
      console.log('Registration response:', response);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      return response;
    } catch (error: any) {
      console.error('Complete registration error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      
      const errorData = error.response?.data;
      
      // Handle different error types
      if (error.response?.status === 400) {
        if (errorData && typeof errorData === 'object') {
          return rejectWithValue(errorData);
        }
        return rejectWithValue({ detail: 'Invalid registration data. Please check your inputs.' });
      }
      
      if (error.response?.status === 404) {
        return rejectWithValue({ detail: 'Registration service not available.' });
      }
      
      if (error.response?.status === 500) {
        return rejectWithValue({ detail: 'Server error. Please try again later.' });
      }
      
      if (errorData && typeof errorData === 'object') {
        return rejectWithValue(errorData);
      }
      return rejectWithValue({ detail: 'Registration completion failed. Please try again.' });
    }
  }
);

export const completeLeaderRegistration = createAsyncThunk(
  'auth/completeLeaderRegistration',
  async (data: { phone_number: string; password: string; first_name: string; last_name: string; sector: string; experience: string }, { rejectWithValue }) => {
    try {
      console.log('Sending complete leader registration data:', data);
      const response = await authAPI.completeLeaderRegistration(data);
      console.log('Leader registration response:', response);
      
      // Check if registration is pending approval
      if (response.status === 'pending_approval') {
        return { ...response, pendingApproval: true };
      }
      
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      return response;
    } catch (error: any) {
      console.error('Complete leader registration error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      
      const errorData = error.response?.data;
      
      if (error.response?.status === 400) {
        if (errorData && typeof errorData === 'object') {
          return rejectWithValue(errorData);
        }
        return rejectWithValue({ detail: 'Invalid registration data. Please check your inputs.' });
      }
      
      if (error.response?.status === 404) {
        return rejectWithValue({ detail: 'Leader registration service not available.' });
      }
      
      if (error.response?.status === 500) {
        return rejectWithValue({ detail: 'Server error. Please try again later.' });
      }
      
      if (errorData && typeof errorData === 'object') {
        return rejectWithValue(errorData);
      }
      return rejectWithValue({ detail: 'Leader registration completion failed. Please try again.' });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: { phone_number: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('Sending login data:', data);
      const response = await authAPI.login(data);
      console.log('Login response:', response);
      
      // Check if user is pending approval
      if (response.status === 'pending_approval') {
        return rejectWithValue({ 
          detail: 'Your leader application is still pending approval. Please wait for approval.',
          status: 'pending_approval'
        });
      }
      
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      return response;
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      
      // Handle 500 errors (server issues)
      if (error.response?.status === 500) {
        return rejectWithValue({ detail: 'Server error. Please try again later.' });
      }
      
      const errorData = error.response?.data;
      
      // Handle pending approval status
      if (errorData?.status === 'pending_approval') {
        return rejectWithValue({ 
          detail: 'Your leader application is still pending approval. Please wait for approval.',
          status: 'pending_approval'
        });
      }
      
      if (errorData && typeof errorData === 'object') {
        return rejectWithValue(errorData);
      }
      return rejectWithValue({ detail: 'Login failed' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.otpStep = null;
      state.phoneNumber = '';
      state.userType = null;
      state.pendingApproval = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    },
    clearError: (state) => {
      state.error = null;
    },
    setOtpStep: (state, action: PayloadAction<'phone' | 'verify' | 'complete' | null>) => {
      state.otpStep = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Refresh token
      .addCase(refreshToken.fulfilled, (state) => {
        // Token refreshed successfully, maintain current state
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      // Register phone
      .addCase(registerPhone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerPhone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpStep = 'verify';
        state.phoneNumber = action.payload.phone_number;
        state.userType = action.payload.userType;
      })
      .addCase(registerPhone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpStep = 'complete';
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Complete registration
      .addCase(completeRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.otpStep = null;
        state.phoneNumber = '';
        state.userType = null;
        // Store user data for session persistence
        localStorage.setItem('user_data', JSON.stringify(action.payload.user));
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Complete leader registration
      .addCase(completeLeaderRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeLeaderRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Check if pending approval
        if (action.payload.pendingApproval) {
          state.pendingApproval = true;
          state.otpStep = null;
          state.phoneNumber = '';
          state.userType = null;
          return;
        }
        
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.otpStep = null;
        state.phoneNumber = '';
        state.userType = null;
        // Store user data for session persistence
        localStorage.setItem('user_data', JSON.stringify(action.payload.user));
      })
      .addCase(completeLeaderRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        // Store user data for session persistence
        localStorage.setItem('user_data', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setOtpStep } = authSlice.actions;
export default authSlice.reducer;