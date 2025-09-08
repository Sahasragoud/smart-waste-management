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

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Centers() {
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationOption, setLocationOption] = useState<"current" | "ip" | null>(null);

  const fetchIpLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      setUserLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    } catch (err) {
      console.error("IP location fetch failed:", err);
    }
  };

  useEffect(() => {
    // First, try to get Current Location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationOption("current");
        setLoading(false);
      },
      () => {
        // If denied, do NOT auto-fetch IP location yet
        setLocationOption(null);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    fetch("/api/centers")
      .then((res) => res.json())
      .then((data: Center[]) => setCenters(data))
      .catch((err) => console.error("Failed to fetch centers:", err));
  }, []);

  const handleUseIpLocation = () => {
    setLoading(true);
    fetchIpLocation().then(() => {
      setLocationOption("ip");
      setLoading(false);
    });
  };

  const filteredCenters = centers.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(search.toLowerCase()) ||
      center.address.toLowerCase().includes(search.toLowerCase()) ||
      center.category.toLowerCase().includes(search.toLowerCase());

    let isNearby = true;
    if (userLocation) {
      const distance = getDistance(
        userLocation.latitude,
        userLocation.longitude,
        center.latitude,
        center.longitude
      );
      isNearby = distance <= 5;
    }

    return matchesSearch && isNearby;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-green-700 font-semibold text-lg">Loading...</p>
      </div>
    );
  }

  if (!locationOption) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-lg font-semibold text-green-700 text-center">
          We couldn’t get your current location.
        </p>
        <button
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setUserLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
                setLocationOption("current");
              },
              () => alert("Failed to get current location.")
            );
          }}
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          Use Current Location
        </button>

        <button
          onClick={handleUseIpLocation}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg"
        >
          Use IP-based Location
        </button>
      </div>
    );
  }

  return (
    <div className="py-16 px-6 bg-gradient-to-b from-green-50 to-green-100 min-h-screen">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
        Nearby Recycling Centers
      </h2>

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
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address)}`}
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
          No recycling centers found near your location.
        </p>
      )}
    </div>
  );
}

