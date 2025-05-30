// firebase/progress.js

import { db } from "./config"; // Firebase config
import {
  doc,
  setDoc,
  getDocs,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  Timestamp
} from "firebase/firestore";

/**
 * Save a timestamped progress record under user -> records.
 * @param {string} userId - User ID.
 * @param {object} progress - Progress data object.
 */
export async function saveUserProgress(userId, progress) {
  try {
    const progressRef = collection(db, "users", userId, "records");
    await addDoc(progressRef, {
      ...progress,
      timestamp: serverTimestamp(),
    });
    console.log("Progress record saved with timestamp.");
  } catch (error) {
    console.error("Error saving time-based progress:", error);
  }
}

/**
 * Set or update subject-specific progress.
 * @param {string} userId - User ID.
 * @param {string} subjectId - Subject ID.
 * @param {object} data - Progress data.
 */
export const setSubjectProgress = async (userId, subjectId, data) => {
  try {
    if (!userId || !subjectId) {
      throw new Error("User ID and Subject ID are required.");
    }
    const subjectRef = doc(db, "users", userId, "progress", subjectId);
    await setDoc(subjectRef, data, { merge: true });
    console.log(`Progress set for user: ${userId}, subject: ${subjectId}`);
  } catch (error) {
    console.error("Error setting subject progress:", error);
    throw error;
  }
};

/**
 * Get all subject progress data for a user.
 * @param {string} userId - User ID.
 * @returns {Promise<Array>} List of progress objects.
 */
export const getUserProgress = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required.");

    const progressCol = collection(db, "users", userId, "progress");
    const snapshot = await getDocs(progressCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting user progress:", error);
    return [];
  }
};

/**
 * Get recent progress records (e.g., last 7 days).
 * @param {string} userId - User ID.
 * @param {number} days - Number of days back to include.
 * @returns {Promise<Array>} List of recent progress records.
 */
export async function getRecentProgress(userId, days = 7) {
  try {
    const now = new Date();
    const fromDate = new Date(now.setDate(now.getDate() - days));
    const fromTimestamp = Timestamp.fromDate(fromDate);

    const progressRef = collection(db, "users", userId, "records");
    const q = query(
      progressRef,
      where("timestamp", ">=", fromTimestamp),
      orderBy("timestamp", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching recent progress:", error);
    return [];
  }
}
