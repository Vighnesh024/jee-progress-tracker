import React, { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "pomodoroTimerState";

const PomodoroTimer = ({ onSessionEnd }) => {
  // Defaults
  const DEFAULT_WORK = 25 * 60; // 25 minutes
  const DEFAULT_BREAK = 5 * 60; // 5 minutes

  // Load saved state from localStorage or default
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  const [workDuration, setWorkDuration] = useState(savedState.workDuration || DEFAULT_WORK);
  const [breakDuration, setBreakDuration] = useState(savedState.breakDuration || DEFAULT_BREAK);
  const [timeLeft, setTimeLeft] = useState(savedState.timeLeft ?? workDuration);
  const [isRunning, setIsRunning] = useState(savedState.isRunning || false);
  const [onBreak, setOnBreak] = useState(savedState.onBreak || false);

  const timerRef = useRef(null);

  // Initialize audio once, keep ref to avoid multiple instantiations
  const notificationSound = useRef(new Audio("../../public/notification.mp3"));

  // Save state to localStorage whenever any related state changes
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ workDuration, breakDuration, timeLeft, isRunning, onBreak })
    );
  }, [workDuration, breakDuration, timeLeft, isRunning, onBreak]);

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t === 0) {
          // Play notification sound & show notification
          notifyEnd(onBreak);

          if (!onBreak) {
            setOnBreak(true);
            return breakDuration;
          } else {
            setOnBreak(false);
            return workDuration;
          }
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, onBreak, workDuration, breakDuration]);

  // Notification + Sound function
  const notifyEnd = (isBreak) => {
    // Play sound
    notificationSound.current.play().catch((err) => {
      // Handle any play errors (like user hasn't interacted yet)
      console.log("Audio play failed:", err);
    });

    // Show browser notification (if permission granted)
    if (Notification.permission === "granted") {
      new Notification(isBreak ? "Break Over! Time to Work." : "Work session done! Take a break.");
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Format time mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handlers for start/pause/reset
  const handleStartPause = () => setIsRunning((r) => !r);
  const handleReset = () => {
    setIsRunning(false);
    setOnBreak(false);
    setTimeLeft(workDuration);
  };

  // Handlers for custom durations (minutes input)
  const handleWorkDurationChange = (e) => {
    const val = Math.max(1, Number(e.target.value));
    setWorkDuration(val * 60);
    if (!onBreak) setTimeLeft(val * 60);
  };

  const handleBreakDurationChange = (e) => {
    const val = Math.max(1, Number(e.target.value));
    setBreakDuration(val * 60);
    if (onBreak) setTimeLeft(val * 60);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        backgroundColor: "#2563eb",
        color: "white",
        padding: "8px 20px",
        borderRadius: 6,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 18 }}>
        {onBreak ? "🍵 Break" : "⏳ Work"}: {formatTime(timeLeft)}
      </div>

      <button onClick={handleStartPause} style={buttonStyle}>
        {isRunning ? "Pause" : "Start"}
      </button>

      <button onClick={handleReset} style={buttonStyle}>
        Reset
      </button>

      <div>
        <label>
          Work (min):
          <input
            type="number"
            min="1"
            value={Math.floor(workDuration / 60)}
            onChange={handleWorkDurationChange}
            style={inputStyle}
          />
        </label>
      </div>

      <div>
        <label>
          Break (min):
          <input
            type="number"
            min="1"
            value={Math.floor(breakDuration / 60)}
            onChange={handleBreakDurationChange}
            style={inputStyle}
          />
        </label>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "6px 12px",
  fontSize: 14,
  borderRadius: 4,
  border: "none",
  cursor: "pointer",
  backgroundColor: "#3b82f6",
  color: "white",
};

const inputStyle = {
  marginLeft: 6,
  width: 50,
  borderRadius: 4,
  border: "none",
  padding: "4px 6px",
  fontSize: 14,
};

export default PomodoroTimer;
