import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FileText } from 'lucide-react';
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
  { iconSrc: leader1, title: 'AI Project Advisor', description: 'Utilize intelligent recommendations for optimal project planning and resocurec allocation' },
  { iconSrc: leader2, title: 'Live Dashboard', description: 'M,onitor community service activities, volunteer engagement, and impact in real-time.' },
  { iconSrc: leader3, title: 'Automated SMS', description: 'S,end automated notifications and reminders to volunteers for upcoming activities.' },
  { iconComponent: <FileText className='text-primaryColor-900 w-12 h-12' />, title: 'Advanced Reporting', description: 'G,enerate comprehensive reports on volunteer hours, project outcomes, and community impact.' },
];

const CarouselSteps: React.FC = () => {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex(i => Math.max(0, i - 1));
  const next = () => setIndex(i => Math.min(steps.length - 1, i + 1));
  
  return (
    <div className="relative w-full  overflow-hidden bg-gray-50 pb-20 font-opensans">
      <div>
        <h1 className='text-h1 font-semibold text-center mb-4 mt-10'>
          For Community Leaders
        </h1>
        <p className='text-start text-gray-600 text-lg md:w-[904px] mx-auto mb-10 px-4'>
          Streamline your operations and amplify with powerful tools designed for efficent project management and volunteer engagement.
        </p>
      </div>
      <div
        className="flex transition-transform duration-500 "
        style={{ transform: `translateX(-${index * (100 / 3)}%)` }}
      >
        {steps.map((step, idx) => (
          <div key={idx} className="px-4 gap-5 flex flex-row">
            <div className="bg-[#F9F6F2] min-w-[541px] h-[330px] rounded-lg shadow-md flex flex-col items-start justify-center pl-20">
              {step.iconSrc ? (
                <img src={step.iconSrc} alt={step.title} className=" " />
              ) : (
                <div className="mb-4">{step.iconComponent}</div>
              )}
              <h3 className="text-h1 font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-base max-w-[240px]">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Arrows */}
      <button
        onClick={prev}
        disabled={index === 0}
        className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg z-10 disabled:opacity-50"
      >
        <FaChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 hover:text-gray-900" />
      </button>
      <button
        onClick={next}
        disabled={index === steps.length - 1}
        className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg z-10 disabled:opacity-50"
      >
        <FaChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700 hover:text-gray-900" />
      </button>
    </div>
  );
};

export default CarouselSteps;