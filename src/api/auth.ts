import type { AuthResponse } from "../types";
import api from "./api";

export const requestOTP = async (phone_number: string) => {
  const res = await api.post("/api/users/auth/register/", { phone_number });
  return res.data;
};

export const verifyOTP = async (phone_number: string, otp_code: string) => {
  const res = await api.post("/api/users/auth/verify-otp/", {
    phone_number,
    otp_code,
  });
  return res.data;
};

export const completeRegistration = async (data: {
  phone_number: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<AuthResponse> => {
  const res = await api.post("/api/users/auth/complete-registration/", data);
  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);
  return res.data;
};

export const login = async (
  phone_number: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post("/api/users/auth/login/", {
    phone_number,
    password,
  });
  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);
  return res.data;
};

export const refreshToken = async (refresh: string) => {
  const res = await api.post("/api/token/refresh/", { refresh });
  localStorage.setItem("access", res.data.access);
  return res.data;
};
