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

  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  const categories = [
   
    "service.recycling.centre",
    "service.recycling.bin",
  ];

  const fetchCentres = async (
    lat: number,
    lng: number,
    radius: number = 10000,
    allCentres: Centre[] = []
  ): Promise<void> => {
    if (!apiKey) {
      setLocationStatus("❌ Missing API key! Please set VITE_GEOAPIFY_API_KEY in .env");
      return;
    }

    try {
      const categoryParam = categories.join(",");
      const url = `https://api.geoapify.com/v2/places?categories=${categoryParam}&filter=circle:${lng},${lat},${radius}&limit=50&apiKey=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.features || data.features.length === 0) {
        if (radius < 100000) {
          setLocationStatus(`Expanding search radius to ${radius * 2 / 1000} km...`);
          return fetchCentres(lat, lng, radius * 2, allCentres);
        } else {
          if (allCentres.length === 0) setLocationStatus("No centres found nearby ❌");
          return;
        }
      }

      // Map new centres
      const newCentres: Centre[] = data.features.map((place: any) => ({
        id: place.properties.place_id,
        name: place.properties.name || "Unnamed Centre",
        address: `${place.properties.street || ""}, ${place.properties.city || ""}`,
        distance: place.properties.distance || "N/A",
        coordinates: place.geometry.coordinates,
      }));

      // Merge with previous results (avoid duplicates)
      const merged = [
        ...allCentres,
        ...newCentres.filter((c) => !allCentres.some((ac) => ac.id === c.id)),
      ];

      if (radius < 100000) {
        // Try a larger radius to get more centres
        return fetchCentres(lat, lng, radius * 2, merged);
      } else {
        // Final list
        setCentres(
          merged.sort((a, b) => {
            const distA = typeof a.distance === "number" ? a.distance : Infinity;
            const distB = typeof b.distance === "number" ? b.distance : Infinity;
            return distA - distB;
          })
        );
        setLocationStatus("Showing centres near your location 🌍");
      }
    } catch (err) {
      console.error("❌ Error fetching centres:", err);
      setLocationStatus("Error fetching centres ❌");
    }
  };

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
            try {
              const ipRes = await fetch("https://ipapi.co/json/");
              const ipData = await ipRes.json();
              const lat = ipData.latitude;
              const lng = ipData.longitude;
              setLocationStatus("Using approximate location from IP 🌐");
              fetchCentres(lat, lng);
            } catch {
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

  // Open all centres on Google Maps
  const openAllInGoogleMaps = () => {
    if (centres.length === 0) return;

    const origin = centres[0].coordinates;
    const waypoints = centres
      .slice(1)
      .map((c) => `${c.coordinates[1]},${c.coordinates[0]}`)
      .join("|");

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin[1]},${origin[0]}&destination=${origin[1]},${origin[0]}&waypoints=${waypoints}`;
    window.open(url, "_blank");
  };

  const openSingleInGoogleMaps = (coords: [number, number]) => {
    const [lng, lat] = coords;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <h2 className="text-3xl font-extrabold text-green-700 text-center mb-4">
        Nearby Recycling Centres ♻️
      </h2>

      <p className="text-center text-gray-600 mb-4">{locationStatus}</p>

      {centres.length > 0 && (
        <div className="text-center mb-6">
          <button
            onClick={openAllInGoogleMaps}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Show All on Google Maps
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-green-700 text-left">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Distance (m)</th>
              <th className="py-3 px-4">Action</th>
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
                  <td className="py-3 px-4">
                    <button
                      onClick={() => openSingleInGoogleMaps(centre.coordinates)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Show on Map
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
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


