// import logo from "../images/Umuganda-removebg-preview 1.png"
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';
import type { AuthErrorResponse } from "../types/Auth";

const FloatingLabelInput = React.memo(({
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}) => {
  return (
    <div className="relative mb-4">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label + (required ? ' *' : '')}
        required={required}
        className={`border py-5 px-4 w-full md:w-[500px] rounded-2xl hover:border-primaryColor-900 outline-none transition-colors focus:border-accent-900 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1 ml-2">{error}</p>}
    </div>
  );
});

const SignIn: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, isLoading, error, clearError } = useAuth();

  const handlePhoneChange = useCallback((value: string) => setPhoneNumber(value), []);
  const handlePasswordChange = useCallback((value: string) => setPassword(value), []);

useEffect(() => {
  if (error) {
    let errorMessage = 'An error occurred';
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (typeof error === 'object' && error !== null) {
      const err = error as AuthErrorResponse;
      if (err.phone_number) errorMessage = err.phone_number[0];
      else if (err.password) errorMessage = err.password[0];
      else if (err.detail) errorMessage = err.detail;
      else if (err.non_field_errors) errorMessage = err.non_field_errors[0];
    }
    setErrors({ general: errorMessage });
  }
}, [error]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!phoneNumber.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{9}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 9-digit phone number';
    }
    
    if (!password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;

    await login(phoneNumber, password);
  };

  return (
    <div className="relative bg-[#F9F6F2] pb-10 min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        {/* Header */}
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-row items-center justify-between px-10 w-full pt-7 bg-white rounded-b-3xl shadow-lg pb-7">
            <div className="flex flex-row justify-center items-center">
              {/* <img className="w-14 h-14" src={logo} alt="UmugandaTech Logo" /> */}
              <p>um</p>
              <h2 className="text-2xl font-bold text-gray-800">UmugandaTech</h2>
            </div>
            <Link
              to="/"
              className="h-11 w-11 flex rounded-full border border-gray-300 items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl text-gray-600">×</span>
            </Link>
          </div>

          <div className="bg-[#F9F6F2] flex flex-col items-center justify-center pt-7 w-full">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">
              Welcome Back!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Sign in to continue your community impact
            </p>
            <h1 className="text-2xl font-bold text-gray-800 mt-10 mb-8">
              Sign In
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 w-full md:w-[500px]">
              {errors.general}
            </div>
          )}

          <FloatingLabelInput
            label="Phone number (e.g., 788123456)"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            error={errors.phone}
            required
          />

          <FloatingLabelInput
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            error={errors.password}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primaryColor-900 hover:bg-accent-900 disabled:bg-gray-400 text-white font-medium py-4 px-12 rounded-2xl transition-colors mt-5 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primaryColor-900 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </form>

        <p className="text-sm text-gray-600 pt-6 font-semibold px-4 md:px-0 text-center max-w-md">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignIn;