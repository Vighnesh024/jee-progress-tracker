import React, { useEffect, useState } from "react";
import {
  addTask,
  getTodayTasks,
  toggleTaskCompletion,
  deleteTask,
  clearCompletedTasksForUser,
} from "../firebase/checklist"; // Make sure your firebase functions support clearing tasks

function DailyChecklist({ userId }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  // Load today's tasks from Firestore
  const fetchTasks = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getTodayTasks(userId);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
    setLoading(false);
  };

  // Add a new task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await addTask(userId, newTask.trim());
    setNewTask("");
    fetchTasks();
  };

  // Toggle task completed status
  const handleToggle = async (taskId, currentStatus) => {
    await toggleTaskCompletion(userId, taskId, currentStatus);
    fetchTasks();
  };

  // Delete a task
  const handleDelete = async (taskId) => {
    await deleteTask(userId, taskId);
    fetchTasks();
  };

  // Auto-clear completed tasks at day’s end (run on component mount)
  useEffect(() => {
    const clearCompletedAtMidnight = () => {
      const now = new Date();
      const millisTillMidnight =
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
      setTimeout(async () => {
        await clearCompletedTasksForUser(userId);
        fetchTasks();
        clearCompletedAtMidnight(); // Set timeout for next day
      }, millisTillMidnight);
    };

    if (userId) {
      fetchTasks();
      clearCompletedAtMidnight();
    }
  }, [userId]);

  // Counts for completed vs total
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  // Emoji feedback for progress
  const getProgressEmoji = () => {
    if (completedTasks === 0) return "😴";
    if (completedTasks === totalTasks) return "🎉✅";
    if (completedTasks / totalTasks >= 0.5) return "👍🙂";
    return "⌛😌";
  };

  if (loading) return <p>Loading checklist...</p>;

  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${
        totalTasks === completedTasks
          ? "bg-green-100 dark:bg-green-900"
          : "bg-white dark:bg-gray-800"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        Daily Checklist {getProgressEmoji()}
      </h2>

      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Completed {completedTasks} / {totalTasks} tasks 📊
      </p>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
          className="flex-grow rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {tasks.map(({ id, title, completed }) => (
          <li
            key={id}
            className={`flex justify-between items-center rounded p-3 border ${
              completed
                ? "bg-green-200 dark:bg-green-700 border-green-400"
                : "bg-gray-100 dark:bg-gray-700 border-gray-300"
            }`}
          >
            <label className="flex items-center gap-2 cursor-pointer flex-grow">
              <input
                type="checkbox"
                checked={completed}
                onChange={() => handleToggle(id, completed)}
                className="cursor-pointer"
              />
              <span className={completed ? "line-through text-gray-500 dark:text-gray-300" : ""}>
                {title}
              </span>
              {completed ? "✅" : "⬜"}
            </label>
            <button
              onClick={() => handleDelete(id)}
              className="text-red-600 hover:text-red-800 transition"
              title="Delete task"
            >
              🗑️
            </button>
          </li>
        ))}
        {tasks.length === 0 && <li>No tasks for today. Add some! 😊</li>}
      </ul>
    </div>
  );
}

export default DailyChecklist;
