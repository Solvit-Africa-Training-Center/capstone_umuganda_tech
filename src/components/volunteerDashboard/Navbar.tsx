
import React from "react";

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-white shadow p-4 flex justify-end items-center">
      <div className="flex items-center space-x-3">
        <span className="hidden md:block font-medium">Jane Doe</span> 
        <img
          src="/path/to/avatar.jpg"
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Navbar;
