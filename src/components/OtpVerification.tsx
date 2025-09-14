import  { useState } from 'react';
import icon from "./images/Vector (4).png"
import Button from "./Button"
import { Link } from "react-router-dom"

const OtpVerification = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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
          className={`
            border py-2 px-4 rounded-md bg-white w-12 h-12 text-center
            ${activeIndex === i
              ? 'border-primaryColor-900'
              : 'border-gray-300'}
            focus:outline-none focus:border-primaryColor-900
          `}
          onFocus={() => setActiveIndex(i)}
          onBlur={() => setActiveIndex(null)}
        />
      ))}
</div>

  <Link to="/leader_post">
    <Button className="mt-4">Confirm</Button>
  </Link>
</div>

    </section>
  )
}

export default OtpVerification