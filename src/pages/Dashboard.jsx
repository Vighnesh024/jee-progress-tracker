import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getUserProgress } from "../firebase/progress";
import ProgressForm from "../components/ProgressForm";
import ProgressChart from "../components/ProgressChart";
import ProgressPieChart from "../components/ProgressPieChart";
import DailyChecklist from "../components/DailyChecklist";
import PomodoroTimer from "../components/PomodoroTimer";
import LoadingAnimation from "../components/LoadingAnimation";
import { ThemeContext } from "../context/ThemeContext.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [suggestTasks, setSuggestTasks] = useState(false);
  const user = auth.currentUser;
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  // Fetch progress data
  const fetchProgress = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserProgress(user.uid);
      setProgress(data);
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user display name
  const fetchUserName = async () => {
    if (!user) {
      setDisplayName("");
      return;
    }
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDisplayName(docSnap.data().displayName || user.displayName || "");
      } else {
        setDisplayName(user.displayName || user.email || "");
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      setDisplayName(user.displayName || user.email || "");
    }
  };

  useEffect(() => {
    fetchProgress();
    fetchUserName();
  }, [user]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle Pomodoro session end
  const handleSessionEnd = (workSessionEnded) => {
    if (workSessionEnded) {
      setSuggestTasks(true);
    } else {
      setSuggestTasks(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-brandDark" : "bg-brandLight"
        }`}
      >
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${darkMode ? "bg-brandDark" : "bg-brandLight"}`}>
      {/* Sidebar: hidden on mobile, visible on md+ */}
      <aside className="hidden md:block md:w-64 border-r border-gray-300 dark:border-gray-700">
        <Sidebar darkMode={darkMode} />
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-4 md:p-8 max-w-full md:max-w-5xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-6">
          <h1
            className={`text-3xl md:text-4xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-brandDark"
            }`}
          >
            {displayName ? `Welcome, ${displayName}!` : "Welcome!"}
          </h1>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-brandBlue to-indigo-600 text-white font-semibold shadow-lg hover:brightness-110 transition"
            >
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Progress Input Form */}
        <section
          className={`mb-8 rounded-lg shadow-lg p-4 md:p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <ProgressForm userId={user?.uid} onProgressUpdated={fetchProgress} />
        </section>

        {/* Text View */}
        <section className="mb-8">
          <h2
            className={`text-xl md:text-2xl font-semibold mb-4 ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Text View
          </h2>
          <div
            className={`rounded-lg shadow-lg p-4 md:p-6 min-h-[200px] overflow-auto ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {progress.length === 0 ? (
              <p
                className={`text-center text-base md:text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No progress tracked yet.
              </p>
            ) : (
              <ul className="space-y-3 text-gray-700 dark:text-gray-300 max-h-60 md:max-h-72 overflow-y-auto">
                {progress.map((item, index) => (
                  <li
                    key={item.id || index}
                    className="border border-gray-300 dark:border-gray-700 rounded-md p-3 flex justify-between items-center"
                  >
                    <span className="font-semibold text-base md:text-lg">{item.subjectName}</span>
                    <span className="text-sm md:text-base">
                      {item.topicsCompleted} / {item.totalTopics} completed
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Graph View */}
        <section className="mb-8">
          <h2
            className={`text-xl md:text-2xl font-semibold mb-4 ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Graph View
          </h2>
          <div
            className={`rounded-lg shadow-lg p-4 md:p-6 min-h-[280px] ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <ProgressChart data={progress} />
          </div>
        </section>

        {/* Pie View */}
        <section className="mb-8">
          <h2
            className={`text-xl md:text-2xl font-semibold mb-4 ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Pie View
          </h2>
          <div
            className={`rounded-lg shadow-lg p-4 md:p-6 min-h-[280px] ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <ProgressPieChart data={progress} />
          </div>
        </section>

        {/* Daily Checklist */}
        <section className="mb-8">
          <DailyChecklist userId={user?.uid} highlight={suggestTasks} />
        </section>

        {/* Pomodoro Timer */}
        <section className="mb-8 max-w-xl mx-auto">
          <PomodoroTimer onSessionEnd={handleSessionEnd} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
