import logo from "./images/Umuganda-removebg-preview 1.png";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"signup" | "signin">("signup");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const FloatingLabelInput = ({
    label,
    type = "text",
    value,
    onChange,
  }: {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative mb-4">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`border py-5 px-4 w-full md:w-[500px] rounded-2xl outline-none transition-colors ${
            isFocused || value ? "border-accent-900" : "border-gray-300"
          }`}
        />
        <label
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isFocused || value
              ? "top-0 -translate-y-1/2 text-sm text-primaryColor-900 bg-[#F9F6F2] px-2"
              : "top-1/2 -translate-y-1/2 text-gray-500"
          }`}
        >
          {label}
        </label>
      </div>
    );
  };

  const handleRegister = async () => {
    if (!phoneNumber.trim()) {
      setApiMessage("Phone number is required");
      return;
    }

    setLoading(true);
    setApiMessage(null);

    try {
      const response = await fetch(
        "https://umuganda-tech-backend.onrender.com/api/users/auth/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: phoneNumber }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Registration failed");

      setApiMessage(data.message || "OTP sent ✅");

      // Save phone number to localStorage so OTP page can use it
      localStorage.setItem("phone_number", phoneNumber);

      // Redirect to OTP verification page
      navigate("/otp-verification", { state: { phone_number: phoneNumber } });
    } catch (error: any) {
      setApiMessage(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#F9F6F2] pb-10">
      <div className="flex flex-col items-center w-full">
        {/* Header */}
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

        {/* Welcome text */}
        <div className="bg-[#F9F6F2] flex flex-col items-center justify-center pt-7 w-full">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Welcome To UmagamaTech
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Building our community, together
          </p>
          <h1 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Sign Up</h1>

          <div className="flex bg-white border border-gray-400 rounded-2xl p-1 mb-8">
            <button
              type="button"
              onClick={() => setCurrentPage("signup")}
              className={`px-14 py-3 text-center font-medium rounded-xl transition-colors ${
                currentPage === "signup"
                  ? "bg-primaryColor-900 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              Join as Volunteer
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage("signin")}
              className={`px-14 py-3 text-center font-medium rounded-xl transition-colors ${
                currentPage === "signin"
                  ? "bg-primaryColor-900 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              Join as Leader
            </button>
          </div>
        </div>

        {/* Role Info */}
        <p className="text-base text-[#A3A0A0] mb-8">
          {currentPage === "signup"
            ? "You are joining as Volunteer"
            : "You are joining as Leader"}
        </p>

        {/* Phone number input */}
        <FloatingLabelInput
          label="Enter your phone number"
          type="text"
          value={phoneNumber}
          onChange={setPhoneNumber}
        />

        {/* Submit */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`bg-primaryColor-900 hover:bg-accent-900 text-white font-medium py-4 px-12 rounded-2xl transition-colors mt-5 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Continue"}
        </button>

        {/* Message */}
        {apiMessage && (
          <p className="text-sm text-center text-gray-700 mt-4">{apiMessage}</p>
        )}

        <p className="text-sm text-gray-600 pt-6 font-semibold px-4 md:px-0 text-center max-w-md">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignUp;



