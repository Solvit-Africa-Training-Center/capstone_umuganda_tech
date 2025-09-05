import React from "react";
import { Check, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function Success() {
  return (
    <div className="flex flex-col items-center justify-between h-screen px-6 py-8 bg-white">
      {/* Back Arrow */}
      <div className="w-full flex items-start">
        <ArrowLeft className="w-6 h-6 cursor-pointer" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Check inside Circle */}
        <div className="w-16 h-16 rounded-full border border-green-600 flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-2">Success!</h2>

        {/* Subtitle */}
        <p className="text-gray-500 text-center text-sm max-w-[250px]">
          Congratulations! You have been successfully authenticated
        </p>
      </div>

      {/* Button */}
      <Link to='/leader_info'>
      <button className="w-[80%] py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition">
        Continue
      </button>
      </Link>
    </div>
  );
}

export default Success;
