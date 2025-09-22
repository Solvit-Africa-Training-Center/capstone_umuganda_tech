import React from "react";

interface VoluteerProps {
  icon: React.ReactNode; 
  Name: string;
  description: string;
}

const VoluteerCard: React.FC<VoluteerProps> = ({ icon, Name, description }) => {
  return (
    <div className="flex flex-col items-start justify-center bg-[#F9F6F2] rounded-xl shadow-sm p-8   text-left flex-shrink-0 snap-center w-[541px] h-[408px]">
      {/* Icon */}
      <div className="text-green-700  mb-4">{icon}</div>

      {/* Title */}
      <h1 className="font-semibold text-h3 mb-2 ">{Name}</h1>

      {/* Description */}
      <p className="text-[#464646] text-[18px] leading-relaxed">{description}</p>
    </div>
  );
};

export default VoluteerCard;
