import React from "react";
import { ArrowUp } from "lucide-react";

const Impact = () => {
  const metrics = [
    {
      title: "Average Impact Score",
      value: "85%",
      change: "+5%",
      description: "Compared to previous quarter’s recommendations",
    },
    {
      title: "Projects Drafted",
      value: "12%",
      change: "+5%",
      description: "Based on AI recommendations this month.",
    },
    {
      title: "Volunteer Engagement Rate",
      value: "78%",
      change: "+5%",
      description: "Predicted increase for recommended projects.",
    },
    {
      title: "Projects Drafted",
      value: "12%",
      change: "+5%",
      description: "Based on AI recommendations this month.",
    },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-6">Impact Overview</h2>

      {/* Full height snap scroll (one card at a time) */}
      <div className="flex flex-col h-[332px] overflow-y-auto pr-2 scrollbar-hide snap-y snap-mandatory">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 border flex flex-col justify-between w-full snap-start h-[332px]"
          >
            <h3 className="text-sm text-gray-600 mb-2">{metric.title}</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{metric.value}</span>
              <span className="text-green-600 flex items-center text-sm font-semibold">
                <ArrowUp size={14} className="mr-1" />
                {metric.change}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-2">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Impact;
