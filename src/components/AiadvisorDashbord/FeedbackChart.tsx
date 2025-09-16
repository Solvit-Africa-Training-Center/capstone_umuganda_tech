import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { name: "Positive", count: 70 },
  { name: "Neutral", count: 15 },
  { name: "Negative", count: 15 },
];

const FeedbackChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-[436px] w-[712px]">
      <h3 className="font-semibold mb-4">Community Feedback Sentiment</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#16A34A" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-gray-500 text-sm mt-2">Feedback Count</p>
    </div>
  );
};

export default FeedbackChart;
