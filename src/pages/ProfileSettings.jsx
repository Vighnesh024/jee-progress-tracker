import React, { useState, useEffect, useContext } from "react";
import { auth, db, storage } from "../firebase/config.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext.jsx";

const ProfileSettings = () => {
  const { darkMode } = useContext(ThemeContext);
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [avatarURL, setAvatarURL] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect if not logged in
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDisplayName(docSnap.data().displayName || "");
          setAvatarURL(docSnap.data().photoURL || user.photoURL || "");
        } else {
          setDisplayName(user.displayName || "");
          setAvatarURL(user.photoURL || "");
        }
      } catch (err) {
        setError("Failed to load profile.");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setError(null);
    setSuccess(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("File size should be less than 2MB.");
      return;
    }

    if (!user) {
      setError("User not logged in.");
      return;
    }

    setUploading(true);
    const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (uploadError) => {
        console.error("Upload error:", uploadError);
        setError("Failed to upload avatar. Try again.");
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Update Firebase Auth profile photoURL
          await updateProfile(user, { photoURL: downloadURL });

          // Update Firestore user document avatar URL as well
          const docRef = doc(db, "users", user.uid);
          await setDoc(
            docRef,
            {
              photoURL: downloadURL,
              updatedAt: new Date(),
            },
            { merge: true }
          );

          setAvatarURL(downloadURL);
          setUploading(false);
          setProgress(0);
          setSuccess("Avatar updated successfully!");
        } catch (updateError) {
          console.error("Profile update error:", updateError);
          setError("Failed to update profile avatar. Try again.");
          setUploading(false);
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!displayName.trim()) {
      setError("Display name cannot be empty.");
      return;
    }
    if (!user) {
      setError("User not logged in.");
      return;
    }

    const email = user.email || "";
    if (!email) {
      setError("User email not available.");
      return;
    }

    try {
      // Update Firebase Auth displayName
      await updateProfile(user, { displayName: displayName.trim() });

      // Update Firestore user document displayName, email, photoURL, updatedAt
      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        displayName: displayName.trim(),
        email,
        updatedAt: new Date(),
      };

      if (avatarURL && avatarURL.trim() !== "") {
        userData.photoURL = avatarURL;
      }

      await setDoc(userDocRef, userData, { merge: true });

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
      console.error("Error updating profile:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      {/* Fixed Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 h-14 flex items-center px-6 shadow-md z-50 transition-colors duration-500 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h1 className="text-xl font-bold">MyApp</h1>
        {/* Add nav links/buttons here if needed */}
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 w-64 h-[calc(100vh-56px)] bg-gray-200 dark:bg-gray-800 p-6 overflow-auto transition-colors duration-500 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        <h2 className="mb-6 font-semibold text-lg">Menu</h2>
        <ul>
          <li className="mb-4 hover:text-indigo-600 cursor-pointer">Profile Settings</li>
          <li className="mb-4 hover:text-indigo-600 cursor-pointer">Account</li>
          <li className="mb-4 hover:text-indigo-600 cursor-pointer">Notifications</li>
          <li className="mb-4 hover:text-indigo-600 cursor-pointer">Security</li>
          {/* Add more sidebar links here */}
        </ul>
      </aside>

      {/* Main Content */}
      <main
        className={`max-w-xl mx-auto p-8 rounded shadow-lg transition-colors duration-500 ease-in-out mt-20 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
        style={{ marginLeft: "280px" }}
      >
        <h1 className="text-3xl mb-6 font-bold text-center">Your Profile & Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            {avatarURL ? (
              <img
                src={avatarURL}
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-gray-300 bg-gray-200 flex items-center justify-center text-gray-400 text-xl mb-4">
                No Avatar
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
              className="mb-4 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                dark:file:bg-indigo-700 dark:file:text-indigo-100
                dark:hover:file:bg-indigo-600"
            />

            {uploading && (
              <div className="mb-4 w-full">
                <p className="text-indigo-600 font-semibold mb-1">
                  Uploading: {progress.toFixed(0)}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold">Email</label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              className={`w-full p-3 rounded border ${
                darkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full p-3 rounded border focus:outline-none focus:ring-2 ${
                darkMode
                  ? "border-gray-700 bg-gray-800 text-white focus:ring-brandBlue"
                  : "border-gray-300 bg-white text-gray-900 focus:ring-indigo-500"
              }`}
            />
          </div>

          {error && <p className="text-red-500 font-medium">{error}</p>}
          {success && <p className="text-green-600 font-medium">{success}</p>}

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 rounded font-semibold text-white transition-colors duration-300 ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Update Profile
          </button>
        </form>
      </main>
    </>
  );
};

export default ProfileSettings;
