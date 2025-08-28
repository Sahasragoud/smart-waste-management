import { useState } from "react";
import { Upload } from "lucide-react";

export default function Scan() {
  const [fileName, setFileName] = useState("");

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
            onChange={(e) =>
              setFileName(e.target.files?.[0]?.name || "")
            }
          />
        </label>

        {/* File Name Preview */}
        {fileName && (
          <p className="text-sm text-gray-500 mb-4">
            Selected: <span className="font-medium">{fileName}</span>
          </p>
        )}

        {/* Analyze Button */}
        <button className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition">
          Upload & Analyze
        </button>
      </div>
    </section>
  );
}
