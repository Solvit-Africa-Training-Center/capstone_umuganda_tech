import logo from "./images/Umuganda-removebg-preview 1.png"
import arrow from "./images/ei_arrow-right (1).png"
import Button from "./Button"

const SignUp = () => {
  return (
    <div className="flex flex-col  items-center justify-center min-h-screen bg-white">
       <div className="flex flex-col items-center w-full min-h-screen">
        <div className="flex flex-row items-center justify-around w-full  pt-10 pb-10">
         <div className="flex flex-row justify-center items-center ">
            <img src={logo} alt="UmugandaTech Logo" className="h-16 w-16" />
            <h2 className="text-2xl font-bold text-primaryColor-900">UmugandaTech</h2>
        </div>
        <img src={arrow} alt="Arrow pointing right" className="h-20 w-20" />
       </div>
       <div className="flex flex-col items-center h-[484px]  bg-accent-900 w-full">
        <h1 className="text-4xl font-bold text-primaryColor-900 mt-32 mb-4">
          Welcome To UmugandaTech
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Building our community, together
          </p>
          <div className="flex flex-row gap-0.5">
            <Button className="p-10 text-center">Join as Volunteer</Button>
            <Button className="p-10 text-center rounded-lg">Join as Leader</Button>
          </div>
       </div>
       </div>
       <div className="flex flex-col items-center min-h-screen bg-white w-full">
        <h1 className="text-h2 font-bold text-text-secondary mt-16 mb-4">
          Sign Up to Volunteer
        </h1>
        <p className="text-base text-gray-600 mb-8">
          We will send you confirmation code
        </p>
        <input type="text" placeholder="Enter your number" className="border border-gray-300 py-5 px-4 mb-4 w-[300px] rounded-2xl" />
        <Button className="p-10">Continue</Button>
        <p>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
       </div>
    </div>
  )
}

export default SignUp
