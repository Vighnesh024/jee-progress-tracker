// src/components/ProgressChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ProgressChart = ({ data, darkMode = false }) => {
  const chartData = data.map((item) => ({
    subject: item.subjectName,
    completed: item.topicsCompleted,
    remaining: item.totalTopics - item.topicsCompleted,
  }));

  return (
    <div
      className={`w-full h-96 p-4 rounded shadow ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${
          darkMode ? "text-gray-200" : "text-gray-900"
        }`}
      >
        Progress Overview
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <XAxis
            dataKey="subject"
            stroke={darkMode ? "#ddd" : "#333"}
            tick={{ fontSize: 14, fontWeight: "600" }}
          />
          <YAxis stroke={darkMode ? "#ddd" : "#333"} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#222" : "#fff",
              borderRadius: 8,
              borderColor: darkMode ? "#444" : "#ccc",
            }}
            itemStyle={{ color: "#3b82f6", fontWeight: "600" }}
          />
          <Legend
            wrapperStyle={{ color: darkMode ? "#ddd" : "#333" }}
            verticalAlign="top"
            height={36}
          />
          <Bar dataKey="completed" stackId="a" fill="#3b82f6" name="Completed" />
          <Bar dataKey="remaining" stackId="a" fill="#93c5fd" name="Remaining" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
