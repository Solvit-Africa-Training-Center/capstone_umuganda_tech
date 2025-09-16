import React from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { LuPlus } from "react-icons/lu";
import Button from '../Button';

const NavbarDash = () => {
  return (
    <div className="flex items-center  bg-[#FAF8F3] shadow  p-6 h-[5rem] ">
      {/* Search Bar */}
      <h1 className="text-2xl font-bold text-h1">AI Project Advisor</h1> 
      <div className='flex justify-between items-center gap-2  w-[28rem]'>
        
      <div className='flex'>
        <img src="export.png" className='w-[25px] h-[25px]' alt="" />
        <p>Export Report</p>
      </div>  
      <div>
          <Button className=''><LuPlus/><p className='text-white font-medium'>New Analysis</p></Button>
      </div>
      
      </div>
      
    </div>
  )
}

export default NavbarDash
