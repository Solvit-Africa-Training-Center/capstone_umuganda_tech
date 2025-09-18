import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Button from "./Button";
import logo from "./images/Umuganda-removebg-preview 1.png";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setPhoneNumber } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';

type AuthPage = '/signup' | '/signin' | '/otp-verification';

interface FloatingLabelProps {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
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
          (isFocused || value)
            ? 'top-0 -translate-y-1/2 text-sm text-primaryColor-900 bg-[#F9F6F2] px-2'
            : 'top-1/2 -translate-y-1/2 text-gray-500'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const SignUp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AuthPage>('/signup');
  const [phoneNumber, setPhoneNumberState] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [localError, setLocalError] = useState('');

  const isSignUp = currentPage === '/signup';

  const handleContinue = async () => {
    if (!phoneNumber.trim()) {
      setLocalError('Please enter your phone number');
      return;
    }
    
    // Format phone number (remove spaces, dashes, and country code)
    const cleanPhone = phoneNumber.replace(/[\s\-\+]/g, '');
    const formattedPhone = cleanPhone.startsWith('250') ? cleanPhone.slice(3) : cleanPhone;
    
    console.log('Original phone:', phoneNumber);
    console.log('Cleaned phone:', cleanPhone);
    console.log('Formatted phone:', formattedPhone);
    
    if (formattedPhone.length !== 9) {
      setLocalError('Please enter a valid 9-digit phone number');
      return;
    }
    
    setLocalError('');
    dispatch(setPhoneNumber(formattedPhone));
    localStorage.setItem('phoneNumber', formattedPhone);
    
    try {
      const result = await dispatch(registerUser(formattedPhone));
      console.log('Registration result:', result);
      
      if (registerUser.fulfilled.match(result)) {
        console.log('Registration successful, redirecting...');
        window.location.href = '/otp-verification';
      } else {
        console.error('Registration rejected:', result.payload);
        const errorMsg = result.payload?.message || result.payload?.error || 'Failed to send OTP. Please try again.';
        setLocalError(errorMsg);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setLocalError('Network error. Please try again.');
    }
  };

  return (
    <div className="relative bg-[#F9F6F2] pb-10">
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className="flex flex-row items-center justify-between px-10 w-full pt-7 bg-white rounded-b-3xl shadow-lg pb-7">
          <div className="flex flex-row justify-center items-center">
            <img className="w-14 h-14" src={logo} alt="UmagmaTech Logo" />
            <h2 className="text-2xl font-bold text-primaryColor-900">UmagmaTech</h2>
          </div>
          <Link
            to="/"
            className="h-11 w-11 flex rounded-full border border-gray-300 items-center justify-center"
          >
            <span className="text-3xl text-gray-600">→</span>
          </Link>
        </div>

        <div className="bg-[#F9F6F2] flex flex-col items-center justify-center pt-7 w-full">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome To UmagmaTech</h1>
          <p className="text-lg text-gray-600 mb-8">Building our community, together</p>
          <h1 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Sign Up</h1>

          <div className="flex bg-white border border-gray-400 rounded-2xl p-1 mb-8">
            <button
              type="button"
              onClick={() => setCurrentPage('/signup')}
              className={`px-14 py-3 text-center font-medium rounded-xl transition-colors ${
                isSignUp
                  ? 'bg-primaryColor-900 text-white hover:bg-accent-900'
                  : 'bg-white text-gray-600 hover:bg-gray-200 '
              }`}
            >
              Join as Volunteer
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('/signin')}
              className={`px-14 py-3 text-center font-medium rounded-xl transition-colors ${
                !isSignUp
                  ? 'bg-primaryColor-900 text-white hover:bg-accent-900'
                  : 'bg-white text-gray-600 hover:bg-gray-200 '
              }`}
            >
              Join as Leader
            </button>
          </div>
        </div>

        <p className="text-base text-[#A3A0A0] mb-8">
          {isSignUp ? 'You are joining as Volunteer' : 'You are joining as Leader'}
        </p>

        <FloatingLabelInput
          label="Enter your phone number (e.g., 788123456)"
          type="tel"
          value={phoneNumber}
          onChange={setPhoneNumberState}
        />
        
        {(error || localError) && (
          <p className="text-red-500 text-sm mb-4">
            {localError || error}
          </p>
        )}
        
        <Button 
          className="bg-primaryColor-900 hover:bg-accent-900 text-white font-medium py-4 px-12 rounded-2xl transition-colors mt-5 disabled:opacity-50"
          onClick={handleContinue} 
          disabled={loading || !phoneNumber.trim()}
        >
          {loading ? 'Sending OTP...' : 'Continue'}
        </Button>

        <p className="text-sm text-gray-600 pt-6 font-semibold px-4 md:px-0 text-center max-w-md">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignUp;



