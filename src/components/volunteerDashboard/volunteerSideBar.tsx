import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, MessageCircle, ClipboardCheck, Search, X, Menu } from 'lucide-react';
import logo from '../images/Umuganda-removebg-preview 1.png';

type Page = 'dashboard' | 'checkin' | 'community' | 'settings';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

const links: { id: Page; path: string; label: string; Icon: React.ElementType }[] = [
  { id: 'dashboard', path: '/volunteer', label: 'Discover', Icon: Search },
  { id: 'community', path: '/volunteer/community-hub', label: 'Hub', Icon: ClipboardCheck },
  { id: 'checkin', path: '/volunteer/check-in', label: 'Check-In', Icon: MessageCircle },
  { id: 'settings', path: '/volunteer/settings', label: 'Settings', Icon: Settings },
];

const VolunteerSideBar: React.FC<SidebarProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        className={`bg-[#EFEDED] min-h-screen w-72 p-6 border-r border-gray-400  fixed top-0 left-0 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0 z-40`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <img src={logo} alt="Umuganda Tech Logo" className="h-14 w-14" />
            <h2 className="text-h5 font-bold text-primaryColor-900 ml-2">UmugandaTech</h2>
          </div>
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <nav className="space-y-2 border-t border-gray-400 mt-4 md:mt-0">
          {links.map(({ id, path, label, Icon }) => (
            <NavLink
              key={id}
              to={path}
              end
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-accent-900 text-primaryColor-900' : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="pl-2">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default VolunteerSideBar;
