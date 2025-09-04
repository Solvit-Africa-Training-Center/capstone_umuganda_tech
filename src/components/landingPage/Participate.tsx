import React from 'react'

function Participate () {
  return (
    <div className='bg-primaryColor-300 flex flex-col items-center justify-center text-center gap-5 p-5'>
        <h1 className='text-[25px]  font-semibold lg:text-h1'>Ready to Make a Difference?</h1> 
        <p className='text-[18px]  lg:w-[700px] lg:h-[105px] font-semibold'>Join the UmugandaTech today, and become part of a  movement that is building a brighter future for Rwanda through colective action and service.</p>
        <div className='flex flex-col lg:flex-row  gap-10 '>
            <button className=' bg-primaryColor-900 hover:text-accent-900 hover:bg-white lg:w-[440px] lg:h-[147] lg:text-h2 text-[25px] text-white rounded-md p-5 font-semibold'>Volunteer Sign Up</button>
            <button className=' bg-primaryColor-200 lg:w-[440px] lg:h-[147] lg:text-h2 text-[25px] rounded-md p-5 font-semibold hover:bg-accent-900 hover:text-white'>Leader Login</button>
        </div>
    </div>
  )
}

export default Participate
