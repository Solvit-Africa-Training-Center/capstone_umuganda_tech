import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import icon from "./images/Vector (4).png";
import Button from "./Button";

const OtpVerification = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const phone_number = location.state?.phone_number;

  // Handle OTP input changes
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if not last
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Join digits and send to backend
  const handleConfirm = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      return alert("Please enter the full 6-digit code.");
    }
    if (!phone_number) {
      alert("Phone number missing. Please sign up again.");
      return;
    }

    try {
      const response = await fetch(
        "https://umuganda-tech-backend.onrender.com/api/users/auth/verify-otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone_number, otp_code: code }), // <-- use otp_code
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.verified) {
          navigate("/signup-success");
        } else {
          alert(data.message || "Invalid OTP, please try again.");
        }
      } else {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        alert(
          errorData.message || errorData.detail || "Invalid OTP, please try again."
        );
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    if (!phone_number) {
      alert("Phone number missing. Please sign up again.");
      return;
    }
    setResending(true);
    setResendMsg(null);
    try {
      const response = await fetch(
        "https://umuganda-tech-backend.onrender.com/api/users/auth/resend-otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone_number }),
        }
      );
      if (response.ok) {
        setResendMsg("OTP resent successfully!");
      } else {
        const errorData = await response.json();
        setResendMsg(errorData.detail || "Failed to resend OTP.");
      }
    } catch (error) {
      setResendMsg("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="bg-accent-300 font-opensans flex items-center justify-center min-h-screen">
      <div className="bg-accent-500 flex flex-col gap-5 items-center p-8 rounded-xl shadow-lg w-full max-w-md">
        <img src={icon} alt="icon of verification code" className="h-8 mt-4" />
        <h1 className="text-h1 text-text-secondary">OTP Verification</h1>

        <p className="text-[#848383] font-semibold text-center">
          We have sent a verification code to your number
        </p>
        <p className="text-sm text-gray-700">
          Enter the 6-digit code sent to <b>07XX XXX XXX</b>
        </p>

        {/* OTP Input Fields */}
        <div className="flex gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className="border py-2 px-4 rounded-md bg-white w-12 h-12 text-center text-lg font-semibold focus:ring-2 focus:ring-accent-800"
            />
          ))}
        </div>

        <Button className="mt-6 w-full" onClick={handleConfirm}>
          Confirm
        </Button>

        <button
          className="mt-4 text-accent-800 underline disabled:opacity-50"
          onClick={handleResendOtp}
          disabled={resending}
          type="button"
        >
          {resending ? "Resending..." : "Resend OTP"}
        </button>
        {resendMsg && (
          <p className="text-sm mt-2 text-center text-red-600">{resendMsg}</p>
        )}
      </div>
    </section>
  );
};

export default OtpVerification;
