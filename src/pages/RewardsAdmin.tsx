// src/pages/RewardsAdmin.tsx
import { useState } from "react";

export default function RewardsAdmin() {
  const [rewards, setRewards] = useState([
    { id: 1, user: "Rushwitha", reward: "Eco Points - 500", date: "2025-09-01", status: "Redeemed" },
    { id: 2, user: "Aarav", reward: "Coupon - ₹200", date: "2025-09-02", status: "Pending" },
    { id: 3, user: "Sneha", reward: "Gift Card - ₹500", date: "2025-09-03", status: "Redeemed" },
  ]);

  const handleDelete = (id: number) => {
    setRewards(rewards.filter((r) => r.id !== id));
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <h2 className="text-3xl font-extrabold text-green-700 text-center mb-10">
        Rewards 🎁
      </h2>

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-5xl mx-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-green-700 text-left">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Reward</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((reward, idx) => (
              <tr
                key={reward.id}
                className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="py-3 px-4">{reward.id}</td>
                <td className="py-3 px-4 font-semibold">{reward.user}</td>
                <td className="py-3 px-4">{reward.reward}</td>
                <td className="py-3 px-4">{reward.date}</td>
                <td
                  className={`py-3 px-4 font-semibold ${
                    reward.status === "Redeemed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {reward.status}
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(reward.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
