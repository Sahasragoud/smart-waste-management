import { useState } from "react";
import { Upload } from "lucide-react";

export default function Scan() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Points mapping per waste category
  const pointsMap: { [key: string]: number } = {
    Plastic: 10,
    Organic: 5,
    "E-Waste": 20,
    Hazardous: 15,
  };

  const handleAnalyze = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setCategory(null);

    fetch("/api/analyze", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        const detectedCategory = data.category || "Unknown Category";
        setCategory(detectedCategory);

        // Award points
        if (pointsMap[detectedCategory]) {
          setPoints((prev) => prev + pointsMap[detectedCategory]);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error uploading file:", error);
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Scan & Classify Waste
        </h2>
        <p className="text-gray-600 mb-6">
          Upload an image of your waste item, and our system will analyze it
          to determine the correct category for recycling.
        </p>

        {/* File Upload */}
        <label className="block cursor-pointer">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-xl p-6 mb-4 hover:bg-green-50 hover:scale-[1.02] transition-transform duration-200 ease-in-out">
            <Upload className="text-green-600 w-10 h-10 mb-2" />
            <span className="text-green-700 font-medium">
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

        {/* Image Preview */}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-40 h-40 object-contain mx-auto rounded-md shadow-md mb-4"
          />
        )}

        {/* File Name */}
        {file && (
          <p className="text-sm text-gray-500 mb-4">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}

        {/* Analyze Button */}
        <button
          className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition"
          onClick={handleAnalyze}
          disabled={!file || loading}
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>

        {/* Display Category & Points */}
        {category && !loading && (
          <div className="mt-4">
            <p className="text-xl font-semibold text-green-700">
              Waste Category:{" "}
              <span className="text-green-900">{category}</span>
            </p>
            <p className="mt-2 text-lg font-medium text-green-800">
              You earned {pointsMap[category] || 0} points for this scan!
            </p>
          </div>
        )}

        {/* Total Points */}
        <p className="mt-4 text-md font-semibold text-green-700">
          Total Points: {points}
        </p>
      </div>
    </section>
  );
}
