import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { getUserProgress } from "../firebase/progress";
import { useSwipeable } from "react-swipeable";

import {
  BarChart2,
  ClipboardCheck,
  Clock,
  PlusCircle,
} from "lucide-react";

const DashboardMobile = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [suggestTasks, setSuggestTasks] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showProgressForm, setShowProgressForm] = useState(false);

  const user = auth.currentUser;

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

  const fetchUserName = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const name = docSnap.exists()
        ? docSnap.data().displayName
        : user.displayName || user.email;
      setDisplayName(name || "");
    } catch (error) {
      console.error("Error fetching user name:", error);
      setDisplayName(user.displayName || user.email || "");
    }
  };

  useEffect(() => {
    if (user) {
      fetchProgress();
      fetchUserName();
    }
  }, [user]);

  const handleSessionEnd = (workSessionEnded) => {
    setSuggestTasks(workSessionEnded);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setActiveTab((prev) => Math.min(prev + 1, 2)),
    onSwipedRight: () => setActiveTab((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <header className="p-4 text-center text-xl font-bold text-indigo-700">
        Welcome, {displayName}!
      </header>

      {/* Swipeable Views */}
      <div className="flex-1 overflow-hidden" {...swipeHandlers}>
        {activeTab === 0 && (
          <div className="p-4">
            <ProgressChart data={progress} />
            <ProgressPieChart data={progress} />
          </div>
        )}
        {activeTab === 1 && (
          <div className="p-4">
            <DailyChecklist userId={user?.uid} highlight={suggestTasks} />
          </div>
        )}
        {activeTab === 2 && (
          <div className="p-4">
            <PomodoroTimer onSessionEnd={handleSessionEnd} />
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowProgressForm(true)}
        className="fixed bottom-20 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg z-40"
      >
        <PlusCircle size={28} />
      </button>

      {/* Sticky Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center shadow-md z-30">
        <button
          onClick={() => setActiveTab(0)}
          className={`flex flex-col items-center text-sm ${activeTab === 0 ? "text-indigo-600" : "text-gray-500"}`}
        >
          <BarChart2 size={20} />
          Progress
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={`flex flex-col items-center text-sm ${activeTab === 1 ? "text-indigo-600" : "text-gray-500"}`}
        >
          <ClipboardCheck size={20} />
          Checklist
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`flex flex-col items-center text-sm ${activeTab === 2 ? "text-indigo-600" : "text-gray-500"}`}
        >
          <Clock size={20} />
          Timer
        </button>
      </nav>

      {/* Progress Form Modal */}
      {showProgressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Add Progress</h2>
            <ProgressForm
              userId={user?.uid}
              onProgressUpdated={() => {
                fetchProgress();
                setShowProgressForm(false);
              }}
            />
            <button
              className="mt-4 w-full text-center text-red-500 font-semibold"
              onClick={() => setShowProgressForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;