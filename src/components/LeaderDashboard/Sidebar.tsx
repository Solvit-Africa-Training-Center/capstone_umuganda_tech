import React, { useState } from 'react';
import {
  Menu,
  X,
  House,
  Layers,
  Cpu,
  Eye,
  BarChart2,
  Settings,
} from 'lucide-react';
import logo from "../images/Umuganda-removebg-preview 1.png";

const items = [
  { label: 'Dashboard', Icon: House },
  { label: 'Project Management', Icon: Layers },
  { label: 'AI Project Advisor', Icon: Cpu },
  { label: 'Live Dashboard', Icon: Eye },
  { label: 'Reporting', Icon: BarChart2 },
  { label: 'Settings', Icon: Settings },
];

const Sidebar: React.FC = () => {
  const [active, setActive] = useState<string>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <>
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
          w-60
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
          {/* Show X only on small when open */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <nav className="space-y-2 border-t border-gray-400 mt-4 md:mt-0">
          {items.map(({ label, Icon }) => {
            const isActive = label === active;
            return (
              <a
                key={label}
                href="#"
                onClick={() => {
                  setActive(label);
                  if (sidebarOpen) {
                    setSidebarOpen(false);
                  }
                }}
                className={`
                  flex items-center px-3 py-2
                  ${isActive
                    ? 'bg-accent-900 rounded text-primaryColor-900'
                    : 'text-gray-700 hover:bg-gray-200'}
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="pl-2">{label}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Overlay / backdrop when sidebar is open (small screens) */}
      { sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
