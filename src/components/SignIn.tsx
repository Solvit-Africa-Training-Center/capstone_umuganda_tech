import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logo from "./images/Umuganda-removebg-preview 1.png";
import Button from './Button';

type PageRoute = '/signup' | '/signin' | '/otp-verification';

interface FloatingLabelProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

const FloatingLabelInput: React.FC<FloatingLabelProps> = ({
  label,
  type = "text",
  value,
  onChange
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-4">
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`border py-5 px-4 w-full md:w-[500px] rounded-2xl hover:border-primaryColor-900 outline-none transition-colors ${
          isFocused || value ? 'border-accent-900' : 'border-gray-300'
        }`}
      />
      <label
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          isFocused || value
            ? 'top-0 -translate-y-1/2 text-sm text-green-500 bg-[#F9F6F2] px-2'
            : 'top-1/2 -translate-y-1/2 text-gray-500'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const AuthFlow: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('/signup');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isSignIn = currentPage === '/signin';
  const isFormValid = phoneNumber.trim() !== '' && password.trim() !== '';

  const handleContinue = async () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          password,
          role: isSignIn ? 'leader' : 'volunteer'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-[#F9F6F2] pb-10">
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-row items-center justify-between px-10 w-full pt-7 bg-white rounded-b-3xl shadow-lg pb-7">
            <div className="flex flex-row justify-center items-center">
              <img className="w-14 h-14" src={logo} alt="UmagamaTech Logo" />
              <h2 className="text-2xl font-bold text-primaryColor-900">UmagamaTech</h2>
            </div>
            <Link
              to="/signup"
              className="h-11 w-11 flex rounded-full border border-gray-300 items-center justify-center"
            >
              <span className="text-3xl text-gray-600">→</span>
            </Link>
          </div>

          <div className="bg-[#F9F6F2] flex flex-col items-center justify-center pt-7 w-full">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome To UmagamaTech</h1>
            <p className="text-lg text-gray-600 mb-8">Building our community, together</p>
            <h1 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Sign In</h1>

            <div className="flex bg-white border border-gray-400 rounded-2xl p-1 mb-8">
              <button
                onClick={() => setCurrentPage('/signup')}
                className={`px-14 py-3 text-center font-medium rounded-xl transition-colors ${
                  !isSignIn
                    ? 'bg-primaryColor-900 text-white hover:bg-accent-900'
                    : 'bg-white text-gray-600 hover:bg-gray-200'
                }`}
              >
                Join as Volunteer
              </button>
              <button
                onClick={() => setCurrentPage('/signin')}
                className={`px-14 py-3 text-center font-medium rounded-xl transition-colors ${
                  isSignIn
                    ? 'bg-primaryColor-900 text-white hover:bg-accent-900'
                    : 'bg-white text-gray-600 hover:bg-gray-200 '
                }`}
              >
                Join as Leader
              </button>
            </div>
          </div>

          <p className="text-base text-[#A3A0A0] mb-8">
            {isSignIn ? 'You are joining in as Leader' : 'You are joining in as Volunteer'}
          </p>

          <FloatingLabelInput
            label="Enter your phone number"
            type="text"
            value={phoneNumber}
            onChange={setPhoneNumber}
          />

          <FloatingLabelInput
            label="Enter your password"
            type="password"
            value={password}
            onChange={setPassword}
          />

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <Button
            onClick={handleContinue}
            disabled={!isFormValid || isLoading}
            className={`font-medium py-4 px-12 rounded-2xl transition-colors mt-5 ${
              isFormValid && !isLoading
                ? 'bg-primaryColor-900 hover:bg-accent-900 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Continue'}
          </Button>

          <p className="text-sm text-gray-600 pt-6 font-semibold px-4 md:px-0 text-center max-w-md">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;
