import { useLocation, Link } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const category = (location.state as any)?.category || "Unknown";

  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-semibold">Classification Result</h2>
      <p className="text-lg">This item is classified as:</p>
      <p className="text-3xl font-bold text-brand-600">{category}</p>

      <Link to="/centers" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
        Find Nearby Recycling Centers
      </Link>
    </div>
  );
}
