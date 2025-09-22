import { apiClient } from './client';
import type {
  RegisterRequest,
  VerifyOTPRequest,
  CompleteRegistrationRequest,
  CompleteLeaderRegistrationRequest,
  LoginRequest,
  OTPResponse,
  AuthResponse
} from '../types/api';

export const authAPI = {
  // Step 1: Send OTP to phone number
  register: async (data: RegisterRequest): Promise<OTPResponse> => {
    const response = await apiClient.post('/api/users/auth/register/', data);
    return response.data;
  },

  // Step 2: Verify OTP code
  verifyOTP: async (data: VerifyOTPRequest): Promise<OTPResponse> => {
    const response = await apiClient.post('/api/users/auth/verify-otp/', data);
    return response.data;
  },

  // Step 3: Complete registration (volunteer)
  completeRegistration: async (data: CompleteRegistrationRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/users/auth/complete-registration/', data);
    return response.data;
  },

  // Step 3: Complete leader registration
  completeLeaderRegistration: async (data: CompleteLeaderRegistrationRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/users/auth/complete-leader-registration/', data);
    return response.data;
  },

  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/users/auth/login/', data);
    return response.data;
  },

  // Resend OTP
  resendOTP: async (phone_number: string): Promise<OTPResponse> => {
    const response = await apiClient.post('/api/users/auth/resend-otp/', { phone_number });
    return response.data;
  },

  // Make superuser (admin only)
  makeSuperuser: async (userId: number): Promise<{ message: string }> => {
    const response = await apiClient.post('/api/users/auth/make-superuser/', { user_id: userId });
    return response.data;
  },

  // Refresh token
  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    const response = await apiClient.post('/api/token/refresh/', { refresh });
    return response.data;
  },

  // Get current user - try different possible endpoints
  getCurrentUser: async () => {
    try {
      // Try the most common endpoint first
      const response = await apiClient.get('/api/users/profile/');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        try {
          // Try alternative endpoint
          const response = await apiClient.get('/api/auth/user/');
          return response.data;
        } catch (secondError: any) {
          if (secondError.response?.status === 404) {
            // Try another alternative
            const response = await apiClient.get('/api/users/current/');
            return response.data;
          }
          throw secondError;
        }
      }
      throw error;
    }
  }
};

// Export individual functions for easier use
export const { register, verifyOTP, completeRegistration, login, resendOTP, refreshToken } = authAPI;