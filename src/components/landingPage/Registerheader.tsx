import React from 'react'
import { LuCircleArrowRight } from "react-icons/lu";

const Registerheader = () => {
  return (
    <div className='flex justify-between items-center  rounded-md shadow-md bg-white   w-full p-3 '>
        <div className='flex items-center gap-3'>
            <img src="Umuganda.png" alt="" />
            <h1>Umuganda Tech</h1>
            
        </div>
        <LuCircleArrowRight className='w-8 h-8'/>
    </div>
  )
}

export default Registerheader
