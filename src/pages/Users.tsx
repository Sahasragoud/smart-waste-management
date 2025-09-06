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

  const admins = users.filter(u => u.role === "admin" && u.username.toLowerCase().includes(search.toLowerCase()));
  const normalUsers = users.filter(u => u.role === "user" && u.username.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const renderTable = (title: string, data: User[]) => (
    <div className="p-6 bg-white rounded-2xl shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
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
            <th className="border px-4 py-2">Points</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(user => (
              <tr key={user.id} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.phone_number}</td>
                <td className="border px-4 py-2">{user.address}</td>
                <td className="border px-4 py-2">{user.date_of_birth}</td>
                <td className="border px-4 py-2">{user.created_date}</td>
                <td className="border px-4 py-2">{user.points}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                  {user.role === "user" && (
                    <button className="px-2 py-1 bg-yellow-500 text-white rounded">Update Password</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-4 text-gray-500 italic">
                No {title.toLowerCase()} found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const chartData = [
    { name: "Admins", value: admins.length },
    { name: "Users", value: normalUsers.length },
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <h1 className="text-3xl font-extrabold text-green-700 text-center mb-10">
        User Management 👥
      </h1>

      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300 w-1/2"
        />
      </div>

      {/* Pie Chart */}
      <div className="p-6 bg-white rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">Users vs Admins</h2>
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

      {/* Admins table */}
      {renderTable("Admins", admins)}

      {/* Users table */}
      {renderTable("Users", normalUsers)}
    </section>
  );
}
