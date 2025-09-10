import { useState, useRef } from "react";

export default function Uploads() {
  const [files, setFiles] = useState([
    {
      id: 1,
      filename: "plastic_report.pdf",
      uploadedBy: "Rushwitha",
      email: "rushwitha@example.com",
      date: "2025-09-01",
      path: "/uploads/plastic_report.pdf",
      ecoPoints: 25,
      lastUpdated: "2025-09-05",
      image: "https://via.placeholder.com/150/4ade80/ffffff?text=Plastic",
    },
    {
      id: 2,
      filename: "paper_summary.xlsx",
      uploadedBy: "Aarav",
      email: "aarav@example.com",
      date: "2025-09-02",
      path: "/uploads/paper_summary.xlsx",
      ecoPoints: 15,
      lastUpdated: "2025-09-06",
      image: "https://via.placeholder.com/150/60a5fa/ffffff?text=Paper",
    },
    {
      id: 3,
      filename: "metal_data.csv",
      uploadedBy: "Sneha",
      email: "sneha@example.com",
      date: "2025-09-03",
      path: "/uploads/metal_data.csv",
      ecoPoints: 30,
      lastUpdated: "2025-09-07",
      image: "https://via.placeholder.com/150/f87171/ffffff?text=Metal",
    },
  ]);

  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentFileId, setCurrentFileId] = useState<number | null>(null);

  // For modal
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  const handleDelete = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const handleReuploadClick = (id: number) => {
    setCurrentFileId(id);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || currentFileId === null) return;

    const newFile = e.target.files[0];
    setFiles(
      files.map((file) =>
        file.id === currentFileId
          ? {
              ...file,
              filename: newFile.name,
              date: new Date().toISOString().split("T")[0],
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : file
      )
    );

    e.target.value = "";
    setCurrentFileId(null);
  };

  // ✅ View opens modal
  const handleView = (file: any) => {
    setSelectedFile(file);
  };

  const closeModal = () => setSelectedFile(null);

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
                      onClick={() => handleView(file)}
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

      {/* ✅ Modal */}
      {selectedFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✖
            </button>

            <h3 className="text-2xl font-bold text-green-700 mb-4">
              File Details
            </h3>

            <img
              src={selectedFile.image}
              alt={selectedFile.filename}
              className="w-40 h-40 object-cover rounded-lg mb-4 mx-auto"
            />

            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">📄 File Name:</span> {selectedFile.filename}</p>
              <p><span className="font-semibold">👤 Uploaded By:</span> {selectedFile.uploadedBy}</p>
              <p><span className="font-semibold">📧 Email:</span> {selectedFile.email}</p>
              <p><span className="font-semibold">📅 Uploaded Date:</span> {selectedFile.date}</p>
              <p>
                <span className="font-semibold">🛤️ Path:</span>{" "}
                <a
                  href={selectedFile.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {selectedFile.path}
                </a>
              </p>
              <p><span className="font-semibold">🌱 EcoPoints:</span> {selectedFile.ecoPoints}</p>
              <p><span className="font-semibold">🕒 Last Updated:</span> {selectedFile.lastUpdated}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
