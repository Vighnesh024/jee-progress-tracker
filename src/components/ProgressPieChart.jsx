import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

const ProgressPieChart = ({ data }) => {
  const pieData = data.map((item) => ({
    name: item.subjectName,
    value: Math.round(
      (item.topicsCompleted / item.totalTopics) * 100 || 0
    ),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          fill="#8884d8"
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}% completed`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ProgressPieChart;
