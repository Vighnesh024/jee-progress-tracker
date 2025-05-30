import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = ({ onLogout }) => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <header className="flex justify-between items-center p-4 shadow-md fixed top-0 left-64 right-0 bg-white dark:bg-gray-900 z-50">
      <h1
        className={`text-2xl font-bold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        My App
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:brightness-110 transition"
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          onClick={onLogout}
          className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
