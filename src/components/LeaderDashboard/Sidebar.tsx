import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu, X, House, Layers, Cpu, Eye, BarChart2, Settings
} from 'lucide-react';
import logo from "../images/Umuganda-removebg-preview 1.png";

const items = [
  { label: 'Dashboard', Icon: House, to: "/leader" },
  { label: 'Project Management', Icon: Layers, to: "/leader/projects" },
  { label: 'AI Project Advisor', Icon: Cpu, to: "/leader/ai-advisor" },
  { label: 'Live Dashboard', Icon: Eye, to: "/leader/live-dashboard" },
  { label: 'Reporting', Icon: BarChart2, to: "/leader/reporting" },
  { label: 'Settings', Icon: Settings, to: "/leader/settings" },
];

const Sidebar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* mobile toggle */}
      <div className="md:hidden fixed top-4 left-0 z-50">
        <button
          className="p-2 rounded-r bg-[#F9F6F2] border-r border-gray-200 focus:outline-none focus:ring"
          onClick={() => setSidebarOpen(true)}
          style={{ display: sidebarOpen ? 'none' : 'block' }}
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      <aside
        className={`
          bg-[#EFEDED] min-h-screen p-6 border-r border-gray-400
          min-w-80
          fixed top-0 left-0
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0
          z-40
        `}
      >
        <div className="flex items-center justify-between mb-10 md:mb-10">
          <div className="flex items-center">
            <img src={logo} alt="Umuganda Tech Logo" className="h-14 w-14" />
            <h2 className="text-h5 font-bold text-primaryColor-900 ml-2">
              UmugandaTech
            </h2>
          </div>
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <nav className="space-y-2 border-t border-gray-400 mt-4 md:mt-0">
          {items.map(({ label, Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/leader"} 
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-accent-900 text-primaryColor-900'
                    : 'text-gray-700 hover:bg-gray-200'
                }`
              }
              onClick={() => {
                if (sidebarOpen) {
                  setSidebarOpen(false);
                }
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="pl-2">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* backdrop when sidebar open on small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
