import logo from "./images/Umuganda-removebg-preview 1.png"
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';
import FileUpload from './FileUpload';

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

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'volunteer' | 'leader'>('volunteer');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sector, setSector] = useState('');
  const [verificationDocument, setVerificationDocument] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { registerPhone, completeRegistration, isLoading, error, otpStep, clearError, isAuthenticated, userType: authUserType, phoneNumber: authPhoneNumber } = useAuth();

  const handlePhoneChange = useCallback((value: string) => setPhoneNumber(value), []);
  const handleFirstNameChange = useCallback((value: string) => setFirstName(value), []);
  const handleLastNameChange = useCallback((value: string) => setLastName(value), []);
  const handlePasswordChange = useCallback((value: string) => setPassword(value), []);
  const handleConfirmPasswordChange = useCallback((value: string) => setConfirmPassword(value), []);
  const handleSectorChange = useCallback((value: string) => setSector(value), []);

  useEffect(() => {
    if (error) {
      let errorMessage = 'An error occurred';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        // Handle backend validation errors
        if (error.phone_number) {
          errorMessage = Array.isArray(error.phone_number) ? error.phone_number[0] : error.phone_number;
        } else if (error.password) {
          errorMessage = Array.isArray(error.password) ? error.password[0] : error.password;
        } else if (error.detail) {
          errorMessage = error.detail;
        } else if (error.non_field_errors) {
          errorMessage = Array.isArray(error.non_field_errors) ? error.non_field_errors[0] : error.non_field_errors;
        } else if (error.verification_document) {
          errorMessage = Array.isArray(error.verification_document) ? error.verification_document[0] : error.verification_document;
        }
      }
      setErrors({ general: errorMessage });
    }
  }, [error]);

  // Pre-fill phone number from auth state when completing registration
  useEffect(() => {
    if (otpStep === 'complete' && authPhoneNumber && !phoneNumber) {
      setPhoneNumber(authPhoneNumber);
    }
  }, [otpStep, authPhoneNumber, phoneNumber]);

  useEffect(() => {
    if (isAuthenticated && otpStep === null) {
      console.log('User authenticated, redirecting...');
    }
  }, [isAuthenticated, otpStep]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!phoneNumber.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{9}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 9-digit phone number';
    }
    
    if (otpStep === 'complete') {
      if (!firstName.trim()) newErrors.firstName = 'First name is required';
      if (!lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!password) newErrors.password = 'Password is required';
      else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      
      if (authUserType === 'leader') {
        if (!sector.trim()) newErrors.sector = 'Sector is required';
        if (!verificationDocument) newErrors.document = 'Verification document is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const completeLeaderRegistration = async (data: {
    phone_number: string;
    password: string;
    first_name: string;
    last_name: string;
    sector: string;
    verification_document: File;
  }) => {
    const formData = new FormData();
    formData.append('phone_number', data.phone_number);
    formData.append('password', data.password);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('sector', data.sector);
    formData.append('verification_document', data.verification_document);

    const response = await fetch('http://localhost:8000/api/users/auth/complete-leader-registration/', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setErrors({});
    
    if (!validateForm()) return;

    try {
      if (otpStep === 'complete') {
        if (authUserType === 'leader') {
          const result = await completeLeaderRegistration({
            phone_number: phoneNumber,
            password,
            first_name: firstName,
            last_name: lastName,
            sector,
            verification_document: verificationDocument!
          });

          // Check if registration is pending approval
          if (result.status === 'pending_approval') {
            navigate('/pending-approval');
            return;
          }
        } else {
          await completeRegistration({
            phone_number: phoneNumber,
            password,
            first_name: firstName,
            last_name: lastName
          });
        }
        
        console.log('Registration request completed');
      } else {
        await registerPhone(phoneNumber, userType);
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <div className="relative bg-[#F9F6F2] pb-10 min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        {/* Header */}
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-row items-center justify-between px-10 w-full pt-7 bg-white rounded-b-3xl shadow-lg pb-7">
            <div className="flex flex-row justify-center items-center">
              <img className="w-14 h-14" src={logo} alt="UmugandaTech Logo" />
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
              Welcome To UmugandaTech
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Building our community, together
            </p>
            <h1 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
              {otpStep === 'complete' ? 'Complete Registration' : 'Sign Up'}
            </h1>

            {otpStep !== 'complete' && (
              <div className="flex bg-white border border-gray-400 rounded-2xl p-1 mb-8">
                <button
                  onClick={() => setUserType('volunteer')}
                  className={`px-14 py-3 text-center font-medium rounded-xl transition-colors ${
                    userType === 'volunteer'
                      ? 'bg-primaryColor-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Join as Volunteer
                </button>
                <button
                  onClick={() => setUserType('leader')}
                  className={`px-14 py-3 text-center font-medium rounded-xl transition-colors ${
                    userType === 'leader'
                      ? 'bg-primaryColor-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Join as Leader
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {otpStep !== 'complete' && (
            <p className="text-base text-[#A3A0A0] mb-8">
              You are joining as {userType === 'volunteer' ? 'Volunteer' : 'Leader'}
            </p>
          )}

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 w-full md:w-[500px]">
              {errors.general}
            </div>
          )}

          <div className="relative mb-4">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => otpStep !== 'complete' && handlePhoneChange(e.target.value)}
              placeholder="Phone number (e.g., 788123456) *"
              required
              readOnly={otpStep === 'complete'}
              className={`border py-5 px-4 w-full md:w-[500px] rounded-2xl outline-none transition-colors ${
                otpStep === 'complete' 
                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                  : 'hover:border-primaryColor-900 focus:border-accent-900'
              } ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1 ml-2">{errors.phone}</p>}
            {otpStep === 'complete' && (
              <p className="text-xs text-gray-500 mt-1 ml-2">Phone number verified ✓</p>
            )}
          </div>

          {otpStep === 'complete' && (
            <>
              <FloatingLabelInput
                label="First Name"
                value={firstName}
                onChange={handleFirstNameChange}
                error={errors.firstName}
                required
              />

              <FloatingLabelInput
                label="Last Name"
                value={lastName}
                onChange={handleLastNameChange}
                error={errors.lastName}
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

              <FloatingLabelInput
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={errors.confirmPassword}
                required
              />

              {authUserType === 'leader' && (
                <>
                  <FloatingLabelInput
                    label="Sector (e.g., Kigali, Nyarugenge)"
                    value={sector}
                    onChange={handleSectorChange}
                    error={errors.sector}
                    required
                  />

                  <div className="mb-4 w-full md:w-[500px]">
                    <FileUpload
                      onFileSelect={setVerificationDocument}
                      error={errors.document}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload a document to verify your leadership credentials (ID, certificate, recommendation letter, etc.)
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primaryColor-900 hover:bg-accent-900 disabled:bg-gray-400 text-white font-medium py-4 px-12 rounded-2xl transition-colors mt-5 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {otpStep === 'complete' ? 
              (authUserType === 'leader' ? 'Submit Application' : 'Complete Registration') : 
              'Send OTP'
            }
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-primaryColor-900 hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </form>

        <p className="text-sm text-gray-600 pt-6 font-semibold px-4 md:px-0 text-center max-w-md">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignUp;