import { useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Scan() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // Local descriptions (no API)
  const categoryDescriptions: { [key: string]: string } = {
    Batteries: "Dispose at hazardous waste collection points.",
    "E-Waste": "Recycle electronics at e-waste centers.",
    Paints: "Take unused paints to hazardous waste facilities.",
    Pesticides: "Dispose according to local hazardous waste rules.",
    "Ceramic Products": "Dispose in general waste or recycle if possible.",
    Diapers: "Dispose in sanitary waste bins.",
    "Plastic Bags & Wraps": "Recycle with plastic bag collection programs.",
    "Sanitary Napkin": "Use sanitary waste disposal.",
    "Styrofoam Products": "Recycle if local programs accept, otherwise general waste.",
    "Coffee & Tea Bags": "Compost if biodegradable.",
    "Egg Shells": "Compost as organic waste.",
    "Food Scraps": "Compost or dispose as organic waste.",
    "Kitchen Waste": "Compost or dispose in organic bin.",
    "Yard Trimmings": "Compost or use green waste collection.",
    "Cans (All Types)": "Rinse and recycle in metal bins.",
    "Glass Containers": "Rinse and recycle in glass bins.",
    "Paper Products": "Recycle paper products in paper bins.",
    "Plastic Bottles": "Rinse and recycle in plastic bottle bins.",
  };

  // Fake detection (just filename check)
  const fakeDetection = (fileName: string) => {
    const name = fileName.toLowerCase();
    if (name.includes("battery")) return "Batteries";
    if (name.includes("ewaste") || name.includes("electronics")) return "E-Waste";
    if (name.includes("paint")) return "Paints";
    if (name.includes("pesticide")) return "Pesticides";
    if (name.includes("ceramic")) return "Ceramic Products";
    if (name.includes("diaper")) return "Diapers";
    if (name.includes("plastic")) return "Plastic Bags & Wraps";
    if (name.includes("napkin") || name.includes("sanitary")) return "Sanitary Napkin";
    if (name.includes("styrofoam")) return "Styrofoam Products";
    if (name.includes("coffee") || name.includes("tea")) return "Coffee & Tea Bags";
    if (name.includes("egg")) return "Egg Shells";
    if (name.includes("food") || name.includes("scrap")) return "Food Scraps";
    if (name.includes("kitchen")) return "Kitchen Waste";
    if (name.includes("yard")) return "Yard Trimmings";
    if (name.includes("can")) return "Cans (All Types)";
    if (name.includes("glass")) return "Glass Containers";
    if (name.includes("paper")) return "Paper Products";
    if (name.includes("bottle")) return "Plastic Bottles";
    return "Unknown Category";
  };

  const handleAnalyze = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);
    setCategory(null);
    setDescription(null);

    setTimeout(() => {
      const detectedCategory = fakeDetection(file.name);
      setCategory(detectedCategory);
      setDescription(categoryDescriptions[detectedCategory] || "No description available.");
      setShowPopup(true);
      setLoading(false);
    }, 1000);
  };

  const handleReupload = () => {
    setFile(null);
    setCategory(null);
    setDescription(null);
    setLoading(false);
    setShowPopup(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-6">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-green-700 mb-6">
          Scan & Classify Waste
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Upload an image of your waste item, and our system will analyze it
          using simple keyword detection (no internet needed).
        </p>

        {!file && (
          <label className="block cursor-pointer">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-2xl p-10 mb-6 hover:bg-green-100 hover:scale-[1.02] transition-transform duration-200 ease-in-out">
              <Upload className="text-green-600 w-14 h-14 mb-3" />
              <span className="text-green-700 font-medium text-lg">
                Click to choose file or drag & drop
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        )}

        {file && (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-60 h-60 object-contain mx-auto rounded-lg shadow-md mb-6"
            />

            <p className="text-base text-gray-500 mb-6">
              Selected: <span className="font-medium">{file.name}</span>
            </p>

            <div className="flex justify-between space-x-6">
              <button
                className="flex-1 px-8 py-4 bg-yellow-500 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-yellow-600 active:scale-95 transition"
                onClick={handleReupload}
              >
                Re-upload
              </button>

              <button
                className="flex-1 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </>
        )}

        {showPopup && category && description && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
              <h3 className="text-2xl font-bold text-green-700 mb-4">{category}</h3>
              <p className="text-gray-700 mb-6">{description}</p>

              <button
                className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 active:scale-95 transition"
                onClick={() => navigate(`/guidance/${encodeURIComponent(category)}`)}
              >
                Guidance
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
