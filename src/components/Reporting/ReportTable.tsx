import React from "react"
import { Card, CardContent } from "../UI/Card"

const tableData = [
  { id: "P001", name: "Community Garden Cleanup", date: "2025-09-01", location: "Kigali City Center", type: "Environmental", participants: 45, hours: 120, status: "Completed" },
  { id: "P002", name: "Community Garden Cleanup", date: "2025-09-01", location: "Kigali City Center", type: "Environmental", participants: 60, hours: 150, status: "Completed" },
  { id: "P003", name: "Community Garden Cleanup", date: "2025-09-01", location: "Kigali City Center", type: "Environmental", participants: 30, hours: 90, status: "In Progress" },
]

const ReportTable = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold mb-4">Detailed Report Data</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Project ID</th>
              <th className="p-2">Project Name</th>
              <th className="p-2">Date</th>
              <th className="p-2">Location</th>
              <th className="p-2">Type</th>
              <th className="p-2">Participants</th>
              <th className="p-2">Hours</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="p-2">{row.id}</td>
                <td className="p-2">{row.name}</td>
                <td className="p-2">{row.date}</td>
                <td className="p-2">{row.location}</td>
                <td className="p-2">{row.type}</td>
                <td className="p-2">{row.participants}</td>
                <td className="p-2">{row.hours}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white text-sm ${
                    row.status === "Completed" ? "bg-green-500" : "bg-yellow-500"
                  }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export default ReportTable
