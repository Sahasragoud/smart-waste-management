import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  created_date: string;
  points: number;
  role: "admin" | "user";
}

const mockUsers: User[] = [
  {
    id: 1,
    username: "Sahara",
    email: "example@gmail.com",
    password: "pass123",
    phone_number: "868307713",
    address: "Dundigal",
    date_of_birth: "1999-01-01",
    created_date: "2025-08-30",
    points: 0,
    role: "user",
  },
  {
    id: 2,
    username: "NewAdmin1",
    email: "newadmin@example.com",
    password: "adminpass",
    phone_number: "9999999999",
    address: "Some Address",
    date_of_birth: "1993-04-01",
    created_date: "2025-08-30",
    points: 0,
    role: "admin",
  },
];

const COLORS = ["#34D399", "#3B82F6"];

export default function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchAdmin, setSearchAdmin] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [sortFieldAdmin, setSortFieldAdmin] = useState<keyof User>("username");
  const [sortFieldUser, setSortFieldUser] = useState<keyof User>("username");
  const [sortOrderAdmin, setSortOrderAdmin] = useState<"asc" | "desc">("asc");
  const [sortOrderUser, setSortOrderUser] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 5;
  const [adminPage, setAdminPage] = useState(1);
  const [userPage, setUserPage] = useState(1);

  // Add User Modal
  const [showModal, setShowModal] = useState(false);
  const [newUserRole, setNewUserRole] = useState<"admin" | "user">("user");
  const [newUserData, setNewUserData] = useState<Partial<User>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Edit Modal
  const [editUser, setEditUser] = useState<User | null>(null);

  // Password Modal
  const [passwordUser, setPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const admins = users.filter((u) => u.role === "admin");
  const normalUsers = users.filter((u) => u.role === "user");

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleAddUser = () => {
    const errors: Record<string, string> = {};
    const requiredFields: (keyof User)[] = [
      "username",
      "email",
      "phone_number",
      "address",
      "date_of_birth",
      "password",
    ];

    requiredFields.forEach((field) => {
      if (!newUserData[field]) {
        errors[field] = `${field} is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    const newUser: User = {
      id: newId,
      username: newUserData.username as string,
      email: newUserData.email as string,
      password: newUserData.password as string,
      phone_number: newUserData.phone_number as string,
      address: newUserData.address as string,
      date_of_birth: newUserData.date_of_birth as string,
      created_date: new Date().toISOString().split("T")[0],
      points: 0,
      role: newUserRole,
    };

    setUsers([...users, newUser]);
    setShowModal(false);
    setNewUserData({});
    setFormErrors({});
  };

  const handleEditUser = () => {
    if (!editUser) return;
    setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
    setEditUser(null);
  };

  const handleUpdatePassword = () => {
    if (!passwordUser || !newPassword) return;
    setUsers(
      users.map((u) =>
        u.id === passwordUser.id ? { ...u, password: newPassword } : u
      )
    );
    setPasswordUser(null);
    setNewPassword("");
  };

  const renderTable = (
    title: string,
    data: User[],
    currentPage: number,
    setPage: (p: number) => void,
    totalPages: number,
    search: string,
    setSearch: (s: string) => void,
    sortField: keyof User,
    setSortField: (f: keyof User) => void,
    sortOrder: "asc" | "desc",
    setSortOrder: (o: "asc" | "desc") => void,
    showUpload: boolean
  ) => {
    const filteredData = data.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
      const aVal = a[sortField] ?? "";
      const bVal = b[sortField] ?? "";
      return sortOrder === "asc"
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <div className="p-6 bg-white rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {title} Management{" "}
          <span className="text-sm text-gray-500">({data.length})</span>
        </h2>

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
              {title === "Users" && (
                <th className="border px-4 py-2">Points</th>
              )}
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((user) => (
              <tr key={user.id} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.phone_number}</td>
                <td className="border px-4 py-2">{user.address}</td>
                <td className="border px-4 py-2">{user.date_of_birth}</td>
                <td className="border px-4 py-2">{user.created_date}</td>
                {title === "Users" && (
                  <td className="border px-4 py-2">{user.points}</td>
                )}
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => setEditUser(user)}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                  {user.role === "user" && (
                    <button
                      onClick={() => setPasswordUser(user)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                      Update Password
                    </button>
                  )}
                  {showUpload && (
                    <button className="px-2 py-1 bg-purple-500 text-white rounded">
                      Upload
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const chartData = [
    { name: "Admins", value: admins.length },
    { name: "Users", value: normalUsers.length },
  ];

  const totalAdminPages = Math.ceil(admins.length / itemsPerPage) || 1;
  const totalUserPages = Math.ceil(normalUsers.length / itemsPerPage) || 1;

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <h1 className="text-2xl font-semibold mb-8">User vs Admin</h1>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>

      {renderTable(
        "Admins",
        admins,
        adminPage,
        setAdminPage,
        totalAdminPages,
        searchAdmin,
        setSearchAdmin,
        sortFieldAdmin,
        setSortFieldAdmin,
        sortOrderAdmin,
        setSortOrderAdmin,
        false
      )}
      {renderTable(
        "Users",
        normalUsers,
        userPage,
        setUserPage,
        totalUserPages,
        searchUser,
        setSearchUser,
        sortFieldUser,
        setSortFieldUser,
        sortOrderUser,
        setSortOrderUser,
        true
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              Add New {newUserRole}
            </h3>
            <input
              type="text"
              placeholder="Username"
              value={newUserData.username || ""}
              onChange={(e) =>
                setNewUserData({ ...newUserData, username: e.target.value })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUserData.email || ""}
              onChange={(e) =>
                setNewUserData({ ...newUserData, email: e.target.value })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUserData.password || ""}
              onChange={(e) =>
                setNewUserData({ ...newUserData, password: e.target.value })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Phone"
              value={newUserData.phone_number || ""}
              onChange={(e) =>
                setNewUserData({
                  ...newUserData,
                  phone_number: e.target.value,
                })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Address"
              value={newUserData.address || ""}
              onChange={(e) =>
                setNewUserData({ ...newUserData, address: e.target.value })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
              type="date"
              value={newUserData.date_of_birth || ""}
              onChange={(e) =>
                setNewUserData({
                  ...newUserData,
                  date_of_birth: e.target.value,
                })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
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

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <input
              type="text"
              value={editUser.username}
              onChange={(e) =>
                setEditUser({ ...editUser, username: e.target.value })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
              type="email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={editUser.phone_number}
              onChange={(e) =>
                setEditUser({ ...editUser, phone_number: e.target.value })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={editUser.address}
              onChange={(e) =>
                setEditUser({ ...editUser, address: e.target.value })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
              type="date"
              value={editUser.date_of_birth}
              onChange={(e) =>
                setEditUser({ ...editUser, date_of_birth: e.target.value })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Password Modal */}
      {passwordUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Update Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPasswordUser(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePassword}
                className="px-4 py-2 bg-yellow-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
