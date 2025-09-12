import { useState } from "react";
import { Upload } from "lucide-react";

export default function Scan() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);

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

  const handleReupload = () => {
    setFile(null);
    setCategory(null);
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-6">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-green-700 mb-6">
          Scan & Classify Waste
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Upload an image of your waste item, and our system will analyze it
          to determine the correct category for recycling.
        </p>

        {/* Upload area */}
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

        {/* Image Preview */}
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

        {/* Results */}
        {category && !loading && (
          <div className="mt-8">
            <p className="text-2xl font-semibold text-green-700">
              Waste Category:{" "}
              <span className="text-green-900">{category}</span>
            </p>
            <p className="mt-3 text-xl font-medium text-green-800">
              You earned {pointsMap[category] || 0} points for this scan!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
