import { Gift, Star, Trophy, History } from "lucide-react";

export default function Rewards() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-green-50 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <Gift className="w-14 h-14 text-yellow-500" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-green-700 mb-2">
          Your Rewards
        </h2>
        <p className="text-gray-600 mb-6">Collect points and redeem amazing rewards 🌟</p>

        {/* Points */}
        <p className="mb-4 text-xl">
          ⭐ You have{" "}
          <span className="font-bold text-yellow-600">120 Points</span>
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
          <div
            className="bg-yellow-500 h-4 rounded-full transition-all duration-700 ease-out"
            style={{ width: "60%" }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mb-6">60% to your next reward 🎯</p>

        {/* Redeem Button */}
        <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-green-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition">
          Redeem Now
        </button>

        {/* Rewards Tiers */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            Available Rewards
          </h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Star className="text-yellow-500 w-6 h-6" />
                <p>₹100 Gift Card</p>
              </div>
              <span className="text-sm font-semibold text-green-700">200 pts</span>
            </div>

            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Trophy className="text-green-600 w-6 h-6" />
                <p>Eco-Friendly Bottle</p>
              </div>
              <span className="text-sm font-semibold text-green-700">300 pts</span>
            </div>
          </div>
        </div>

        {/* Reward History */}
        <div className="mt-10 text-left">
          <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
            <History className="w-5 h-5 text-green-600" /> Recent Activity
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ Redeemed ₹50 Voucher - 2 weeks ago</li>
            <li>🎯 Earned 50 Points - Recycling Event</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
