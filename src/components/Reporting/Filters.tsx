import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

const Filters = () => {
  return (
    <div className="bg-white rounded-xl flex flex-col gap-5 ">
      {/* Title */}
      <h3 className="font-bold text-center text-lg shadow px-6 py-3">
        Filters
      </h3>

      {/* Filters row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Date Range */}
        <div className="p-5">
          <label className="text-sm font-bold flex justify-center items-center p-3">Date Range</label>
          <div className="flex items-center rounded p-5 w-[251px] bg-[#D9D9D9]">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <input
              type="text"
              value="Jan 01, 2025 - Dec 31, 2025"
              readOnly
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div className="p-5">
          <label className="text-sm font-bold  flex justify-center items-center p-3">Location</label>
          <div className="flex items-center  rounded p-5 w-[251px] bg-[#D9D9D9]">
            <select className="appearance-none w-full  rounded text-sm">
              <option>Select Location</option>
              <option>Kigali</option>
              <option>Huye</option>
            </select>
            <FiChevronDown className="text-gray-500" />
          </div>
        </div>

        {/* Project Type */}
        <div className="p-5">
          <label className="text-sm font-bold flex justify-center items-center p-3">Project Type</label>
          <div className="flex items-center  rounded p-5  w-[251px]  bg-[#D9D9D9]">
            <select className="appearance-none w-full rounded text-sm">
              <option>Select Type</option>
              <option>Environmental</option>
              <option>Health</option>
            </select>
            <FiChevronDown className="text-gray-500" />
          </div>
        </div>

        {/* Skills */}
        <div className="p-5">
          <label className="text-sm font-bold flex justify-center items-center p-3">Skills</label>
          <div className="flex items-center  rounded p-5  w-[251px]  bg-[#D9D9D9]">
            <select className="appearance-none w-full  rounded">
              <option>Select Skill</option>
              <option>Leadership</option>
              <option>Training</option>
            </select>
            <FiChevronDown className="text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
