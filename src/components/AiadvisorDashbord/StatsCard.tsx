import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  highlight?: string;
  icon?: React.ReactNode; 
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, highlight,icon }) => {
  return (
     <div className="flex w-[311px] bg-white shadow-sm rounded-xl p-6 flex-shrink-0 snap-start">
       <div className="  flex flex-col ">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        <p className="text-primaryColor-900">View Details</p>
        {highlight && <p className="text-green-600 text-sm mt-2 font-semibold">{highlight}</p>}
       </div>
      

      {icon && <div className=" flex items-start w-[29px] h-[32px]  text-xl">{icon}</div>}
    </div>
  );
};

export default StatsCard;
