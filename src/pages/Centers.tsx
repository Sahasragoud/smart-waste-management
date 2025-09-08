// src/components/Centers.tsx
import { useState, useEffect } from "react";
import { MapPin, Recycle, Search } from "lucide-react";
import { motion } from "framer-motion";

type Center = {
  id: number;
  name: string;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
  phone?: string;
  hours?: string;
};

// Helper: distance in km
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
  const [centers, setCenters] = useState<Center[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationOption, setLocationOption] = useState<"current" | "ip" | null>(null);
  const [search, setSearch] = useState("");

  // Add center form
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");

  // Load centers from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("centers");
    if (stored) setCenters(JSON.parse(stored));
    setLoading(false);
  }, []);

  // Save centers to LocalStorage
  const saveCenters = (updated: Center[]) => {
    setCenters(updated);
    localStorage.setItem("centers", JSON.stringify(updated));
  };

  // Add a new center
  const addCenter = () => {
    if (!name || !address || !category) return;

    const newCenter: Center = {
      id: Date.now(),
      name,
      address,
      category,
      latitude: 12.9716,   // default or could use geocoding API
      longitude: 77.5946,
    };
    const updated = [...centers, newCenter];
    saveCenters(updated);
    setName(""); setAddress(""); setCategory("");
  };

  // Get user location
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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocationOption("current");
        setLoading(false);
      },
      () => {
        setLocationOption(null);
        setLoading(false);
      }
    );
  }, []);

  const handleUseIpLocation = () => {
    setLoading(true);
    fetchIpLocation().then(() => {
      setLocationOption("ip");
      setLoading(false);
    });
  };

  // Filter and sort centers
  const filteredCenters = centers
    .filter((center) =>
      center.name.toLowerCase().includes(search.toLowerCase()) ||
      center.address.toLowerCase().includes(search.toLowerCase()) ||
      center.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!userLocation) return 0;
      const distA = getDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
      const distB = getDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
      return distA - distB;
    });

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  if (!locationOption) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p>We couldn’t get your location.</p>
        <button onClick={() => navigator.geolocation.getCurrentPosition(
          (pos) => { setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }); setLocationOption("current"); },
          () => alert("Failed to get location")
        )}>Use Current Location</button>
        <button onClick={handleUseIpLocation}>Use IP Location</button>
      </div>
    );
  }

  return (
    <div className="py-10 px-6 bg-green-50 min-h-screen">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-8">Recycling Centers</h2>

      {/* Add Center */}
      <div className="max-w-md mx-auto mb-8 space-y-2 p-4 bg-white rounded-xl shadow">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded"/>
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className="w-full p-2 border rounded"/>
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="w-full p-2 border rounded"/>
        <button onClick={addCenter} className="w-full bg-green-600 text-white p-2 rounded">Add Center</button>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-6 flex items-center bg-white shadow-md rounded-full px-4 py-2">
        <Search className="h-5 w-5 text-green-600 mr-2"/>
        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full outline-none bg-transparent"/>
      </div>

      {/* Centers List */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {filteredCenters.map(center => (
          <motion.div key={center.id} initial={{ opacity:0, y:20 }} animate={{opacity:1, y:0}} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2"><Recycle className="w-5 h-5 text-green-600"/> {center.name}</h3>
            <p className="text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4 text-green-600"/> {center.address}</p>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full mt-2">{center.category}</span>
          </motion.div>
        ))}
        {filteredCenters.length === 0 && <p className="text-center mt-10 text-gray-600">No centers found.</p>}
      </div>
    </div>
  );
}
