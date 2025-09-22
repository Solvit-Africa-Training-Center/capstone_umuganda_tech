const Address = () => {
  return (
    <div className='flex  justify-center'>
        <div className='flex flex-col gap-5 lg:gap-40 w-[83%] bg-gray-50  justify-between lg:flex-row lg:justify-between '>
            <div className='flex flex-col items-center  lg:w-[441px] '>
                <div className='flex  items-center justify-start lg:pr-[120px]'>
                    <img src="Umuganda.png" className='w-[60px] h-[60px]' alt="" />
                    <h1 className='font-bold text-primaryColor-900 text-[20px]'>UmugandaTech</h1>
                </div>
                <p className='text-center  text-[18px] lg:text-start'>Digitizing and enhancing Rwanda’s traditiona,
                community service.</p>
            </div>
            <div  className='grid grid-cols-1 items-center text-center gap-5 lg:text-start lg:grid-cols-4 font-semibold'>
                <div className='flex flex-col text-[18px]'>
                    <h1 className='font-bold'>About</h1>
                    <div className=''>
                        <p className=''>Our Mission</p>
                        <p className=''>Our Team</p>
                    </div>  
                </div>
                <div className='flex flex-col text-[18px]'>
                    <h1 className='font-bold'>Resources</h1>
                    <div className=''>
                        <p className=''>Blog</p>
                        <p className=''>Case Studies</p>
                    </div>
                
                </div>
                <div className='flex flex-col text-[18px]'>
                    <h1 className='font-bold'>Legal</h1>
                    <div className=''>
                        <p  className=''>privacy policy</p>
                        <p  className=''>Terms </p>
                    </div>
                
                </div>
                <div className='flex flex-col text-[18px]'>
                    <h1 className='font-bold'>contact us</h1>
                    <div className=''>
                        <p  className=''>Support</p>
                        <p  className=''>Partnership</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Address
