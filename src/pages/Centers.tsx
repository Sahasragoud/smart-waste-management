import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Fix default marker issue in React-Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});
L.Marker.prototype.options.icon = DefaultIcon;

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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  // Example static centres (replace with real ones)
  const staticCentres: Centre[] = [
    {
      id: "1",
      name: "Green Earth Recycling",
      address: "MG Road, Hyderabad",
      distance: 1200,
      coordinates: [78.4867, 17.385], // lng, lat
    },
    {
      id: "2",
      name: "EcoBin Recycling Centre",
      address: "Banjara Hills, Hyderabad",
      distance: 3200,
      coordinates: [78.4424, 17.4126],
    },
    {
      id: "3",
      name: "Smart Waste Hub",
      address: "Kukatpally, Hyderabad",
      distance: 5600,
      coordinates: [78.3995, 17.4949],
    },
  ];

  useEffect(() => {
    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setUserLocation([lat, lng]);
            setLocationStatus("Showing static centres near your location 🌍");

            // Sort centres by distance
            const sorted = [...staticCentres].sort(
              (a, b) =>
                (typeof a.distance === "number" ? a.distance : Infinity) -
                (typeof b.distance === "number" ? b.distance : Infinity)
            );
            setCentres(sorted);
          },
          () => {
            setLocationStatus("⚠️ Location denied, showing default centres");
            setCentres(staticCentres);
          }
        );
      } else {
        setLocationStatus("❌ Geolocation not supported, showing default centres");
        setCentres(staticCentres);
      }
    };

    getLocation();
  }, []);

  const openInGoogleMaps = (coords: [number, number]) => {
    const [lng, lat] = coords;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <h2 className="text-3xl font-extrabold text-green-700 text-center mb-8">
        Nearby Recycling Centres ♻️
      </h2>

      <p className="text-center text-gray-600 mb-6">{locationStatus}</p>

      {/* Map Section */}
      <div className="h-[400px] w-full max-w-5xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg">
        <MapContainer
          center={userLocation || [17.385, 78.4867]} // Default Hyderabad
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* User Location */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>📍 You are here</Popup>
            </Marker>
          )}

          {/* Static Centres */}
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
                  className="text-green-600 underline mt-2 inline-block"
                >
                  Open in Google Maps
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Table Section */}
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
                  className={`border-b ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
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
