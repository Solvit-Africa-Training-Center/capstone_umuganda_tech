import React from "react";
import work1 from "../images/icon-work/Vector.png";
import work2 from "../images/icon-work/Group.png";
import work3 from "../images/icon-work/grup1.png";
import work4 from "../images/icon-work/Group2.png";
import AboutUs from "./AboutUs";

interface Step {
  iconSrc: string;
 num: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    iconSrc: work1,
    title: "Discover Project",
    num: 1,
    description: "Browse a wide range of community service activities in your area or based on your interest.",
  },
  {
    iconSrc: work2,
    num: 2,
    title: "Participate & Check-In",
    description: "Join projects, attend events, and easily track your hours using QR code check-ins.",
  },
  {
    iconSrc: work3,
    num: 3,
    title: "Earn Recognition",
    description: "Receive digital certificates for your contributions and track your progress and impact.",
  },
  {
    iconSrc: work4,
    num: 4,
    title: "Make a Difference",
    description: "Contribute to a stronger, more vibrant community in Rwanda, one project at a time.",
  },
];

const AboutAndHowItWorks: React.FC = () => {
  return (
    <section className="font-opensans bg-gray-50 py-16 px-6 md:px-12">
      <AboutUs/>
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-h1 text-text-secondary font-semibold text-center mb-8">
          How It Works
        </h2>
        <p className="text-start mb-12 text-neutral-900 text-h5 max-w-[785px]">
          Joining UmugandaTech is simple. Follow these steps to start making a
          difference in your community today.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-[#F9F6F2] p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="mb-4 flex flex-col items-center space-y-2 justify-center text-center">
                <img
                  src={step.iconSrc}
                  alt={step.title}
                  className="inline-block mx-auto w-[44px] h-[50px]"
                />
                <div className="text-[24px] font-bold text-text-primary bg-primaryColor-900  text-center rounded-full h-[42px] w-[46px]">{step.num}</div>
              </div>
              <h3 className="text-h3 w-[210px] font-semibold text-text-secondary mb-2">{step.title}</h3>
              <p className="text-neutral-700 font-regular w-[196px] text-sm text-start">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutAndHowItWorks;
