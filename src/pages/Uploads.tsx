// src/pages/Uploads.tsx
import { useState } from "react";

export default function Uploads() {
  const [files, setFiles] = useState([
    { id: 1, filename: "plastic_report.pdf", uploadedBy: "Rushwitha", date: "2025-09-01" },
    { id: 2, filename: "paper_summary.xlsx", uploadedBy: "Aarav", date: "2025-09-02" },
    { id: 3, filename: "metal_data.csv", uploadedBy: "Sneha", date: "2025-09-03" },
  ]);

  const handleDelete = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <h2 className="text-3xl font-extrabold text-green-700 text-center mb-10">
        Uploads 📂
      </h2>

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-green-700 text-left">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">File Name</th>
              <th className="py-3 px-4">Uploaded By</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, idx) => (
              <tr
                key={file.id}
                className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="py-3 px-4">{file.id}</td>
                <td className="py-3 px-4 font-semibold">{file.filename}</td>
                <td className="py-3 px-4">{file.uploadedBy}</td>
                <td className="py-3 px-4">{file.date}</td>
                <td className="py-3 px-4 space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
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
