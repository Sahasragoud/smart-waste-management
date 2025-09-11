import { useState, useRef, useEffect } from "react";
import { deleteUpload, getUploads } from "../services/AdminServices";
export interface File {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  userId: number;
  category: string;
  confidence: number;
  guidance?: string;
  createdAt: string;
  userName: string;
  email :string;
}

export default function Uploads() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentFileId, setCurrentFileId] = useState<number | null>(null);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const [totalPages, setTotalPages] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [searchTerm, setSearchTerm] = useState("");

  const fetchFiles = async () => {
    try {
      const res = await getUploads(page, size, sortField, sortDirection);
      const fileList: File[] = res.data.content;
      setFiles(fileList);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch uploads", err);
    }
  };


  useEffect(() => {
    fetchFiles();
  }, [page, size, sortField, sortDirection]);

  const handleDelete = async (id: number) => {
    try {
      await deleteUpload(id);
      fetchFiles();
    } catch (err) {
      console.error("Error deleting file", err);
    }
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
              fileName: newFile.name,
              createdAt: new Date().toISOString(),
            }
          : file
      )
    );
    e.target.value = "";
    setCurrentFileId(null);
  };

  const handleView = (file: File) => setSelectedFile(file);
  const closeModal = () => setSelectedFile(null);

  // ✅ filter by username
  const filteredFiles= searchTerm
    ? files.filter((file) =>
        file.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : files;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };
  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <h2 className="text-3xl font-extrabold text-green-700 text-center mb-10">
        Uploads 📂
      </h2>

      {/* 🔍 Search + Sort */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search by uploader..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 rounded border border-gray-300"
        />
        <select
          value={sortField}
          onChange={(e) =>
            setSortField(e.target.value as "username" | "points")
          }
          className="px-4 py-2 rounded border border-gray-300"
        >
          <option value="username">Sort by Username</option>
          <option value="points">Sort by Points</option>
        </select>
        <button
          className="px-4 py-2 border rounded"
          onClick={() =>
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC")
          }
        >
          {sortDirection === "ASC" ? "⬆️ ASC" : "⬇️ Desc"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-green-700 text-left">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">File Name</th>
              <th className="py-3 px-4">Uploaded By</th>
              <th className="py-3 px-4">Uploaded Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
            <tbody>
            {filteredFiles.length > 0 ? (
              files.map((file, idx) => {                
                return (
                  <tr
                    key={file.id}
                    className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="py-3 px-4">{file.id}</td>
                    <td className="py-3 px-4 font-semibold">{file.fileName}</td>
                    <td className="py-3 px-4">{file.userName}</td>
                    <td className="py-3 px-4">{file.createdAt}</td>
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
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No files found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        
      {/* ⏩ Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg ${
            page === 0 ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Prev
        </button>
        <p className="text-gray-600">
          Page {page} of {totalPages}
        </p>
        <button
          disabled={page === totalPages-1}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg ${
            page === totalPages-1 ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>

      {/* Hidden file input for reupload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

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
              src={selectedFile.filePath}
              alt={selectedFile.fileName}
              className="w-40 h-40 object-cover rounded-lg mb-4 mx-auto"
            />

            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">📄 File Name:</span>{" "}
                {selectedFile.fileName}
              </p>
              <p>
                <span className="font-semibold">👤 Uploaded By:</span>{" "}
                {selectedFile.userName|| "Unknown"}
              </p>
              <p>
                <span className="font-semibold">📧 Email:</span>{" "}
                {selectedFile.email || "N/A"}
              </p>
              <p>
                <span className="font-semibold">📅 Uploaded Date:</span>{" "}
                {selectedFile.createdAt}
              </p>
              <p>
                <span className="font-semibold">🛤️ Path:</span>{" "}
                <a
                  href={selectedFile.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {selectedFile.filePath}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
