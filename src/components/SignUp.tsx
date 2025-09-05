import logo from "./images/Umuganda-removebg-preview 1.png"
import arrow from "./images/ei_arrow-right (1).png"
import backgrundIMG from "./images/cleaner.png"
import Button from "./Button"
import { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  return (
    <div className="flex flex-col  items-center justify-center min-h-screen bg-white">
       <div className="flex flex-col items-center w-full min-h-screen">
        <div className="flex flex-row items-center justify-between w-full pt-10 pb-10">
         <div className="flex flex-row justify-center items-center ">
            <img src={logo} alt="UmugandaTech Logo" className="h-16 w-16" />
            <h2 className="text-2xl font-bold text-primaryColor-900">UmugandaTech</h2>
        </div>
        <Link to="/"><img src={arrow} alt="Arrow pointing right" className="h-16 w-16" /></Link>
       </div>
       <div className="flex flex-col items-center justify-center pt-7 h-[755px] w-full bg-cover bg-center"
       style={{ backgroundImage: `url(${backgrundIMG})` }}
       >
        <h1 className="text-h1 font-semibold text-text-primary  mb-4">
          Welcome To UmugandaTech
        </h1>
        <p className="text-lg text-[#FFFBFB] mb-8 ">
          Building our community, together
          </p>
          <div className="flex md:flex-row flex-col gap-0.5 bg-white/5 hover:bg-white rounded-2xl p-1 group">
            <Button className="p-10 text-center text-text-primary group-hover:bg-accent-900">Join as Volunteer</Button>
            <Button className="p-10 text-center text-text-primary hover:text-text-secondary rounded-lg hover:bg-white bg-white/5 group-hover:bg-white group-hover:text-text-secondary">Join as Leader</Button>
          </div>

       </div>
       </div>
       <div className="flex flex-col items-center min-h-screen w-full">
        <h1 className="text-h2 font-bold text-text-secondary mt-16 mb-4">
          Sign Up to Volunteer
        </h1>
        <div>
          <p className="text-base text-[#A3A0A0] mb-8">
          We will send you confirmation code
        </p>
        <div className="relative mb-4">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`border py-5 px-4 md:w-[500px] w-full rounded-2xl outline-none transition-colors ${
              isFocused || inputValue ? 'border-accent-800' : 'border-gray-300'
            }`}
          />
          <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isFocused || inputValue 
              ? 'top-0 -translate-y-1/2 text-sm text-accent-800 bg-white px-2' 
              : 'top-1/2 -translate-y-1/2 text-gray-500'
          }`}>
            Enter your number
          </label>
        </div>
        </div>
        <Link to="/otp-verification">
          <Button className="p-10 w-[300px] text-center text-text-primary mt-5">Continue</Button>
        </Link>
        <p className="text-sm text-text-secondary pt-6 font-semibold px-4 md:px-0">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
       </div>
    </div>
  )
}

export default SignUp
