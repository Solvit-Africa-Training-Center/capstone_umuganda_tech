import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FileText } from "lucide-react";
import leader1 from "../images/leader-icons/leader.png";
import leader2 from "../images/leader-icons/leader1.png";
import leader3 from "../images/leader-icons/leader2.png";

interface Step {
  iconSrc?: any;
  iconComponent?: React.ReactNode;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    iconSrc: leader1,
    title: "AI Project Advisor",
    description:
      "Utilize intelligent recommendations for optimal project planning and resource allocation",
  },
  {
    iconSrc: leader2,
    title: "Live Dashboard",
    description:
      "Monitor community service activities, volunteer engagement, and impact in real-time.",
  },
  {
    iconSrc: leader3,
    title: "Automated SMS",
    description:
      "Send automated notifications and reminders to volunteers for upcoming activities.",
  },
  {
    iconComponent: (
      <FileText className="text-primaryColor-900 w-12 h-12 mb-4" />
    ),
    title: "Advanced Reporting",
    description:
      "Generate comprehensive reports on volunteer hours, project outcomes, and community impact.",
  },
];

const CarouselSteps: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -560 : 560, // scroll distance ≈ card width
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 pb-20 font-opensans">
      <div>
        <h1 className="text-h1 font-semibold text-center mb-4 mt-10">
          For Community Leaders
        </h1>
        <p className="text-start text-gray-600 text-lg md:w-[904px] mx-auto mb-10 px-4">
          Streamline your operations and amplify with powerful tools designed
          for efficient project management and volunteer engagement.
        </p>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-hidden scroll-smooth"
      >
        <div className="flex gap-5 px-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#F9F6F2] min-w-[541px] h-[330px] rounded-lg shadow-md flex flex-col items-start justify-center pl-20"
            >
              {step.iconSrc ? (
                <img src={step.iconSrc} alt={step.title} />
              ) : (
                step.iconComponent
              )}
              <h3 className="text-h1 font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-base max-w-[240px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => scroll("left")}
        className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg z-10 hover:bg-gray-100"
      >
        <FaChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 hover:text-gray-900" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg z-10 hover:bg-gray-100"
      >
        <FaChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700 hover:text-gray-900" />
      </button>
    </div>
  );
};

export default CarouselSteps;
