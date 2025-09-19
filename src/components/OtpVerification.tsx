import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2, ArrowLeft } from 'lucide-react';
import icon from "./images/Vector (4).png"

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const { verifyOTP, resendOTP, isLoading, error, phoneNumber, clearError } = useAuth();

  useEffect(() => {
    if (error) {
      setErrors({ general: typeof error === 'string' ? error : 'Invalid OTP code' });
    }
  }, [error]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setErrors({ general: 'Please enter all 6 digits' });
      return;
    }

    await verifyOTP(phoneNumber, otpCode);
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 9) {
      return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    }
    return phone;
  };

  return (
    <section className="bg-accent-300 font-opensans min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Back button */}
        <Link 
          to="/signup" 
          className="inline-flex items-center text-gray-600 hover:text-primaryColor-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <div className="text-center">
          <img src={icon} alt="OTP verification icon" className="h-16 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            OTP Verification
          </h1>
          
          <p className="text-gray-600 mb-2">
            We have sent a verification code to
          </p>
          
          <p className="text-primaryColor-900 font-semibold mb-8">
            +250 {formatPhoneNumber(phoneNumber)}
          </p>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-8">
              {Array.from({ length: 6 }, (_, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  value={otp[i]}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className={`
                    w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg
                    focus:outline-none focus:border-primaryColor-900 transition-colors
                    ${otp[i] ? 'border-primaryColor-900 bg-primaryColor-50' : 'border-gray-300'}
                  `}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full bg-primaryColor-900 hover:bg-accent-900 disabled:bg-gray-400 text-white font-medium py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Verify OTP
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button 
                className="text-primaryColor-900 hover:underline font-medium disabled:text-gray-400"
                onClick={() => resendOTP(phoneNumber)}
                disabled={isLoading}
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtpVerification;