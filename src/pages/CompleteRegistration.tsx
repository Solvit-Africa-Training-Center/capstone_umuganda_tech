import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { completeRegistration } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import Button from '../components/Button';
import logo from '../components/images/Umuganda-removebg-preview 1.png';

const CompleteRegistration: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { phoneNumber, loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setLocalError('');
    try {
      const result = await dispatch(completeRegistration({
        phone_number: phoneNumber,
        password,
        first_name: firstName,
        last_name: lastName
      }));
      
      if (completeRegistration.fulfilled.match(result)) {
        window.location.href = '/volunteer';
      } else {
        setLocalError('Registration failed. Please try again.');
      }
    } catch (error) {
      setLocalError('Network error. Please try again.');
    }
  };

  return (
    <div className="relative bg-[#F9F6F2] pb-10 min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className="flex flex-row items-center justify-between px-10 w-full pt-7 bg-white rounded-b-3xl shadow-lg pb-7">
          <div className="flex flex-row justify-center items-center">
            <img className="w-14 h-14" src={logo} alt="UmugandaTech Logo" />
            <h2 className="text-2xl font-bold text-primaryColor-900">UmugandaTech</h2>
          </div>
          <Link
            to="/"
            className="h-11 w-11 flex rounded-full border border-gray-300 items-center justify-center"
          >
            <span className="text-3xl text-gray-600">→</span>
          </Link>
        </div>

        <div className="bg-[#F9F6F2] flex flex-col items-center justify-center pt-7 w-full px-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Complete Registration</h1>
          <p className="text-lg text-gray-600 mb-8">Just a few more details to get started</p>

          <div className="w-full max-w-md space-y-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full py-4 px-4 border border-gray-300 rounded-2xl focus:border-primaryColor-900 outline-none"
            />
            
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full py-4 px-4 border border-gray-300 rounded-2xl focus:border-primaryColor-900 outline-none"
            />
            
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-4 px-4 border border-gray-300 rounded-2xl focus:border-primaryColor-900 outline-none"
            />
            
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-4 px-4 border border-gray-300 rounded-2xl focus:border-primaryColor-900 outline-none"
            />

            {(error || localError) && (
              <p className="text-red-500 text-sm text-center">
                {localError || error}
              </p>
            )}

            <Button
              className="w-full bg-primaryColor-900 hover:bg-accent-900 text-white font-medium py-4 rounded-2xl transition-colors disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteRegistration;