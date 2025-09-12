import { useState } from "react";
import { Upload } from "lucide-react";

export default function Scan() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setUploading(true);
      setTimeout(() => {
        setFile(selectedFile);
        setUploading(false);
        setUploaded(true);
      }, 1500);
    }
  };

  const handleReUpload = () => {
    setFile(null);
    setUploaded(false);
  };

  const handleAnalyze = () => {
    if (!file) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      alert("Analysis complete!");
    }, 2000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">

        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Scan & Classify Waste
        </h2>

        {/* File Upload */}
        <label className="block cursor-pointer">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-xl p-6 mb-4 hover:bg-green-50 hover:scale-[1.02] transition-transform duration-200 ease-in-out">
            <Upload className="text-green-600 w-10 h-10 mb-2" />
            <span className="text-green-700 font-medium">
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

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-full h-auto object-contain mx-auto rounded-md shadow-md mb-4"
          />
        )}

        {uploaded && (
          <div className="flex justify-center gap-4 mb-4">
            <button
              className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
              onClick={handleReUpload}
              disabled={uploading}
            >
              Re-upload
            </button>

            <button
              className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
