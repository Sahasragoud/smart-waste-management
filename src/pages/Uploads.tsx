import { useState, useRef } from "react";

export default function Uploads() {
  const [files, setFiles] = useState([
    { id: 1, filename: "plastic_report.pdf", uploadedBy: "Rushwitha", date: "2025-09-01" },
    { id: 2, filename: "paper_summary.xlsx", uploadedBy: "Aarav", date: "2025-09-02" },
    { id: 3, filename: "metal_data.csv", uploadedBy: "Sneha", date: "2025-09-03" },
  ]);

  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentFileId, setCurrentFileId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const handleReuploadClick = (id: number) => {
    setCurrentFileId(id);
    if (fileInputRef.current) {
      fileInputRef.current.click(); // trigger hidden input
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || currentFileId === null) return;

    const newFile = e.target.files[0];
    setFiles(
      files.map((file) =>
        file.id === currentFileId
          ? { ...file, filename: newFile.name, date: new Date().toISOString().split("T")[0] }
          : file
      )
    );

    e.target.value = ""; // reset input
    setCurrentFileId(null);
  };

  // ✅ NEW: handle view
  const handleView = (file: { id: number; filename: string; uploadedBy: string; date: string }) => {
    alert(`📄 File: ${file.filename}\n👤 Uploaded By: ${file.uploadedBy}\n📅 Date: ${file.date}`);
    // Later if you have file URLs:
    // window.open(file.url, "_blank");
  };

  // Filter files by "uploadedBy"
  const filteredFiles = files.filter((file) =>
    file.uploadedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <h2 className="text-3xl font-extrabold text-green-700 text-center mb-10">
        Uploads 📂
      </h2>

      {/* Search bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by uploader..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

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
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, idx) => (
                <tr
                  key={file.id}
                  className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="py-3 px-4">{file.id}</td>
                  <td className="py-3 px-4 font-semibold">{file.filename}</td>
                  <td className="py-3 px-4">{file.uploadedBy}</td>
                  <td className="py-3 px-4">{file.date}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => handleView(file)} // ✅ FIXED
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleReuploadClick(file.id)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                      Reupload
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No files found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Hidden file input for reupload */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
}
