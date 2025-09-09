import { useState } from "react";
import { Users, Recycle, BarChart3, Trophy, Search } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
// src/pages/AdminDashboard.tsx
// import { Link } from "react-router-dom";




export default function AdminDashboard() {
  const wasteData = [
    { name: "Plastic", value: 40 },
    { name: "Paper", value: 25 },
    { name: "Metal", value: 20 },
    { name: "Glass", value: 15 },
  ];

  const COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#dc2626"];

  const initialUsers = [
    { id: 1, name: "Rushwitha", plastic: 2, co2: 5, rewards: 120 },
    { id: 2, name: "Aarav", plastic: 1.5, co2: 3, rewards: 80 },
    { id: 3, name: "Meera", plastic: 3, co2: 7, rewards: 150 },
    { id: 4, name: "Kiran", plastic: 0.8, co2: 2, rewards: 50 },
    { id: 5, name: "Ananya", plastic: 2.3, co2: 6, rewards: 100 },
    { id: 6, name: "Vikram", plastic: 1.2, co2: 3.5, rewards: 70 },
    { id: 7, name: "Sneha", plastic: 4.1, co2: 9, rewards: 200 },
    { id: 8, name: "Rohit", plastic: 0.5, co2: 1, rewards: 40 },
  ];

  const [users] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"name" | "rewards" | "plastic">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Filter users
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === "asc"
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <h2 className="text-4xl font-extrabold text-green-700 text-center mb-10">
        Admin Dashboard 📊
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
          <Users className="w-10 h-10 mx-auto text-blue-600 mb-2" />
          <p className="text-gray-600">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
          <Recycle className="w-10 h-10 mx-auto text-green-600 mb-2" />
          <p className="text-gray-600">Total Waste Recycled</p>
          <p className="text-2xl font-bold">5,200 kg</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
          <BarChart3 className="w-10 h-10 mx-auto text-purple-600 mb-2" />
          <p className="text-gray-600">CO₂ Saved</p>
          <p className="text-2xl font-bold">12,800 kg</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
          <Trophy className="w-10 h-10 mx-auto text-yellow-500 mb-2" />
          <p className="text-gray-600">Rewards Distributed</p>
          <p className="text-2xl font-bold">320</p>
        </div>
      </div>

      {/* Waste Breakdown Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mb-12">
        <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">
          Waste Breakdown by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={wasteData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {wasteData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* User Management Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-700">User Management 👥</h3>

          {/* Search Box */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name..."
              className="outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="name">Sort by Name</option>
            <option value="plastic">Sort by Plastic Reduced</option>
            <option value="rewards">Sort by Rewards</option>
          </select>

          <button
            className="px-3 py-2 border rounded-lg"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "⬆️ Asc" : "⬇️ Desc"}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100 text-green-700 text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Plastic Reduced (kg)</th>
                <th className="py-3 px-4">CO₂ Saved (kg)</th>
                <th className="py-3 px-4">Reward Points</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="py-3 px-4">{user.id}</td>
                  <td className="py-3 px-4 font-semibold">{user.name}</td>
                  <td className="py-3 px-4">{user.plastic}</td>
                  <td className="py-3 px-4">{user.co2}</td>
                  <td className="py-3 px-4">{user.rewards}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1 ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Prev
          </button>
          <p className="text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
