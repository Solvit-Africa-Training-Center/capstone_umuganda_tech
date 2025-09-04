import React from "react";

interface Cardprops {
  image: string;
  Name: string;
  Address: string;
  description: string;
}

const Cardsinfo: React.FC<Cardprops> = ({ image, Name, Address, description }) => {
  return (
    <div className="flex flex-col items-center bg-[#F9F6F2] rounded-2xl shadow-md p-6 w-[320px] lg:w-[850px] lg:h-[460px] text-center lg:flex-row">
      <img
        src={image}
        className="rounded-full w-[136px] h-[144px] object-cover mb-4"
        alt={Name}
      />
      <div className="">
      <div className="pl-15 pr-15 flex flex-col gap-5">
            <div className="text-start">
                <h1 className="font-semibold text-lg lg:text-[40px]">{Name}</h1>
                <p className="text-[#464646] font-medium">{Address}</p>
            </div>
        
            <p className=" text-[#464646] text-[25px]">
                “{description}”
            </p>
       </div>
       
      </div>
     
    </div>
  );
};

export default Cardsinfo;
