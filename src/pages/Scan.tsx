import { useState } from "react";
import { Upload, ArrowRight, X } from "lucide-react";

export default function Scan() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [uploadDate, setUploadDate] = useState<string>("");

  const categoryDescriptions: { [key: string]: string } = {
    Batteries: "Improper disposal leads to soil and water contamination due to heavy metals.",
    "E-Waste": "Contains hazardous chemicals harming ecosystems and human health if not properly recycled.",
    Paints: "Release volatile organic compounds (VOCs) harmful to air quality.",
    Pesticides: "Pollute water sources and affect non-target organisms including beneficial insects.",
    "Ceramic Products": "Non-biodegradable, accumulate in landfills, causing long-term waste issues.",
    Diapers: "Non-biodegradable waste that causes land and water pollution.",
    "Plastic Bag Warps": "Cause blockage in drainage and are harmful to marine life.",
    "Sanitary Napkins": "Contain plastics that are slow to degrade and contaminate the environment.",
    "Coffee Tea Bags": "Often made with plastics, contributing to microplastic pollution.",
    "Egg-Shells": "Biodegradable but may attract pests if not properly composted.",
    "Food-Scraps": "Can generate methane in landfills if not composted properly.",
    "Kitchen-Waste": "Leads to methane emissions if not composted, contributing to greenhouse gases.",
    "Yard Trimmings": "Should be composted; otherwise, they occupy landfill space unnecessarily.",
    "Cans All Types": "If not recycled, contribute to metal waste accumulation.",
    "Glass Containers": "Non-biodegradable and can be hazardous if broken.",
    "Paper Products": "Deforestation and pollution if not recycled.",
    "Plastic Bottles": "Persist in the environment for hundreds of years causing pollution.",
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setUploading(true);
      setUploadDate(new Date().toLocaleString());
      setTimeout(() => {
        setFile(selectedFile);
        setUploading(false);
        setUploaded(true);
        setCategory(null);
        setShowPopup(false);
      }, 1500);
    }
  };

  const handleReUpload = () => {
    setFile(null);
    setUploaded(false);
    setCategory(null);
    setShowPopup(false);
  };

  const handleAnalyze = () => {
    if (!file) return;

    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      const dummyCategory = "Plastic Bottles";
      setCategory(dummyCategory);
      setShowPopup(true);
    }, 2000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6">

        {/* Compact Scan Section */}
        <div className="w-full md:w-80 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Scan Waste
          </h2>

          {!uploaded && (
            <label className="block cursor-pointer">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-xl p-4 mb-4 hover:bg-green-50 hover:scale-[1.02] transition-transform duration-200 ease-in-out">
                <Upload className="text-green-600 w-8 h-8 mb-2" />
                <span className="text-green-700 text-sm">
                  {uploading ? "Uploading..." : "Click to choose file or drag & drop"}
                </span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          )}

          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-32 h-32 object-contain mx-auto rounded-md shadow-md mb-4"
            />
          )}

          {file && (
            <p className="text-sm text-gray-500 mb-4 truncate">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}

          {uploaded && (
            <div className="flex flex-col gap-2 mb-4">
              <button
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition"
                onClick={handleReUpload}
                disabled={uploading}
              >
                Re-upload
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition"
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          )}

          {uploaded && !analyzing && !category && (
            <p className="text-green-700 font-medium">Uploaded successfully!</p>
          )}
        </div>

        {/* Responsive Analysis Result Popup Section */}
        {showPopup && category && (
          <div className="w-full md:w-80 p-4 border rounded-xl bg-green-100 relative">
            <button
              className="absolute top-2 right-2 text-green-600 hover:text-green-800"
              onClick={() => setShowPopup(false)}
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Detected Category:
            </h3>
            <p className="text-green-900 font-bold mb-4">{category}</p>

            <p className="italic text-gray-700 mb-4 text-sm">
              {categoryDescriptions[category] || "No description available."}
            </p>

            <p className="text-gray-500 mb-4 text-xs">
              Uploaded on: <span className="font-medium">{uploadDate}</span>
            </p>

            <button className="flex items-center justify-center px-3 py-1 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 text-sm">
              For Guidance <ArrowRight className="ml-2" size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
