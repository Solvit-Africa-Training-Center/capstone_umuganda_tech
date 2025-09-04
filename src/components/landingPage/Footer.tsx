import Address from './Address'
import { FaRegCopyright } from "react-icons/fa";

function  Footer() {
  return (
    <div className='flex flex-col gap-15 '>
      <Address/>
      <div className=' flex justify-end  w-[90%]'>
          <div className='flex flex-col  gap-5 w-[90%]'>
          <div className='border-[E2E1E1]  border-1 '></div>
          <div className='flex items-center'>
              <FaRegCopyright className=''/>
              <p className='text-[E2E1E1] text-[18px]'>2025 UmugandaTech. All rights reserved.</p>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Footer
