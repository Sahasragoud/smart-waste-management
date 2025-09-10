import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Centre {
  id: string;
  name: string;
  address: string;
  distance: number | string;
  coordinates: [number, number]; // [lng, lat]
}

const FitBounds = ({ centres }: { centres: Centre[] }) => {
  const map = useMap();
  useEffect(() => {
    if (centres.length > 0) {
      const bounds = L.latLngBounds(
        centres.map((c) => [c.coordinates[1], c.coordinates[0]])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [centres, map]);
  return null;
};

export default function Centers() {
  const [centres, setCentres] = useState<Centre[]>([]);
  const [locationStatus, setLocationStatus] = useState("Fetching location...");

  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  const categories = [
    "service.recycling",
    "service.recycling.container",
    "service.recycling.centre",
    "service.recycling.bin",
  ];

  const fetchCentres = async (lat: number, lng: number, radius: number = 10000) => {
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
          fetchCentres(lat, lng, radius * 2);
        } else {
          setLocationStatus("No centres found nearby ❌");
        }
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

  const openInGoogleMaps = (coords: [number, number]) => {
    const [lng, lat] = coords;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <h2 className="text-3xl font-extrabold text-green-700 text-center mb-8">
        Nearby Recycling Centres ♻️
      </h2>

      <p className="text-center text-gray-600 mb-6">{locationStatus}</p>

      {centres.length > 0 && (
        <MapContainer
          style={{ height: "400px", width: "100%" }}
          center={[centres[0].coordinates[1], centres[0].coordinates[0]]}
          zoom={13}
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {centres.map((centre) => (
            <Marker
              key={centre.id}
              position={[centre.coordinates[1], centre.coordinates[0]]}
            >
              <Popup>
                <strong>{centre.name}</strong>
                <br />
                {centre.address}
                <br />
                <button
                  onClick={() => openInGoogleMaps(centre.coordinates)}
                  className="bg-green-600 text-white px-2 py-1 rounded mt-1"
                >
                  Open in Google Maps
                </button>
              </Popup>
            </Marker>
          ))}
          <FitBounds centres={centres} />
        </MapContainer>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto mt-6">
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
            {centres.map((centre, idx) => (
              <tr
                key={centre.id}
                className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="py-3 px-4 font-semibold">{centre.name}</td>
                <td className="py-3 px-4">{centre.address}</td>
                <td className="py-3 px-4">{centre.distance}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => openInGoogleMaps(centre.coordinates)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Show on Map
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
