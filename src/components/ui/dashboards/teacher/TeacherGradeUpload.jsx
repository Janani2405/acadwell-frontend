import React, { useState, useEffect } from "react";
import { Download, UploadCloud, Check, AlertCircle } from "lucide-react";
import { gradesApi } from "../../../../api/api";
import "../../../css/dashboards/teacher/TeacherDashboard.css";

const TeacherGradeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadStatusType, setUploadStatusType] = useState(""); // "success" or "error"
  const [isUploading, setIsUploading] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [date, setDate] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [testType, setTestType] = useState("");

  // Fetch upload history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await gradesApi.fetchUploadHistory();
      if (data.success) {
        setHistory(data.files || []);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
    setUploadStatus("");
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus("");
    setUploadStatusType("");

    if (!selectedFile) {
      setUploadStatus("Please select a file (CSV or Excel).");
      setUploadStatusType("error");
      return;
    }

    if (!date || !semester || !department || !testType) {
      setUploadStatus("Please fill all fields: date, semester, department, and test type.");
      setUploadStatusType("error");
      return;
    }

    setIsUploading(true);
    try {
      const data = await gradesApi.uploadGrades(
        selectedFile,
        date,
        semester,
        department,
        testType
      );

      if (data.success) {
        setUploadStatus(data.message);
        setUploadStatusType("success");
        setSelectedFile(null);
        setDate("");
        setSemester("");
        setDepartment("");
        setTestType("");
        
        // Refresh history
        setTimeout(() => fetchHistory(), 500);
      } else {
        setUploadStatus(data.message || "Upload failed");
        setUploadStatusType("error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("Server error while uploading");
      setUploadStatusType("error");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `RegNo,Subject,Marks
CSE-001,Mathematics,85
CSE-002,Physics,90
CSE-001,Physics,88`;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(template));
    element.setAttribute("download", "grades_template.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="teacher-dashboard-wrapper">
      <div className="teacher-dashboard-main">
        <div className="teacher-dashboard-content">
          {/* Upload Form Card */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="card-title">📤 Upload Grades</h2>
            <p className="card-subtitle">Upload student grades from CSV or Excel files</p>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              {/* File Input and Template Download */}
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">📄 File (CSV / XLSX)</label>
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Template
                  </button>
                </div>
              </div>

              {/* Metadata Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">📅 Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={isUploading}
                    className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">📚 Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    disabled={isUploading}
                    className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[...Array(8)].map((_, i) => (
                      <option key={i} value={String(i + 1)}>
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">🏢 Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    disabled={isUploading}
                    className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="EEE">Electrical & Electronics</option>
                    <option value="MECH">Mechanical</option>
                    <option value="CIVIL">Civil</option>
                    <option value="IT">Information Technology</option>
                    <option value="AI&DS">AI & Data Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">📝 Test Type</label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    disabled={isUploading}
                    className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select Test Type</option>
                    <option value="CAT-1">CAT 1</option>
                    <option value="CAT-2">CAT 2</option>
                    <option value="CAT-3">CAT 3</option>
                    <option value="Mid-Semester">Mid Semester</option>
                    <option value="End-Semester">End Semester</option>
                    <option value="Arrear">Arrear</option>
                  </select>
                </div>
              </div>

              {/* Upload Button */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full p-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200"
              >
                <UploadCloud className="w-5 h-5" />
                {isUploading ? "Uploading..." : "Upload Grades"}
              </button>

              {/* Status Message */}
              {uploadStatus && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    uploadStatusType === "success"
                      ? "bg-green-500/20 border border-green-500/30 text-green-300"
                      : "bg-red-500/20 border border-red-500/30 text-red-300"
                  }`}
                >
                  {uploadStatusType === "success" ? (
                    <Check className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p className="text-sm">{uploadStatus}</p>
                </div>
              )}
            </form>
          </div>

          {/* Upload History Card */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <h3 className="card-title mt-8">📋 Upload History</h3>

            {loadingHistory ? (
              <p className="text-center text-gray-400 py-6">Loading history...</p>
            ) : history.length === 0 ? (
              <p className="text-center text-gray-400 py-6">No uploads yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-purple-600/40 text-left">
                      <th className="p-3">File Name</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Test Type</th>
                      <th className="p-3">Uploaded At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr
                        key={i}
                        className="hover:bg-white/5 border-b border-white/10 transition-colors"
                      >
                        <td className="p-3 font-medium text-blue-300">{h.fileName}</td>
                        <td className="p-3">{h.date || "-"}</td>
                        <td className="p-3">Sem {h.semester || "-"}</td>
                        <td className="p-3">{h.department || "-"}</td>
                        <td className="p-3">{h.testType || "-"}</td>
                        <td className="p-3 text-gray-400">
                          {h.uploadedAt
                            ? new Date(h.uploadedAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Format Guide */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="font-semibold text-sm mb-3">📌 File Format Requirements</h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>
                  <strong>Columns needed:</strong> RegNo (or Roll, Reg, Registration), Subject, Marks
                </li>
                <li>
                  <strong>Supported formats:</strong> CSV (.csv) or Excel (.xlsx)
                </li>
                <li>
                  <strong>Column names:</strong> Case-insensitive, handles variations
                </li>
                <li>
                  <strong>Data:</strong> Only students with matching registration numbers will be updated
                </li>
                <li>
                  <strong>Tip:</strong> Download the template to see the expected format
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherGradeUpload;