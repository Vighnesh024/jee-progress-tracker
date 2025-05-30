// components/WeeklyProgressChart.jsx

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const WeeklyProgressChart = ({ data }) => {
  // Format timestamp to readable date
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.timestamp.seconds * 1000).toLocaleDateString(),
  }));

  return (
    <div className="w-full h-64 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-2 text-center text-gray-800 dark:text-white">Weekly Progress</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyProgressChart;
