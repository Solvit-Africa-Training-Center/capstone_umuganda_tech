import React from 'react'
import Button from '../Button'

const ReportNavbar = () => {
  return (
    <div className='flex items-center w-full p-6 bg-[#FAF8F3]'>
        <div className='flex items-center justify-between w-full'>
            <h1 className='font-bold text-h3'>Advance Reporting Tool</h1>
            <button className='w-[251px] h-[64px] text-[20px] bg-primaryColor-900 text-white'>Generate Report</button>
        </div>
    
    </div>
  )
}

export default ReportNavbar
