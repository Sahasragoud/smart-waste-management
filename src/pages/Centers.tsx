import { useState } from "react";
import { MapPin, Phone, Clock, Search, Recycle } from "lucide-react";
import { motion } from "framer-motion";

type Center = {
  id: number;
  name: string;
  distance: string;
  address: string;
  phone?: string;
  hours?: string;
  category: string;
};

const centers: Center[] = [
  {
    id: 1,
    name: "♻️ Green Earth Center",
    distance: "2 km away",
    address: "123 Green St, Eco City",
    phone: "9876543210",
    hours: "9:00 AM - 6:00 PM",
    category: "Plastic",
  },
  {
    id: 2,
    name: "🌱 EcoDrop Station",
    distance: "5 km away",
    address: "456 Clean Ave, Eco Town",
    phone: "9123456780",
    hours: "10:00 AM - 8:00 PM",
    category: "E-Waste",
  },
  {
    id: 3,
    name: "🌍 PaperCycle Hub",
    distance: "3 km away",
    address: "789 Paper Rd, GreenVille",
    phone: "9876512345",
    hours: "8:00 AM - 7:00 PM",
    category: "Paper",
  },
];

export default function Centers() {
  const [search, setSearch] = useState("");

  const filteredCenters = centers.filter(
    (center) =>
      center.name.toLowerCase().includes(search.toLowerCase()) ||
      center.address.toLowerCase().includes(search.toLowerCase()) ||
      center.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-16 px-6 bg-gradient-to-b from-green-50 to-green-100 min-h-screen">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
        Nearby Recycling Centers
      </h2>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10 flex items-center bg-white shadow-md rounded-full px-4 py-2">
        <Search className="h-5 w-5 text-green-600 mr-2" />
        <input
          type="text"
          placeholder="Search by name, address or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none bg-transparent text-gray-700"
        />
      </div>

      {/* Centers Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {filteredCenters.map((center, index) => (
          <motion.div
            key={center.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Recycle className="h-5 w-5 text-green-600" />
              {center.name}
            </h3>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
              {center.category}
            </span>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              {center.address} • {center.distance}
            </p>
            {center.phone && (
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4 text-green-600" />
                {center.phone}
              </p>
            )}
            {center.hours && (
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-green-600" />
                {center.hours}
              </p>
            )}

            <div className="mt-4 flex justify-end">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  center.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition"
              >
                Open in Maps
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCenters.length === 0 && (
        <p className="text-center text-gray-600 mt-10">
          No recycling centers found for your search.
        </p>
      )}
    </div>
  );
}
