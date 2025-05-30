// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCCnYemLsRC3H1M8bd23YcyLaWj15zkRK4",
  authDomain: "progresstracker-fd640.firebaseapp.com",
  projectId: "progresstracker-fd640",
  storageBucket: "progresstracker-fd640.appspot.com", // ✅ fix typo here
  messagingSenderId: "99787349579",
  appId: "1:99787349579:web:d3f6a2267d7a3cd82b77ce",
  measurementId: "G-DFZ58MGCZ3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export
export { auth, db, storage };
