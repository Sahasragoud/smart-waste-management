// src/pages/Leaderboard.tsx
import { useState } from "react";
import { Search } from "lucide-react";

export default function Leaderboard() {
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
        Leaderboard 🏆
      </h2>

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-700">Top Performers</h3>

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
                setCurrentPage(1);
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
