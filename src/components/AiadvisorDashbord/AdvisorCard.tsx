import React from "react";

interface AdvisorProps {
  image: string;
  Name: string;
  Address: string;
  description: string;
}

const AdvisorCard: React.FC<AdvisorProps> = ({ image, Name, Address, description }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center bg-white rounded-2xl shadow-md p-6 w-full max-w-3xl mx-auto">
      <img
        src={image}
        className="rounded-full w-[120px] h-[120px] object-cover mb-4 lg:mb-0 lg:mr-6"
        alt={Name}
      />
      <div className="flex flex-col text-start">
        <h1 className="font-semibold text-lg lg:text-xl">{Name}</h1>
        <p className="text-gray-500 text-sm lg:text-base">{Address}</p>
        <p className="text-gray-700 mt-4 italic">“{description}”</p>
      </div>
    </div>
  );
};

export default AdvisorCard;
