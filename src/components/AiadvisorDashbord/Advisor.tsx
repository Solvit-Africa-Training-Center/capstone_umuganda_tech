import React from "react";
import StatsCard from "./StatsCard";
import ProjectCard from "./ProjectCard";
import Filters from "./Filters";
import FeedbackChart from "./FeedbackChart";
import Impact from "./Impact";
import { HiUsers } from "react-icons/hi";
import { FaInfo } from "react-icons/fa";
import { BsFillPieChartFill } from "react-icons/bs";
import SuccessRateChart from "./SuccessRateChart";

const Advisor = () => {
  return (
    <div className="p-6 mr-5">
      {/* Title */}
      <div className="flex flex-col gap-3">
       
        <p className="text-gray-600 text-h5 font-semibold">
          Leverage AI to identify and prioritize high-impact community projects
          based on data, feedback, and local goals.
        </p>
      </div>

      {/* Stats Section (Horizontal scroll) */}
      <div className="flex gap-6 mt-6 w-[70%] rounded-md overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide ">
        {/* <div className="flex-shrink-0  snap-start"> */}
          <StatsCard
            title="Overall Impact Potential"
            value="92%"
            subtitle="Projects with high community and environmental benefits"
            icon={<FaInfo className="text-primaryColor-900" />}
          />
        {/* </div> */}
        {/* <div className="flex-shrink-0  snap-start"> */}
          <StatsCard
            title="Community Sentiment"
            value="Positive"
            subtitle="High volunteer and beneficiary satisfaction"
            icon={<HiUsers className="text-primaryColor-900" />}
          />
        {/* </div> */}
        {/* <div className="flex-shrink-0  snap-start"> */}
          <StatsCard
            title="Resource Optimization"
            value="Optimal"
            subtitle="Efficient use of budget and volunteer hours"
            icon={<BsFillPieChartFill className="text-[#DA8700]" />}
          />
        {/* </div> */}
      </div>

      {/* Filters */}
      <Filters />

      {/* Recommended Projects (Horizontal scroll) */}
      <h2 className="text-h3 font-semibold mb-4">Recommended Projects</h2>
      <div className="flex gap-6 overflow-x-auto pb-4 w-[80%] snap-x snap-mandatory scrollbar-hide">
        {/* <div className="flex-shrink-0 w-[320px] snap-start"> */}
          <ProjectCard
            image="house.png"
            title="Community Garden Extension for Food Security"
            description="Expand existing community gardens to improve food security for local families."
            volunteers="30 volunteers needed"
            impact="86%"
          />
        {/* </div> */}
        {/* <div className="flex-shrink-0 w-[320px] snap-start"> */}
          <ProjectCard
            image="peaple.png"
            title="Digital Literacy Workshops for Seniors"
            description="Organize workshops to teach basic computer skills to elderly community members."
            volunteers="15 volunteers needed"
            impact="86%"
          />
        {/* </div> */}
        {/* <div className="flex-shrink-0 w-[320px] snap-start"> */}
          <ProjectCard
            image="road.png"
            title="Street Cleaning Campaign"
            description="Community-led efforts to clean and beautify local streets and public spaces."
            volunteers="20 volunteers needed"
            impact="80%"
          />
          <ProjectCard
            image="voluteer.jpg"
            title="Awareness campaign"
            description="Organize Workshops to teach basic computer and internet skills to senior cityzens,bridging the digital"
            volunteers="25 volunteers needed"
            impact="80%"
          />
        {/* </div> */}
      </div>

      <div className="flex w-[90%] overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide ">
        <div className="flex-shrink-0 w-full snap-start">
          <FeedbackChart />
        </div>
        <div className="flex-shrink-0 w-full snap-start">
          <SuccessRateChart />
        </div>
      </div>

      {/* Impact Overview (Vertical scroll inside Impact component) */}
      <Impact />
    </div>
  );
};

export default Advisor;
