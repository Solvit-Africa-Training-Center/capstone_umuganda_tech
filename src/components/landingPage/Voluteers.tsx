import React from "react";
import VoluteerCard from "./VoluteerCard";
import { CiLocationOn } from "react-icons/ci";
import { IoGameControllerOutline, IoQrCodeOutline } from "react-icons/io5";
import { FaCertificate } from "react-icons/fa";

function Voluteers() {
  const features = [
    {
      Name: "Easy Discovery",
      description:
        "Find and sign up for community projects near you with an intuitive map and filter system",
      icon: <CiLocationOn />,
    },
    {
      Name: "QR Check-In",
      description:
        "Effortlessly check in and out of projects using QR codes for accurate participation tracking",
      icon: <IoQrCodeOutline />,
    },
    {
      Name: "Digital Certificate",
      description:
        "Send automated reminders and recognize volunteers with digital certificates",
      icon: <FaCertificate />,
    },
    {
      Name: "Gamification",
      description:
        "Generate reports on volunteer hours, project outcomes, and community impact",
      icon: <IoGameControllerOutline />,
    },
  ];

  return (
    <div className="flex flex-col p-10 bg-white">
      {/* Title Section */}
      <div className="w-full flex flex-col justify-center text-center gap-5 mb-10">
        <h1 className="text-3xl font-bold">For Citizen Volunteers</h1>
        <p className="text-[#464646] text-lg max-w-2xl mx-auto">
          Discover meaningful ways to contribute, track your service, and be
          recognized for your invaluable effort in building a stronger Rwanda.
        </p>
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex gap-6">
          {features.map((feature, index) => (
            <VoluteerCard
              key={index}
              icon={feature.icon}
              Name={feature.Name}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Voluteers;
