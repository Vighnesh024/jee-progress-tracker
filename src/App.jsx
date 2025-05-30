// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/ProfileSettings";
import PrivateRoute from "./components/PrivateRoute";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex">
          <Sidebar /> {/* Sidebar will show only if user is logged in, handle that logic inside Sidebar if needed */}
          <div className="ml-64 w-full p-6">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />


            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
