import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./images/Umuganda-removebg-preview 1.png";
import arrow from "./images/ei_arrow-right (1).png";
import backgrundIMG from "./images/cleaner.png";
import Button from "./Button";
import api from "../api/api";


const SignUp = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!inputValue) {
      alert("Please enter your number");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/api/users/auth/register/", {
        phone_number: inputValue, 
      });

      if (response.status === 200 || response.status === 201) {
    
        navigate("/otp-verification", { state: { phone_number: inputValue } });
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Failed to send OTP, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full pt-10 pb-10">
        <div className="flex flex-row items-center">
          <img src={logo} alt="UmugandaTech Logo" className="h-16 w-16" />
          <h2 className="text-2xl font-bold text-primaryColor-900 ml-2">
            UmugandaTech
          </h2>
        </div>
        <Link to="/">
          <img src={arrow} alt="Arrow pointing right" className="h-16 w-16" />
        </Link>
      </div>

      {/* Hero Section */}
      <div
        className="flex flex-col items-center justify-center pt-7 h-[755px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backgrundIMG})` }}
      >
        <h1 className="text-h1 font-semibold text-text-primary mb-4">
          Welcome To UmugandaTech
        </h1>
        <p className="text-lg text-[#FFFBFB] mb-8">
          Building our community, together
        </p>
        <div className="flex md:flex-row flex-col gap-2 bg-white/5 hover:bg-white rounded-2xl p-1 group">
          <Button className="p-4 text-center text-text-primary group-hover:bg-accent-900">
            Join as Volunteer
          </Button>
          <Button className="p-4 text-center text-text-primary hover:text-text-secondary rounded-lg hover:bg-white bg-white/5 group-hover:bg-white group-hover:text-text-secondary">
            Join as Leader
          </Button>
        </div>
      </div>

      {/* Sign Up Section */}
      <div className="flex flex-col items-center w-full py-16">
        <h1 className="text-h2 font-bold text-text-secondary mb-4">
          Sign Up to Volunteer
        </h1>
        <p className="text-base text-[#A3A0A0] mb-8">
          We will send you a confirmation code
        </p>

        <div className="relative mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=" "
            className={`border py-5 px-4 md:w-[500px] w-full rounded-2xl outline-none transition-colors ${
              isFocused || inputValue
                ? "border-accent-800"
                : "border-gray-300"
            }`}
          />
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              isFocused || inputValue
                ? "top-0 -translate-y-1/2 text-sm text-accent-800 bg-white px-2"
                : "top-1/2 -translate-y-1/2 text-gray-500"
            }`}
          >
            Enter your number
          </label>
        </div>

              <Button
          className="p-4 w-[300px] bg-primaryColor-900 text-center text-text-primary mt-5"
          onClick={handleContinue}
          disabled={loading}
        >
          {loading ? "Sending..." : "Continue"}
        </Button>

        <p className="text-sm text-text-secondary pt-6 font-semibold px-4 md:px-0">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignUp;
