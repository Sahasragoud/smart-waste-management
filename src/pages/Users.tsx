import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { createMember, deleteUser, getUsersByRole } from "../services/AdminServices";

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
  role: "USER" | "ADMIN";
}

const COLORS = ["#34D399", "#3B82F6"];

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [searchAdmin, setSearchAdmin] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [sortFieldAdmin, setSortFieldAdmin] = useState<"username" | "points">("username");
  const [sortFieldUser, setSortFieldUser] = useState<"username" | "points">("username");
  const [sortOrderAdmin, setSortOrderAdmin] = useState<"asc" | "desc">("asc");
  const [sortOrderUser, setSortOrderUser] = useState<"asc" | "desc">("asc");
  const [userSize] = useState(5);
  const [adminSize] = useState(5);

  const [adminPage, setAdminPage] = useState(0);
  const [userPage, setUserPage] = useState(0);
  const [totalUserPages, setTotalUserPages] = useState(0);
  const [totalAdminPages, setTotalAdminPages] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [newUserRole, setNewUserRole] = useState<"admin" | "user">("user");
  const [newUserData, setNewUserData] = useState<Partial<User>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [admin, setAdmin] = useState<{ name: string } | null>(null);


const fetchUsers = async () => {
  try {
    const res = await getUsersByRole("user", userPage, userSize, sortFieldUser, sortOrderUser);
    console.log("API response:", res.data.content); // ✅ backend data
    setUsers(res.data.content);
    setTotalUserPages(res.data.totalPages);
  } catch (err) {
    console.error("Failed to fetch users", err);
  }
};

  const fetchAdmins = async () => {
    try {
      const res = await getUsersByRole("admin",adminPage, adminSize, sortFieldAdmin, sortOrderAdmin);
      setAdmins(res.data.content);
      setTotalAdminPages(res.data.totalPages);
      console.log(admins)
      console.log(res.data.content)
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

    useEffect(() => {
    // Example: assuming admin info is stored in localStorage
    const storedAdmin = localStorage.getItem("user");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else {
      setAdmin({ name: "Admin" }); // fallback
    }
  }, []);

    useEffect(() => {
    if (admin) {
      console.log("Admin:", admin.name);
    }
  }, [admin]);


  useEffect(() => {
    fetchUsers();
  }, [userPage, userSize, sortFieldUser, sortOrderUser]);

  useEffect(() => {
    fetchAdmins();
  }, [adminPage, adminSize, sortFieldAdmin, sortOrderAdmin]);


  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      fetchAdmins();
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  const handleAddUser = async () => {
  const errors: Record<string, string> = {};
  const requiredFields = ["username", "email", "phoneNumber", "address", "dateOfBirth", "password"];

  requiredFields.forEach((field) => {
    if (!newUserData[field as keyof User]) {
      errors[field] = `${field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())} is required.`;
    }
  });

  if (Object.keys(errors).length) {
    setFormErrors(errors);
    return;
  }

  const newUser = {
    id: 0, // let backend assign
    username: newUserData.username!,
    email: newUserData.email!,
    password: newUserData.password!,
    phoneNumber: newUserData.phoneNumber!,   // ✅ backend expects camelCase
    address: newUserData.address!,
    dateOfBirth: newUserData.dateOfBirth!,  // ✅ backend expects camelCase
    createdDate: new Date().toISOString().split("T")[0],
    points: 0,
    role: (newUserRole === "admin" ? "ADMIN" : "USER") as "ADMIN" | "USER",
  };

  try {
    await createMember(newUser);
    fetchUsers();
    fetchAdmins();
    setShowModal(false);
    setNewUserData({});
    setFormErrors({});
  } catch (err) {
    console.error("Error creating user", err);
  }
};



  const filteredUsers = searchUser
    ? users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchUser.toLowerCase()) ||
          user.email.toLowerCase().includes(searchUser.toLowerCase()) ||
          user.role.toLowerCase().includes(searchUser.toLowerCase())
      )
    : users;

  const filteredAdmins = searchAdmin
  ? admins.filter(
      (user) =>
        user.username.toLowerCase().includes(searchAdmin.toLowerCase()) ||
        user.email.toLowerCase().includes(searchAdmin.toLowerCase()) ||
        user.role.toLowerCase().includes(searchAdmin.toLowerCase())
    )
  : admins;


function renderTable(
  title: "Admins" | "Users",
  data: User[],
  page: number,
  setPage: (page: number) => void,
  totalPages: number,
  search: string,
  setSearch: (v: string) => void,
  sortField: "username" | "points",
  setSortField: (v: "username" | "points") => void,
  sortOrder: "asc" | "desc",
  setSortOrder: (v: "asc" | "desc") => void,
  showPoints: boolean,
  onAdd: () => void,
  onDelete: (id: number) => void
) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title} List</h2>

        {/* Add Button */}
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          {title === "Admins" ? "+ Add Admin" : "+ Add User"}
        </button>
      </div>

      {/* 🔍 Search + Sort */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="px-4 py-2 rounded border border-gray-300"
        />
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as "username" | "points")}
          className="px-4 py-2 rounded border border-gray-300"
        >
          <option value="username">Sort by Username</option>
          <option value="points">Sort by Points</option>
        </select>
        <button
          className="px-4 py-2 border rounded"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "⬆️ Asc" : "⬇️ Desc"}
        </button>
      </div>

      {/* 📋 Table */}
      <table className="min-w-full border border-gray-200">
        <thead className="bg-green-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">DOB</th>
            <th className="border px-4 py-2">Created</th>
            {showPoints && <th className="border px-4 py-2">Points</th>}
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((user) => (
              <tr key={user.id} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.phoneNumber}</td>
                <td className="border px-4 py-2">{user.address}</td>
                <td className="border px-4 py-2">{user.dateOfBirth}</td>
                <td className="border px-4 py-2">{user.createdDate}</td>
                {showPoints && <td className="border px-4 py-2">{user.points}</td>}
                <td className="border px-4 py-2 space-x-2">
                  <button className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                  {title === "Users" && (
                    <>
                      <button className="px-2 py-1 bg-yellow-500 text-white rounded">
                        Update Password
                      </button>
                      <button className="px-2 py-1 bg-purple-500 text-white rounded">
                        Upload
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={showPoints ? 9 : 8}
                className="text-center py-4 text-gray-500 italic"
              >
                No {title.toLowerCase()} found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ⏩ Pagination */}
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
    </div>
  );
}


const chartData = [
  { name: "Admins", value: admins.length },
  { name: "Users", value: users.length },
];

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="p-6 bg-white rounded-2xl shadow-md mb-8">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>

    {renderTable(
      "Admins", filteredAdmins, adminPage, setAdminPage, totalAdminPages,
      searchAdmin, setSearchAdmin, sortFieldAdmin, setSortFieldAdmin,
      sortOrderAdmin, setSortOrderAdmin, false,
      () => { setNewUserRole("admin"); setShowModal(true); }, // onAdd
      handleDeleteUser // onDelete
    )}

    {renderTable(
      "Users", filteredUsers, userPage, setUserPage, totalUserPages,
      searchUser, setSearchUser, sortFieldUser, setSortFieldUser,
      sortOrderUser, setSortOrderUser, true,
      () => { setNewUserRole("user"); setShowModal(true); }, // onAdd
      handleDeleteUser // onDelete
    )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Add New {newUserRole === "admin" ? "Admin" : "User"}</h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                value={newUserData.username || ""}
                onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              {formErrors.username && <p className="text-red-500 text-sm">{formErrors.username}</p>}

              <input
                type="email"
                placeholder="Email"
                value={newUserData.email || ""}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}

              <input
                type="password"
                placeholder="Password"
                value={newUserData.password || ""}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}

              <input
                type="text"
                placeholder="Phone Number"
                value={newUserData.phoneNumber || ""}
                onChange={(e) => setNewUserData({ ...newUserData, phoneNumber: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              {formErrors.phoneNumber && <p className="text-red-500 text-sm">{formErrors.phoneNumber}</p>}

              <input
                type="text"
                placeholder="Address"
                value={newUserData.address || ""}
                onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}

              <input
                type="date"
                value={newUserData.dateOfBirth || ""}
                onChange={(e) => setNewUserData({ ...newUserData, dateOfBirth: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              {formErrors.dateOfBirth && <p className="text-red-500 text-sm">{formErrors.dateOfBirth}</p>}
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => { setShowModal(false); setNewUserData({}); setFormErrors({}); }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


// const Users = () =>{
//   return (
//     <>
//     </>
//   )
// }

// export default Users;