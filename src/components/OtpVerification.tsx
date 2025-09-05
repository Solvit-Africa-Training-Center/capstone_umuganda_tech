import icon from "./images/Vector (4).png"
import Button from "./Button"

const OtpVerification = () => {
  return (
    <section className="bg-accent-300 font-opensans flex top-4">
        <div className="bg-accent-500 flex flex-col items-center mt-15 min-h-screen w-full">
            <img src={icon} alt="" />
            <h1 className="text-h1 text-text-secondary">OTP Verification</h1>
            <p className="text-[#848383] font-semibold">
                We have sent the verification  code to your number
            </p>
            <p>Enter the 6-digit code sent to  07XX XXX XXX</p>

            <div className="flex flex-row items-center gap-3">
                <div className="border py-2 px-4 rounded-md bg-white">5</div>
                <div className="border py-2 px-4 rounded-md bg-[#FFFFFF]">5</div>
                <div className="border py-2 px-4 rounded-md bg-[#FFFFFF]">5</div>
                <div className="border py-2 px-4 rounded-md bg-[#FFFFFF]">5</div>
                <div className="border py-2 px-4 rounded-md bg-[#FFFFFF]">5</div>
                <div className="border py-2 px-4 rounded-md bg-[#FFFFFF]">5</div>
            </div>
            <Button className="mt-4">Confirm</Button>
        </div>
        
    </section>
  )
}

export default OtpVerification