import React from "react";

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  volunteers: string;
  impact: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, title, description, volunteers, impact }) => {
  return (
    <div className="bg-white rounded-xl shadow-md w-[366px]  overflow-hidden flex flex-col flex-shrink-0 snap-start">
      <img src={image} alt={title} className="h-[367px] w-full object-cover" />
     
      <div className="p-4 flex flex-col flex-grow">
      <div className="flex">
          <h3 className="font-semibold text-base">{title}</h3>
          <span className="bg-green-100 w-[6rem] text-green-700 px-2 py-1 rounded-full text-xs">
            Impact: {impact}
          </span>
      </div>
   
        <p className="text-sm text-gray-600 mt-2">{description}</p>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <p>{volunteers}</p>
       
        </div>

        <button className="mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          Plan Project
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
