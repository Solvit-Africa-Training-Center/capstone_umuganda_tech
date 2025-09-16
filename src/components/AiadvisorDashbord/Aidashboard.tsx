import React from "react";
import Sidebar from "./Sidebar";
import NavbarDash from "./NavbarDash";
import Advisor from "./Advisor";

const Aidashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50 ">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <NavbarDash />

        {/* Page Content */}
        <main className="p-6 overflow-y-auto flex-1">
          <Advisor />
        </main>
      </div>
    </div>
  );
};

export default Aidashboard;
