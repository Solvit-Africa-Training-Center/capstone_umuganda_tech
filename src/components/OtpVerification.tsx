import { useState } from "react";
import icon from "./images/Vector (4).png";
import Button from "./Button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://umuganda-tech-backend.onrender.com";

const OtpVerification = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill("")); // store each digit
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // phone number passed from registration page
  const phoneNumber = location.state?.phone_number || "";

  // Handle OTP input change
  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  // Confirm OTP
  const handleConfirm = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(`${API_BASE_URL}/api/users/auth/verify-otp/`, {
        phone_number: phoneNumber,
        otp_code: otpCode,
      });

      if (res.data.verified) {
        // OTP verified successfully
        navigate("/dashboard", { replace: true });
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setResending(true);
      setResendMsg(null);

      await axios.post(`${API_BASE_URL}/api/users/auth/register/`, {
        phone_number: phoneNumber,
      });

      setResendMsg("OTP resent successfully!");
    } catch (err: any) {
      setResendMsg("Failed to resend OTP. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="bg-accent-300 font-opensans flex top-4">
      <div className="bg-accent-500 flex gap-5 flex-col items-center mt-15 min-h-screen rounded-t-3xl w-full">
        <img src={icon} alt="icon of verification code" className="h-3 mt-7" />
        <h1 className="text-h1 text-text-secondary">OTP Verification</h1>
        <p className="text-[#848383] font-semibold">
          We have sent the verification code to your number
        </p>
        <p>Enter the 6-digit code sent to {phoneNumber}</p>

        {/* OTP Input Fields */}
        <div className="flex flex-row items-center gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className={`
                border py-2 px-4 rounded-md bg-white w-12 h-12 text-center
                ${activeIndex === i ? "border-primaryColor-900" : "border-gray-300"}
                focus:outline-none focus:border-primaryColor-900
              `}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(null)}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <div className="flex flex-col gap-3  justify-center w-[6rem]">
          <Link to="/dashboard">
            <Button className="bg-primaryColor-900  w-[6rem] h-[rem]" onClick={handleConfirm} disabled={loading}>
            {loading ? "Verifying..." : "Confirm"}
            </Button>
          </Link>
        

          <Button
            className="mt-4 text-accent-800  rounded-md underline disabled:opacity-50"
            onClick={handleResendOtp}
            disabled={loading}
            type="button"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </Button>

          {resendMsg && (
            <p className="text-sm mt-2 text-center text-green-600">{resendMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default OtpVerification;
