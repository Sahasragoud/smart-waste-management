// src/pages/Centers.tsx
import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Search, Recycle } from "lucide-react";
import { motion } from "framer-motion";

type Center = {
  id: number;
  name: string;
  address: string;
  phone?: string;
  hours?: string;
  category: string;
  latitude: number;
  longitude: number;
};

export default function Centers() {
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationOption, setLocationOption] = useState<"current" | "ip" | null>(null);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(coords);
        setLocationOption("current");
        fetchCenters(coords.latitude, coords.longitude);
      },
      () => {
        setLocationOption(null);
        setLoading(false);
      }
    );
  }, []);

  // Fetch OSM recycling centers
  const fetchCenters = async (lat: number, lon: number) => {
    setLoading(true);
    const delta = 0.5; // ~50 km bounding box
    const south = lat - delta;
    const north = lat + delta;
    const west = lon - delta;
    const east = lon + delta;

    const query = `
      [out:json][timeout:60];
      (
        node["amenity"="recycling"](${south},${west},${north},${east});
        node["shop"="recycling"](${south},${west},${north},${east});
      );
      out body;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.elements || data.elements.length === 0) {
        console.warn("No centers found in this area.");
        setCenters([]);
        setLoading(false);
        return;
      }

      const centers: Center[] = data.elements.map((el: any) => ({
        id: el.id,
        name: el.tags.name || "Recycling Center",
        address: el.tags["addr:full"] || el.tags["addr:street"] || "Address not available",
        latitude: el.lat,
        longitude: el.lon,
        category: "Recycling",
        phone: el.tags.phone,
        hours: el.tags.opening_hours,
      }));

      setCenters(centers);
    } catch (err) {
      console.error("Failed to fetch OSM centers:", err);
      setCenters([]);
    } finally {
      setLoading(false);
    }
  };

  // Use IP location fallback
  const handleUseIpLocation = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      const coords = { latitude: data.latitude, longitude: data.longitude };
      setUserLocation(coords);
      setLocationOption("ip");
      fetchCenters(coords.latitude, coords.longitude);
    } catch (err) {
      console.error("IP location fetch failed:", err);
      setLoading(false);
    }
  };

  const filteredCenters = centers.filter(
    (center) =>
      center.name.toLowerCase().includes(search.toLowerCase()) ||
      center.address.toLowerCase().includes(search.toLowerCase()) ||
      center.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center mt-20 text-green-700 font-semibold">Loading...</p>;

  if (!locationOption) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-lg font-semibold text-green-700 text-center">
          We couldn’t get your current location.
        </p>
        <button
          onClick={() =>
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                setUserLocation(coords);
                setLocationOption("current");
                fetchCenters(coords.latitude, coords.longitude);
              },
              () => alert("Failed to get current location.")
            )
          }
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          Use Current Location
        </button>
        <button onClick={handleUseIpLocation} className="px-6 py-2 bg-yellow-500 text-white rounded-lg">
          Use IP-based Location
        </button>
      </div>
    );
  }

  return (
    <div className="py-16 px-6 bg-gradient-to-b from-green-50 to-green-100 min-h-screen">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-8">Nearby Recycling Centers</h2>

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

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {filteredCenters.map((center, index) => (
          <motion.div
            key={center.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
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
              {center.address}
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
                href={`https://www.google.com/maps/search/?api=1&query=${center.latitude},${center.longitude}`}
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
        <p className="text-center text-gray-600 mt-10">No recycling centers found.</p>
      )}
    </div>
  );
}
