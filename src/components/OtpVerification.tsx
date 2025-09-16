import  { useState } from 'react';
import icon from "./images/Vector (4).png"
import Button from "./Button"
import { api } from "../services/api";

const OtpVerification = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [phoneNumber] = useState(localStorage.getItem('phoneNumber') || '');

  const handleVerifyOtp = async () => {
  const response = await api.verifyOtp(phoneNumber, otpCode);
  // Handle response
};

const handleInputChange = (index: number, value: string) => {
    const newOtp = otpCode.split('');
    newOtp[index] = value;
    setOtpCode(newOtp.join(''));
  };
  // Dummy handlers for demonstration
  const handleConfirm = () => {};
  const handleResendOtp = () => {};

  return (
    <section className="bg-accent-300 font-opensans flex top-4">
      <div className="bg-accent-500 flex gap-5 flex-col items-center mt-15 min-h-screen rounded-t-3xl w-full">
        <img src={icon} alt="icon of verification code"  className="h-3 mt-7"/>
        <h1 className="text-h1 text-text-secondary">OTP Verification</h1>
        <p className="text-[#848383] font-semibold">
          We have sent the verification  code to your number
        </p>
        <p>Enter the 6-digit code sent to  07XX XXX XXX</p>

        <div className="flex flex-row items-center gap-3">
          {Array.from({ length: 6 }, (_, i) => (
    <input
      key={i}
      type="text"
      maxLength={1}
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

        <div className="flex flex-col gap-3 w-full sm:w-full md:w-1/2 lg:w-1/2 items-center">
          <div className="bg-primaryColor-900 hover:bg-accent-900 text-white font-medium px-12 rounded-2xl transition-colors mt-5">
            <Button className="py-5 w-full" onClick={handleConfirm}>
            Confirm
          </Button>
          </div>
          <Button
            className="mt-4 text-text-secondary underline disabled:opacity-50"
            onClick={handleResendOtp}
            disabled={resending}
            type="button"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </Button>
          {resendMsg && (
            <p className="text-sm mt-2 text-center text-red-600">{resendMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default OtpVerification;
