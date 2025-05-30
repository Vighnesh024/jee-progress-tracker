// src/components/AvatarUpload.jsx
import React, { useState } from "react";
import { storage, auth, db } from "../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

const AvatarUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    const uid = auth.currentUser?.uid;
    const storageRef = ref(storage, `avatars/${uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploading(true);

    uploadTask.on("state_changed", null, console.error, async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      await updateDoc(doc(db, "users", uid), { avatar: url });
      setUploading(false);
      alert("Avatar updated!");
    });
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Avatar"}
      </button>
    </div>
  );
};

export default AvatarUpload;
