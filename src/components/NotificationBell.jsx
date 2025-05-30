// src/components/NotificationPanel.jsx
import React from "react";

const NotificationPanel = ({ notifications }) => {
  return (
    <div className="fixed top-20 right-6 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
      <h2 className="font-bold text-lg mb-2">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No new notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((note, idx) => (
            <li key={idx} className="text-sm border-b pb-2">
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;
