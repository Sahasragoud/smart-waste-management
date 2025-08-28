import { Leaf, Recycle, Wind, Star } from "lucide-react";

export default function Dashboard() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-16 px-6">
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-green-700 text-center mb-4 drop-shadow-sm">
        Your Eco Dashboard 🌱
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
        Track your positive environmental impact and see how your actions make
        a difference every day.
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
          <p className="text-sm text-gray-500 mt-2">Redeem for exciting rewards </p>
        </div>
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
