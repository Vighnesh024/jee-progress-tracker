import React, { useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const AddProgress = () => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState("Completed");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert("Please log in!");

    try {
      await addDoc(collection(db, "progress"), {
        uid: user.uid,
        subject,
        topic,
        status,
        date: Timestamp.now(),
      });
      setSubject("");
      setTopic("");
      setStatus("Completed");
      alert("Progress saved!");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Add Progress</h2>

      <input
        type="text"
        placeholder="Subject (e.g., Physics)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Topic (e.g., Kinematics)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};

export default AddProgress;
