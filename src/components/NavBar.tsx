import logo from "../images/Umuganda-removebg-preview 2.png";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { User, LogOut, ArrowLeft } from "lucide-react";
import type { RootState } from "../store";
import { useAuth } from "../hooks/useAuth";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { logout } = useAuth();
  const location = useLocation();
  
  // Check if leader is on community page
  const isLeaderOnCommunity = user?.role?.toLowerCase() === 'leader' && location.pathname === '/community';
  
  const publicNavLinks = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/#about_us" },
    { name: "How It Works", to: "/#how_it_works" },
    { name: "Projects", to: "/projects" },
  ];

  const volunteerNavLinks = [
    { name: "Dashboard", to: "/dashboard" },
    { name: "Projects", to: "/projects" },
    { name: "Community", to: "/community" },
    { name: "QR Scanner", to: "/qr-scanner" },
  ];

  const leaderNavLinks = [
    { name: "Dashboard", to: "/dashboard" },
    { name: "My Projects", to: "/my-projects" },
    { name: "Create Project", to: "/create-project" },
    { name: "Community", to: "/community" },
  ];

  const getNavLinks = () => {
    if (!isAuthenticated) return publicNavLinks;
    return user?.role?.toLowerCase() === 'leader' ? leaderNavLinks : volunteerNavLinks;
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  // Hide navbar completely for leaders on community page
  if (isLeaderOnCommunity) {
    return null;
  }

  return (
    <div className="font-opensans">
      <nav className="absolute top-0 left-0 w-full z-20 p-6 flex items-center justify-between text-white bg-black/10 backdrop-blur-sm">
        <div className="flex items-center flex-row justify-center">
          <img src={logo} alt="UmugandaTech Logo" className="h-16 w-16" />
          <span className="text-2xl font-bold text-primaryColor-900">UmugandaTech</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map(({ name, to }) => (
            <NavLink
              key={name}
              to={to}
              end={to === "/"}  
              className={({ isActive }) =>
                isActive
                  ? "text-text-primary font-semibold px-4 py-2 rounded-full bg-white/10"
                  : "hover:text-primaryColor-900 px-4 py-2 rounded-full hover:bg-white/10 transition"
              }
            >
              {name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.first_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primaryColor-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                )}
                <span className="text-sm font-medium">{user.first_name}</span>
              </div>
              
              <NavLink
                to="/profile"
                className="hover:text-primaryColor-900 px-3 py-2 rounded-full hover:bg-white/10 transition flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </NavLink>
              
              <button
                onClick={handleLogout}
                className="hover:text-red-400 px-3 py-2 rounded-full hover:bg-white/10 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/signin"
                className="hover:text-primaryColor-900 px-4 py-2 rounded-full hover:bg-white/10 transition"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-primaryColor-900 hover:bg-accent-900 text-white px-4 py-2 rounded-full transition"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex flex-col items-center justify-center space-y-6 text-white text-xl z-30">
          {navLinks.map(({ name, to }) => (
            <NavLink
              key={name}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-primaryColor-900 font-semibold px-4 py-2 rounded-full bg-white/10"
                  : "hover:text-primaryColor-900 px-4 py-2 rounded-full hover:bg-white/10 transition"
              }
            >
              {name}
            </NavLink>
          ))}
          
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center space-x-3 px-4 py-2">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.first_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primaryColor-900 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                )}
                <span className="font-medium">{user.first_name} {user.last_name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="hover:text-red-400 px-4 py-2 rounded-full hover:bg-white/10 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/signin"
                onClick={() => setMenuOpen(false)}
                className="hover:text-primaryColor-900 px-4 py-2 rounded-full hover:bg-white/10 transition"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-primaryColor-900 hover:bg-accent-900 text-white px-6 py-3 rounded-full transition"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
