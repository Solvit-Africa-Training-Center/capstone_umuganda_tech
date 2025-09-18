const BASE_URL = 'https://umuganda-tech-backend.onrender.com';

export const api = {
  // Auth endpoints
  register: (phone_number: string) => 
    fetch(`${BASE_URL}/api/users/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number })
    }),

  verifyOtp: (phone_number: string, otp_code: string) =>
    fetch(`${BASE_URL}/api/users/auth/verify-otp/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, otp_code })
    }),

  completeRegistration: (data: any) =>
    fetch(`${BASE_URL}/api/users/auth/complete-registration/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),

  login: (phone_number: string, password: string) =>
    fetch(`${BASE_URL}/api/users/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, password })
    })
};
