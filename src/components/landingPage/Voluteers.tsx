import React, { useRef } from "react";
import VoluteerCard from "./VoluteerCard";
import { CiLocationOn } from "react-icons/ci";
import { IoGameControllerOutline, IoQrCodeOutline } from "react-icons/io5";
import { Medal } from "lucide-react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

function Voluteers() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      Name: "Easy Discovery",
      description:
        "Find and sign up for community projects near you with an intuitive map and filter system",
      icon: <CiLocationOn className="w-[34px] h-[34px]" />,
    },
    {
      Name: "QR Check-In",
      description:
        "Effortlessly check in and out of projects using QR codes for accurate participation tracking",
      icon: <IoQrCodeOutline className="w-[34px] h-[34px]" />,
    },
    {
      Name: "Digital Certificate",
      description:
        "Send automated reminders and recognize volunteers with digital certificates",
      icon: <Medal className="w-[34px] h-[34px]" />,
    },
    {
      Name: "Gamification",
      description:
        "Generate reports on volunteer hours, project outcomes, and community impact",
      icon: <IoGameControllerOutline className="w-[34px] h-[34px]" />,
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -350 : 350,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col p-10 bg-white relative">
      {/* Title Section */}
      <div className="w-full flex flex-col justify-center text-center gap-5 mb-10">
        <h1 className="text-[40px] font-bold">For Citizen Volunteers</h1>
        <p className="text-[#464646] text-lg max-w-2xl mx-auto">
          Discover meaningful ways to contribute, track your service, and be
          recognized for your invaluable effort in building a stronger Rwanda.
        </p>
      </div>

      {/* Horizontal Scroll with Side Icons */}
      <div className="relative">
        {/* Left Icon */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100"
        >
          <MdChevronLeft size={30} />
        </button>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-hidden snap-x snap-mandatory"
        >
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

        {/* Right Icon */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100"
        >
          <MdChevronRight size={30} />
        </button>
      </div>
    </div>
  );
}

export default Voluteers;
