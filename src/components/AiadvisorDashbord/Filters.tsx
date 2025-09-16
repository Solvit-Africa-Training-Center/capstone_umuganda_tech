import React from "react";

const Filters = () => {
  return (
    <div className="flex gap-4  h-[101px]  bg-[#EFEDED] items-center w-[937px] p-3 rounded-md">
      <p className="font-semibold text-h5">Filter by:
      </p>
      <div className="flex gap-4 mt-6 mb-10">
        <select className="border rounded-lg px-4 py-2 bg-white text-gray-700">
          <option>Goal Area</option>
        </select>
        <select className="border rounded-lg px-4 py-2 bg-white text-gray-700">
          <option>Impact Level</option>
        </select>
        <select className="border rounded-lg px-4 py-2 bg-white text-gray-700">
          <option>Resources Needed</option>
        </select>
      </div>

    </div>
  );
};

export default Filters;
