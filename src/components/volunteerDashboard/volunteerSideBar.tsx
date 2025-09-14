// src/components/volunteerComponents/Sidebar/Sidebar.tsx

import React from "react";
import { NavLink } from "react-router-dom";
import {
  Settings,
  CheckCircle,
  Users,
  BarChart3
} from "lucide-react";

// Define the type of the pages
type Page = "dashboard" | "checkin" | "community" | "settings";

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

const links: { id: Page; path: string; label: string; Icon: React.ElementType }[] = [
  { id: "dashboard", path: "/volunteer", label: "Volunteer Dashboard", Icon: BarChart3 },
  { id: "checkin", path: "/volunteer/check-in", label: "Volunteer Check In", Icon: CheckCircle },
  { id: "community", path: "/volunteer/community-hub", label: "Volunteer Community Hub", Icon: Users },
  { id: "settings", path: "/volunteer/settings", label: "Volunteer Settings", Icon: Settings }
];

const VolunteerSideBar: React.FC<SidebarProps> = () => {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-4 text-xl font-bold">Ungageable Tech</div>
      <nav className="flex flex-col space-y-2 p-4">
        {links.map(({ id, path, label, Icon }) => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-accent-900 text-primaryColor-900"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
            // optionally if using manual state instead of routing:
            // onClick={() => setCurrentPage(id)}
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default VolunteerSideBar;
