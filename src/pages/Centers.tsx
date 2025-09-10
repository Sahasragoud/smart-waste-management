import { useEffect, useState } from "react";

interface Centre {
  id: string;
  name: string;
  address: string;
  distance: number | string;
  coordinates: [number, number]; // [lng, lat]
}

export default function Centers() {
  const [centres, setCentres] = useState<Centre[]>([]);
  const [locationStatus, setLocationStatus] = useState("Fetching location...");

  // ✅ Read from .env
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  // Categories to search
  const categories = [
    "office.government.environment",
    "power.plant.waste",
    "service.recycling",
    "service.recycling.container",
    "service.recycling.centre",
    "service.recycling.bin",
  ];

  // Fetch centres from Geoapify API
  const fetchCentres = async (lat: number, lng: number) => {
    if (!apiKey) {
      setLocationStatus("❌ Missing API key! Please set VITE_GEOAPIFY_API_KEY in .env");
      return;
    }

    try {
      const categoryParam = categories.join(",");

      const url = `https://api.geoapify.com/v2/places?categories=${categoryParam}&filter=circle:${lng},${lat},10000&bias=proximity:${lng},${lat}&limit=10&apiKey=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.features) {
        setLocationStatus("❌ No data received from Geoapify API");
        return;
      }

      const centresList: Centre[] = data.features.map((place: any) => ({
        id: place.properties.place_id,
        name: place.properties.name || "Unnamed Centre",
        address: `${place.properties.street || ""}, ${place.properties.city || ""}`,
        distance: place.properties.distance || "N/A",
        coordinates: place.geometry.coordinates,
      }));

      setCentres(centresList);
      setLocationStatus("Showing centres near your location 🌍");
    } catch (err) {
      console.error("❌ Error fetching centres:", err);
      setLocationStatus("Error fetching centres ❌");
    }
  };

  // Get location (with fallback to IP)
  useEffect(() => {
    const getLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            fetchCentres(lat, lng);
          },
          async () => {
            console.warn("⚠️ Location denied, using IP fallback");

            try {
              const ipRes = await fetch("https://ipapi.co/json/");
              const ipData = await ipRes.json();
              const lat = ipData.latitude;
              const lng = ipData.longitude;
              setLocationStatus("Using approximate location from IP 🌐");
              fetchCentres(lat, lng);
            } catch (ipErr) {
              console.error("❌ Error with IP location:", ipErr);
              setLocationStatus("Unable to get location ❌");
            }
          }
        );
      } else {
        setLocationStatus("Geolocation not supported ❌");
      }
    };

    getLocation();
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <h2 className="text-3xl font-extrabold text-green-700 text-center mb-8">
        Nearby Recycling Centres ♻️
      </h2>

      <p className="text-center text-gray-600 mb-6">{locationStatus}</p>

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-green-700 text-left">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Distance (m)</th>
            </tr>
          </thead>
          <tbody>
            {centres.length > 0 ? (
              centres.map((centre, idx) => (
                <tr
                  key={centre.id}
                  className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="py-3 px-4 font-semibold">{centre.name}</td>
                  <td className="py-3 px-4">{centre.address}</td>
                  <td className="py-3 px-4">{centre.distance}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  No centres found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
