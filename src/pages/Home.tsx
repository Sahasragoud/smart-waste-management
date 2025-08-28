// Inside Home.tsx
import { useRef } from "react";
import { motion } from "framer-motion";
import { FaRecycle, FaLeaf, FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {
  const infoRef = useRef<HTMLDivElement | null>(null);

  const scrollToInfo = () => {
    infoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 px-6 flex flex-col justify-center items-center">
      {/* Hero Section */}
      <motion.div
        className="text-center max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-6xl font-extrabold text-green-700 drop-shadow-lg">
          Hello EcoSort 🌍
        </h1>
        <p className="mt-6 text-xl text-gray-700 leading-relaxed">
          Smarter Waste Management starts here. <br />
          Join us in making the world{" "}
          <span className="font-semibold text-green-600">cleaner and greener</span>
          with technology-driven recycling solutions.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex gap-6 justify-center">
          {/* ✅ Go to Login */}
          <Link
            to="/login"
            className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-green-700 transition"
          >
            Get Started
          </Link>

          {/* ✅ Scroll to Info Section */}
          <button
            onClick={scrollToInfo}
            className="px-8 py-4 bg-white border-2 border-green-600 text-green-700 text-lg font-semibold rounded-xl shadow-lg hover:bg-green-50 hover:scale-105 transition"
          >
            Learn More
          </button>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        ref={infoRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
          <FaRecycle className="text-green-600 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-green-700">Smart Recycling</h3>
          <p className="text-gray-600 mt-2">
            AI-powered scanning to sort and recycle waste effectively.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
          <FaLeaf className="text-green-600 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-green-700">Eco-Friendly</h3>
          <p className="text-gray-600 mt-2">
            Reduce pollution and contribute to a sustainable future.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
          <FaAward className="text-green-600 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-green-700">Earn Rewards</h3>
          <p className="text-gray-600 mt-2">
            Get points and rewards for every successful recycling action.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

