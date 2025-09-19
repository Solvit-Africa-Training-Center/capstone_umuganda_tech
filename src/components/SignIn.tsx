import logo from "./images/Umuganda-removebg-preview 1.png";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const AuthFlow: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"signup" | "signin">("signin");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const FloatingLabelInput = ({
    label,
    type = "text",
    value,
    onChange,
    numericOnly = false,
  }: {
    label: string
    type?: string;
    value: string;
    onChange: (value: string) => void;
    numericOnly?: boolean;
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      if (numericOnly) {
        newValue = newValue.replace(/\D/g, ""); // keep only digits
      }
      onChange(newValue);
    };

    return (
      <div className="relative mb-4">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`border py-5 px-4 w-full md:w-[500px] rounded-2xl outline-none transition-colors ${
            isFocused || value ? "border-green-500" : "border-gray-300"
          }`}
        />
        <label
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isFocused || value
              ? "top-0 -translate-y-1/2 text-sm text-green-500 bg-[#F9F6F2] px-2"
              : "top-1/2 -translate-y-1/2 text-gray-500"
          }`}
        >
          {label}
        </label>
      </div>
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phoneNumber || !password) {
      setError("Phone number and password are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/users/auth/login/', {
        phone_number: phoneNumber,
        password,
      });

      //  Save tokens to localStorage
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate to volunteer or leader dashboard depending on role
      if (res.data.user.role === "leader") {
        navigate("/leader");
      } else {
        navigate("/volunteer");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const AuthFormPage = ({ isSignIn = false }: { isSignIn?: boolean }) => (
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
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Welcome To UmagamaTech
          </h1>
          <p className="text-lg text-gray-600 mb-3">
            Building our community, together
          </p>
          <h1 className="text-2xl font-bold text-gray-800  mb-4">
            Sign In
          </h1>
        </div>
         <div className="flex bg-white border border-gray-400 rounded-2xl p-1 mb-8">
               <button
                onClick={() => setCurrentPage('signin')}
                className={`px-14 py-3 text-center font-medium rounded-xl transition-colors ${
                  !isSignIn
                    ? 'bg-primaryColor-900 text-white hover:bg-accent-900'
                    : 'bg-white text-gray-600 hover:bg-gray-200'
                }`}
              >
                Join as Volunteer
              </button>
              <button
                onClick={() => setCurrentPage('signin')}
                className={`px-14 py-3 text-center font-medium rounded-xl transition-colors ${
                  isSignIn
                    ? 'bg-primaryColor-900 text-white hover:bg-accent-900'
                    : 'bg-white text-gray-600 hover:bg-gray-200 '
                }`}
              >
                Join as Leader
              </button>
            </div>
        <p className="text-base text-[#A3A0A0] mb-8">
            {isSignIn ? 'You are joining in as Leader' : 'You are joining in as Volunteer'}
          </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col items-center">
        <FloatingLabelInput
          label="Enter your phone number"
          type="tel"
          value={phoneNumber}
          onChange={setPhoneNumber}
          numericOnly
        />

        <FloatingLabelInput
          label="Enter your password"
          type="password"
          value={password}
          onChange={setPassword}
        />

        {error && (
          <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-primaryColor-900 hover:bg-accent-900 text-white font-medium py-4 px-12 rounded-2xl transition-colors mt-5 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Continue"}
        </button>
      </form>

      <p className="text-sm text-gray-600 pt-6 font-semibold px-4 md:px-0 text-center max-w-md">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );

  return (
    <div className="relative bg-[#F9F6F2] pb-10">
      {currentPage === "signin" ? (
        <AuthFormPage isSignIn={true} />
      ) : (
        <AuthFormPage isSignIn={false} />
      )}
    </div>
  );
};

export default AuthFlow;