// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ darkMode }) => {
  const baseClasses =
    "flex flex-col w-64 h-screen p-6 fixed top-0 left-0 transition-colors duration-500 ease-in-out";
  const bgClass = darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-700";
  const activeLink = "bg-brandBlue text-white rounded-md px-4 py-2 font-semibold";

  return (
    <nav className={`${baseClasses} ${bgClass} shadow-lg`}>
      <h2 className="text-2xl font-bold mb-8">JEE Tracker</h2>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `mb-3 block px-4 py-2 rounded hover:bg-brandBlue hover:text-white transition ${
            isActive ? activeLink : ""
          }`
        }
        end
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `mb-3 block px-4 py-2 rounded hover:bg-brandBlue hover:text-white transition ${
            isActive ? activeLink : ""
          }`
        }
      >
        Profile
      </NavLink>

      
    </nav>
  );
};

export default Sidebar;
