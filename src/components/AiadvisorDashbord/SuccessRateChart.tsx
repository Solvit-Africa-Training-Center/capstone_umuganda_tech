import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Jan", success: 20 },
  { month: "Feb", success: 45 },
  { month: "Mar", success: 70 },
  { month: "Apr", success: 90 },
  { month: "May", success: 85 },
  { month: "June", success: 65 },
];

const SuccessRateChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-[436px] w-[712px]">
      <h3 className="font-semibold mb-2">Past Project SuccessRate</h3>
      <p className="text-gray-500 text-sm mb-4">
        Historical performance of completed community projects
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="success"
            stroke="#16A34A"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-gray-500 text-sm mt-2">Success Rate (%)</p>
    </div>
  );
};

export default SuccessRateChart;
