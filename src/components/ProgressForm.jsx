import React, { useState } from "react";
import { setSubjectProgress } from "../firebase/progress"; // Import your firebase helper

const ProgressForm = ({ userId, onProgressUpdated }) => {
  const [subjectName, setSubjectName] = useState("");
  const [topicsCompleted, setTopicsCompleted] = useState("");
  const [totalTopics, setTotalTopics] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setSubmitting(true);
    try {
      // We need a subjectId to uniquely identify progress.
      // Let's create one by normalizing subjectName (e.g. lowercase, no spaces)
      const subjectId = subjectName.toLowerCase().replace(/\s+/g, "-");

      // Call your firebase function to save progress
      await setSubjectProgress(userId, subjectId, {
        subjectName,
        topicsCompleted: Number(topicsCompleted),
        totalTopics: Number(totalTopics),
      });

      onProgressUpdated(); // refresh progress list
      setSubjectName("");
      setTopicsCompleted("");
      setTotalTopics("");
    } catch (error) {
      console.error("Failed to save progress:", error);
      alert("Failed to save progress: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="subjectName" className="block mb-1 font-medium text-gray-900 dark:text-gray-100">
          Subject Name
        </label>
        <input
          id="subjectName"
          type="text"
          className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-brandBlue focus:border-brandBlue dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          required
          disabled={submitting}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="topicsCompleted" className="block mb-1 font-medium text-gray-900 dark:text-gray-100">
            Topics Completed
          </label>
          <input
            id="topicsCompleted"
            type="number"
            min="0"
            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-brandBlue focus:border-brandBlue dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={topicsCompleted}
            onChange={(e) => setTopicsCompleted(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="totalTopics" className="block mb-1 font-medium text-gray-900 dark:text-gray-100">
            Total Topics
          </label>
          <input
            id="totalTopics"
            type="number"
            min="1"
            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-brandBlue focus:border-brandBlue dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={totalTopics}
            onChange={(e) => setTotalTopics(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md font-semibold shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Add Progress"}
      </button>
    </form>
  );
};

export default ProgressForm;
