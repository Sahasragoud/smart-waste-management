import { Leaf, Recycle, Wind, Star } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const data = [
    { day: "Mon", plastic: 0.3, co2: 0.5 },
    { day: "Tue", plastic: 0.5, co2: 0.8 },
    { day: "Wed", plastic: 0.7, co2: 1.0 },
    { day: "Thu", plastic: 0.4, co2: 0.6 },
    { day: "Fri", plastic: 0.6, co2: 0.9 },
    { day: "Sat", plastic: 0.8, co2: 1.2 },
    { day: "Sun", plastic: 1.0, co2: 1.5 },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-16 px-6">
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-green-700 text-center mb-4 drop-shadow-sm">
        Your Eco Dashboard 🌱
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
        Hi <span className="font-bold">Rushwitha</span>, here’s your weekly environmental impact!
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Plastic Reduced */}
        <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          <Recycle className="w-12 h-12 mx-auto text-green-600 mb-3" />
          <p className="text-lg text-gray-600">Plastic Reduced</p>
          <p className="text-3xl font-extrabold text-green-700">2 kg</p>
          <p className="text-sm text-gray-500 mt-2">Equivalent to 200 bottles </p>
        </div>

        {/* Trees Saved */}
        <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          <Leaf className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
          <p className="text-lg text-gray-600">Trees Saved</p>
          <p className="text-3xl font-extrabold text-emerald-700">3</p>
          <p className="text-sm text-gray-500 mt-2">Enough to offset 150 kg CO₂ </p>
        </div>

        {/* CO₂ Saved */}
        <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          <Wind className="w-12 h-12 mx-auto text-blue-500 mb-3" />
          <p className="text-lg text-gray-600">CO₂ Saved</p>
          <p className="text-3xl font-extrabold text-blue-600">5 kg</p>
          <p className="text-sm text-gray-500 mt-2">= 40 km of car emissions </p>
        </div>

        {/* Reward Points */}
        <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          <Star className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
          <p className="text-lg text-gray-600">Reward Points</p>
          <p className="text-3xl font-extrabold text-yellow-600">120</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <div className="bg-yellow-500 h-3 rounded-full" style={{ width: "60%" }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">60% to your next reward 🎯</p>
        </div>
      </div>

      {/* Graph */}
      <div className="max-w-4xl mx-auto mt-12 bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-green-700 mb-4">Weekly Impact</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="plastic" stroke="#16a34a" strokeWidth={3} name="Plastic (kg)" />
            <Line type="monotone" dataKey="co2" stroke="#2563eb" strokeWidth={3} name="CO₂ (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Call-to-action */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition">
          See More Insights →
        </button>
      </div>
    </section>
  );
}
