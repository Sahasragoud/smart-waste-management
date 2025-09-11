// src/pages/Leaderboard.tsx
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getUsersByRole } from "../services/AdminServices";

interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  createdDate: string;
  points: number;
  role: "USER";
}
export default function Leaderboard() {

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [sortField] = useState("points");
  const [sortOrder] = useState("DESC");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 5;

  //fetchUsers by points

  const fetchUsers = useCallback(async () => {
    try{
      const res = await getUsersByRole("user", page, size, sortField, sortOrder);
      setUsers(res.data.content);
      setTotalPages(res.data.totalPages);
    }
    catch(err){
      console.log("Unable to fetch Users by points", err);
    }
  },[ page, size, sortField, sortOrder]);

  useEffect(() => {
    fetchUsers();
  },[fetchUsers]);


  // Filter users
  const filteredUsers = search
    ? users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
    : users;

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
                setPage(1);
              }}
            />
          </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100 text-green-700 text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="py-3 px-4">{user.id}</td>
                  <td className="py-3 px-4 font-semibold">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>

    <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg ${
            page === 0 ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Prev
        </button>
        <p className="text-gray-600">
          Page {page} of {totalPages}
        </p>
        <button
          disabled={page === totalPages-1}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg ${
            page === totalPages-1 ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>
    </section>
  );
}
