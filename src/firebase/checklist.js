import { db } from './config'; // your firebase config file

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

// Add a new task for today
export async function addTask(userId, task) {
  const today = new Date().toISOString().split('T')[0];
  await addDoc(collection(db, 'checklist', userId, 'tasks'), {
    title: task,
    completed: false,
    date: today,
    timestamp: Timestamp.now(),
  });
}

// Get all tasks for today
export async function getTodayTasks(userId) {
  const today = new Date().toISOString().split('T')[0];
  const q = query(
    collection(db, 'checklist', userId, 'tasks'),
    where('date', '==', today)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Toggle task completion state (true/false)
export async function toggleTaskCompletion(userId, taskId, current) {
  const ref = doc(db, 'checklist', userId, 'tasks', taskId);
  await updateDoc(ref, { completed: !current });
}

// Delete a single task
export async function deleteTask(userId, taskId) {
  const ref = doc(db, 'checklist', userId, 'tasks', taskId);
  await deleteDoc(ref);
}

// Clear all completed tasks for today
export async function clearCompletedTasksForUser(userId) {
  const today = new Date().toISOString().split('T')[0];
  const tasksRef = collection(db, 'checklist', userId, 'tasks');
  const q = query(tasksRef, where('date', '==', today), where('completed', '==', true));
  const snapshot = await getDocs(q);

  const deletePromises = snapshot.docs.map((taskDoc) => {
    return deleteDoc(doc(db, 'checklist', userId, 'tasks', taskDoc.id));
  });

  await Promise.all(deletePromises);
}
