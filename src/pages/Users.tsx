import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  created_date: string;
  points: number;
  role: "admin" | "user";
}

const mockUsers: User[] = [
  { id: 1, username: "Sahara", email: "example@gmail.com", phone_number: "868307713", address: "Dundigal", date_of_birth: "1999-01-01", created_date: "2025-08-30", points: 0, role: "user" },
  { id: 2, username: "NewAdmin1", email: "newadmin@example.com", phone_number: "9999999999", address: "Some Address", date_of_birth: "1993-04-01", created_date: "2025-08-30", points: 0, role: "admin" },
  { id: 3, username: "NewAdmin2", email: "newadmin2@example.com", phone_number: "9876543210", address: "Hyderabad", date_of_birth: "1990-03-01", created_date: "2025-08-30", points: 5, role: "admin" },
  { id: 4, username: "Alice", email: "alice@example.com", phone_number: "1234567890", address: "Delhi", date_of_birth: "1998-07-15", created_date: "2025-08-30", points: 12, role: "user" },
  { id: 5, username: "Bob", email: "bob@example.com", phone_number: "9876543210", address: "Mumbai", date_of_birth: "1995-05-21", created_date: "2025-08-30", points: 8, role: "user" },
  { id: 6, username: "Charlie", email: "charlie@example.com", phone_number: "8765432190", address: "Chennai", date_of_birth: "2000-11-02", created_date: "2025-08-30", points: 3, role: "user" },
];

const COLORS = ["#34D399", "#3B82F6"]; // green = users, blue = admins

export default function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState<string>("");
  const itemsPerPage = 5;
  const [adminPage, setAdminPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newUserRole, setNewUserRole] = useState<"admin" | "user">("user");
  const [newUserData, setNewUserData] = useState<Partial<User>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const admins = users.filter(u => u.role === "admin" && u.username.toLowerCase().includes(search.toLowerCase()));
  const normalUsers = users.filter(u => u.role === "user" && u.username.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleAddUser = () => {
    const errors: Record<string, string> = {};
    const requiredFields = ["username", "email", "phone_number", "address", "date_of_birth"];

    requiredFields.forEach((field) => {
      if (!newUserData[field as keyof User]) {
        errors[field] = `${field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())} is required.`;
      }
    });

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    const newUser: User = {
      id: users.length + 1,
      username: newUserData.username!,
      email: newUserData.email!,
      phone_number: newUserData.phone_number!,
      address: newUserData.address!,
      date_of_birth: newUserData.date_of_birth!,
      created_date: new Date().toISOString().split("T")[0],
      points: newUserRole === "user" ? 0 : 0,
      role: newUserRole,
    };

    setUsers([...users, newUser]);
    setShowModal(false);
    setNewUserData({});
    setFormErrors({});
  };

  const renderTable = (title: string, data: User[], currentPage: number, setPage: (p: number) => void, totalPages: number, showUpload: boolean) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <div className="p-6 bg-white rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div className="mb-4 text-center">
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded border border-gray-300 w-1/2"
          />
        </div>

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
              {title === "Users" && <th className="border px-4 py-2">Points</th>}
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map(user => (
                <tr key={user.id} className="text-center hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.phone_number}</td>
                  <td className="border px-4 py-2">{user.address}</td>
                  <td className="border px-4 py-2">{user.date_of_birth}</td>
                  <td className="border px-4 py-2">{user.created_date}</td>
                  {title === "Users" && <td className="border px-4 py-2">{user.points}</td>}
                  <td className="border px-4 py-2 space-x-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    {user.role === "user" && (
                      <>
                        <button className="px-2 py-1 bg-yellow-500 text-white rounded">Update Password</button>
                        {showUpload && (
                          <button className="px-2 py-1 bg-purple-500 text-white rounded">Upload</button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={title === "Users" ? 9 : 8} className="text-center py-4 text-gray-500 italic">
                  No {title.toLowerCase()} found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"}`}
          >
            Prev
          </button>
          <p className="text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"}`}
          >
            Next
          </button>
        </div>
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
      <div className="flex justify-end gap-4 mb-6">
        <button onClick={() => { setNewUserRole("admin"); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">+ Add Admin</button>
        <button onClick={() => { setNewUserRole("user"); setShowModal(true); }} className="px-4 py-2 bg-green-600 text-white rounded-lg">+ Add User</button>
      </div>

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

      {renderTable("Admins", admins, adminPage, setAdminPage, totalAdminPages, false)}
      {renderTable("Users", normalUsers, userPage, setUserPage, totalUserPages, true)}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Add New {newUserRole === "admin" ? "Admin" : "User"}</h3>
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
                type="text"
                placeholder="Phone Number"
                value={newUserData.phone_number || ""}
                onChange={(e) => setNewUserData({ ...newUserData, phone_number: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              {formErrors.phone_number && <p className="text-red-500 text-sm">{formErrors.phone_number}</p>}
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
                value={newUserData.date_of_birth || ""}
                onChange={(e) => setNewUserData({ ...newUserData, date_of_birth: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              {formErrors.date_of_birth && <p className="text-red-500 text-sm">{formErrors.date_of_birth}</p>}
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleAddUser} className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
