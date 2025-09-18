import { useState } from 'react';
import icon from "./images/Vector (4).png";
import Button from "./Button";
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';

const OtpVerification = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [localError, setLocalError] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const { phoneNumber, loading, error } = useSelector((state: RootState) => state.auth);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = otpCode.split('');
      newOtp[index] = value;
      setOtpCode(newOtp.join(''));
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleConfirm = async () => {
    if (otpCode.length !== 6) {
      setLocalError('Please enter the complete 6-digit code');
      return;
    }
    
    setLocalError('');
    try {
      const result = await dispatch(verifyOtp({ phoneNumber, otpCode }));
      if (verifyOtp.fulfilled.match(result)) {
        window.location.href = '/complete-registration';
      } else {
        setLocalError('Invalid OTP code. Please try again.');
      }
    } catch (error) {
      setLocalError('Verification failed. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(resendOtp(phoneNumber));
      setOtpCode('');
      setLocalError('');
    } catch (error) {
      setLocalError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <section className="bg-accent-300 font-opensans flex">
      <div className="bg-accent-500 flex gap-5 flex-col items-center pt-15 min-h-screen rounded-t-3xl w-full">
        <img src={icon} alt="icon of verification code" className="h-6 mt-7"/>
        <h1 className="text-h1 text-text-secondary">OTP Verification</h1>
        <p className="text-[#848383] font-semibold">
          We have sent the verification  code to your number
        </p>
        <p>Enter the 6-digit code sent to {phoneNumber ? `0${phoneNumber.slice(0,2)}X XXX XXX` : '07XX XXX XXX'}</p>
        
        {(error || localError) && (
          <p className="text-red-500 text-sm text-center px-4">
            {localError || error}
          </p>
        )}

        <div className="flex flex-row items-center gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              data-index={i}
              value={otpCode[i] || ''}
              onChange={(e) => handleInputChange(i, e.target.value)}
              className={`
                border py-2 px-4 rounded-md bg-white w-12 h-12 text-center
                ${activeIndex === i ? 'border-primaryColor-900' : 'border-gray-300'}
                focus:outline-none focus:border-primaryColor-900
              `}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(null)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full sm:w-full md:w-52 items-center">
          <Button 
            className="bg-primaryColor-900 hover:bg-accent-900 text-white font-medium px-12 py-5 rounded-2xl transition-colors mt-5 w-full disabled:opacity-50"
            onClick={handleConfirm}
            disabled={loading || otpCode.length !== 6}
          >
            {loading ? 'Verifying...' : 'Confirm'}
          </Button>
          <button
            className="mt-4 text-primaryColor-900 underline disabled:opacity-50"
            onClick={handleResendOtp}
            disabled={loading}
            type="button"
          >
            {loading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default OtpVerification;
