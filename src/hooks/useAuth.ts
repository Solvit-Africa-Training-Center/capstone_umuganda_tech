import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { 
  registerPhone, 
  verifyOTP, 
  completeRegistration,
  completeLeaderRegistration, 
  login, 
  logout, 
  clearError,
  initializeAuth,
  refreshToken
} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const handleRegisterPhone = async (phone_number: string, userType: 'volunteer' | 'leader') => {
    const result = await dispatch(registerPhone({ phone_number, userType }));
    if (registerPhone.fulfilled.match(result)) {
      navigate('/otp-verification');
    }
    return result;
  };

  const handleVerifyOTP = async (phone_number: string, otp_code: string) => {
    const result = await dispatch(verifyOTP({ phone_number, otp_code }));
    if (verifyOTP.fulfilled.match(result)) {
      navigate('/signup');
    }
    return result;
  };

  const handleCompleteRegistration = async (data: {
    phone_number: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    const result = await dispatch(completeRegistration(data));
    if (completeRegistration.fulfilled.match(result)) {
      navigate('/dashboard');
    }
    return result;
  };

  const handleCompleteLeaderRegistration = async (data: {
    phone_number: string;
    password: string;
    first_name: string;
    last_name: string;
    sector: string;
    experience: string;
  }) => {
    const result = await dispatch(completeLeaderRegistration(data));
    if (completeLeaderRegistration.fulfilled.match(result)) {
      navigate('/dashboard');
    }
    return result;
  };

  const handleLogin = async (phone_number: string, password: string) => {
    const result = await dispatch(login({ phone_number, password }));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
    return result;
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const handleResendOTP = async (phone_number: string, userType: 'volunteer' | 'leader') => {
    const result = await dispatch(registerPhone({ phone_number, userType }));
    return result;
  };

  const initAuth = () => {
    dispatch(initializeAuth());
  };

  const refreshAuthToken = () => {
    dispatch(refreshToken());
  };

  return {
    ...auth,
    registerPhone: handleRegisterPhone,
    verifyOTP: handleVerifyOTP,
    completeRegistration: handleCompleteRegistration,
    completeLeaderRegistration: handleCompleteLeaderRegistration,
    login: handleLogin,
    logout: handleLogout,
    resendOTP: handleResendOTP,
    clearError: clearAuthError,
    initializeAuth: initAuth,
    refreshToken: refreshAuthToken,
  };
};