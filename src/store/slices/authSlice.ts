import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://umuganda-tech-backend.onrender.com';

// Step 1: Register (Send OTP)
export const registerUser = createAsyncThunk(
  '/api/auth/register',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      console.log('Sending registration request for:', phoneNumber);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for slow backend
      
      const response = await fetch(`${BASE_URL}/api/auth/register/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          return rejectWithValue(errorData);
        } catch {
          return rejectWithValue({ message: `HTTP ${response.status}: ${errorText}` });
        }
      }
      
      const data = await response.json();
      console.log('Registration response:', { status: response.status, data });
      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.name === 'AbortError') {
        return rejectWithValue({ message: 'Request timeout. Please try again.' });
      }
      return rejectWithValue({ message: `Network error: ${error.message}` });
    }
  }
);

// Step 2: Verify OTP
export const verifyOtp = createAsyncThunk(
  '/api/auth/verifyOtp',
  async ({ phoneNumber, otpCode }: { phoneNumber: string; otpCode: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, otp_code: otpCode })
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: 'Network error' });
    }
  }
);

// Step 3: Complete Registration
export const completeRegistration = createAsyncThunk(
  '/api/auth/completeRegistration',
  async (userData: { phone_number: string; password: string; first_name: string; last_name: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/complete-registration/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: 'Network error' });
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  '/api/auth/login',
  async ({ phoneNumber, password }: { phoneNumber: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, password })
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: 'Network error' });
    }
  }
);

// Resend OTP
export const resendOtp = createAsyncThunk(
  '/api/auth/resendOtp',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      console.log('Resending OTP for:', phoneNumber);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
      const response = await fetch(`${BASE_URL}/api/auth/resend-otp/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          return rejectWithValue(errorData);
        } catch {
          return rejectWithValue({ message: `HTTP ${response.status}: ${errorText}` });
        }
      }
      
      const data = await response.json();
      console.log('Resend OTP response:', { status: response.status, data });
      return data;
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      if (error.name === 'AbortError') {
        return rejectWithValue({ message: 'Request timeout. Please try again.' });
      }
      return rejectWithValue({ message: `Network error: ${error.message}` });
    }
  }
);

interface AuthState {
  user: any;
  token: string | null;
  refreshToken: string | null;
  phoneNumber: string;
  loading: boolean;
  error: string | null;
  otpVerified: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  phoneNumber: localStorage.getItem('phoneNumber') || '',
  loading: false,
  error: null,
  otpVerified: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
      localStorage.setItem('phoneNumber', action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.phoneNumber = '';
      state.otpVerified = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('phoneNumber');
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.phoneNumber = action.payload.phone_number || state.phoneNumber;
        console.log('Registration successful:', action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        state.error = payload?.message || payload?.error || payload?.detail || 'Registration failed';
        console.error('Registration failed:', action.payload);
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Complete Registration
      .addCase(completeRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
        localStorage.setItem('access_token', action.payload.access);
        localStorage.setItem('refresh_token', action.payload.refresh);
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
        localStorage.setItem('access_token', action.payload.access);
        localStorage.setItem('refresh_token', action.payload.refresh);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setPhoneNumber, clearError, logout } = authSlice.actions;
export default authSlice.reducer;