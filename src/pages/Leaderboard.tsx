import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getUsersByRole } from "../services/AdminServices";

interface User {
  id: number;
  username: string; // 👈 assuming backend sends "name"
  email: string;
  points: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 5;

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getUsersByRole("user", page, size, "points", "DESC");
      setUsers(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log("Unable to fetch Users by points", err);
    }
  }, [page, size]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = search
    ? users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <section className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-16 px-6">
      <h2 className="text-4xl font-extrabold text-green-700 text-center mb-12">
        🌟 Leaderboard
      </h2>

      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto">
        {/* Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-700">Top Performers</h3>
          <div className="flex items-center border rounded-full px-4 py-2 bg-gray-50 shadow-sm">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name..."
              className="bg-transparent outline-none text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </div>
        </div>

        {/* Leaderboard */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-green-100 text-green-700 text-left">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => {
                const rank = page * size + idx + 1;
                return (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-green-50 transition"
                  >
                    <td className="py-3 px-4 font-bold">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs ${
                          rank === 1
                            ? "bg-yellow-500"
                            : rank === 2
                            ? "bg-gray-400"
                            : rank === 3
                            ? "bg-amber-600"
                            : "bg-green-600"
                        }`}
                      >
                        #{rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {user.username}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{user.email}</td>
                    <td className="py-3 px-4 text-right font-semibold text-green-700">
                      {user.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              page === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Prev
          </button>
          <p className="text-gray-600 text-sm">
            Page {page + 1} of {totalPages}
          </p>
          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              page === totalPages - 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
