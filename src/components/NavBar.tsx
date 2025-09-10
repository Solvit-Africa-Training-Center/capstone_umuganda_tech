import logo from "../images/Umuganda-removebg-preview 2.png";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/#about_us" },
    { name: "How It Works", to: "/#how_it_works" },
    { name: "Projects", to: "/#projects" },
  ];

  return (
    <div className="font-opensans">
      <nav className="absolute top-0 left-0 w-full  z-20 p-6 flex items-center justify-around text-white">
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
                  ? "text-text-primary font-semibold px-4 py-2 rounded-full hover:bg-accent-300 hover:text-error-800"
                  : "hover:text-error-800 px-4 py-2 rounded-full hover:bg-accent-300 transition"
              }
            >
              {name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Sign In (separate div) */}
        <div className="hidden md:block">
          <NavLink
            to="/signup"
            className={({ isActive }) =>
                isActive
                  ? "text-text-primary font-semibold px-4 py-2 rounded-full bg-white/5"
                  : "hover:text-error-800 px-4 py-2 rounded-full hover:bg-accent-300 transition"
              }
          >
            Sign In
          </NavLink>
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
        <div className="md:hidden absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center space-y-6 text-white text-xl">
          {navLinks.map(({ name, to }) => (
            <NavLink
              key={name}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-text-primary font-semibold px-4 py-2 rounded-full hover:bg-accent-300 hover:text-error-800"
                  : "hover:text-error-800 px-4 py-2 rounded-full hover:bg-accent-300 transition"
              }
            >
              {name}
            </NavLink>
          ))}
          <NavLink
            to="/signin"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
                isActive
                  ? "text-text-primary font-semibold px-4 py-2 rounded-full bg-white/5"
                  : "hover:text-error-800 px-4 py-2 rounded-full hover:bg-accent-300 transition"
              }
          >
            Sign In
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default NavBar;
