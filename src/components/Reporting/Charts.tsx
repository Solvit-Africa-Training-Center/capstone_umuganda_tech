import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  type PieLabelRenderProps,
} from "recharts";

const lineData = [
  { name: "Jan", participants: 100 },
  { name: "Feb", participants: 200 },
  { name: "Mar", participants: 150 },
  { name: "Apr", participants: 250 },
  { name: "May", participants: 300 },
];

const barData = [
  { type: "Env", participants: 300 },
  { type: "Health", participants: 180 },
  { type: "Edu", participants: 220 },
  { type: "Infra", participants: 150 },
];

const pieData = [
  { name: "Skill A", value: 30 },
  { name: "Skill B", value: 10 },
  { name: "Skill C", value: 12 },
  { name: "Skill D", value: 15 },
  { name: "Skill D", value: 25 },
];

// Green shades
const COLORS = ["#009A23", "#FF9C59", "#EFC066", "184856","#0092E0"]; // green shades

// ✅ Custom label OUTSIDE the pie slice
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
}: any) => {
  const radius = (outerRadius || 0) + 20; // push labels outside by 20px
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text
      x={x}
      y={y}
      fill="#374151" // gray-700 for good contrast
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="500"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};



const Charts = () => {
  return (
    <div className="space-y-6">
      {/* Row with Line + Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="flex flex-col">
            <h2 className="text-sm font-bold mb-2 flex   items-center p-5  shadow-md">
              Project Completion Trends
            </h2>
        <div className="rounded-lg bg-white">
          <div className="p-4">
           
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="participants"
                  stroke="#16A34A"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>


        {/* Bar Chart */}
        <div className="flex flex-col ">
            <h2 className="text-sm font-bold mb-2 flex   items-center p-5 shadow-md">
              Participation by Project Type
            </h2>
        <div className="rounded-lg bg-white">
          <div className="p-4">
           
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="participants" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
        </div>
   

      {/* Pie Chart */}
  {/* Pie Chart */}
<div className="border rounded-lg bg-white">
  <div className="">
    <h2 className="text-sm shadow font-medium p-5">Top Skills Utilized</h2>
    <ResponsiveContainer width="100%" height={250} >
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={66}
          outerRadius={90}
          paddingAngle={5}
          labelLine={true}          
          label={renderCustomizedLabel} 
        >
          {pieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          formatter={(value, entry: any) => (
            <span>{entry.payload.name}</span>
          )}
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

    </div>
  );
};

export default Charts;
