import React, { useState, useEffect } from "react";
import { Download, UploadCloud, Check, AlertCircle, Trash2, Eye, X } from "lucide-react";
import { gradesApi } from "../../../../api/api";
import "../../../css/dashboards/teacher/TeacherDashboard.css";

const TeacherGradeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadStatusType, setUploadStatusType] = useState(""); // "success" or "error"
  const [isUploading, setIsUploading] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showUploadDetails, setShowUploadDetails] = useState(null);
  const [uploadDetails, setUploadDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
        setUploadStatus(`${data.message} (Format: ${data.format || 'Standard'})`);
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

  const handleDeleteUpload = async (uploadId) => {
    try {
      const data = await gradesApi.deleteUpload(uploadId);
      if (data.success) {
        setUploadStatus(data.message);
        setUploadStatusType("success");
        setShowDeleteConfirm(null);
        fetchHistory();
      } else {
        setUploadStatus(data.message || "Delete failed");
        setUploadStatusType("error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setUploadStatus("Error deleting upload");
      setUploadStatusType("error");
    }
  };

  const handleViewDetails = async (uploadId) => {
    setShowUploadDetails(uploadId);
    setLoadingDetails(true);
    try {
      const data = await gradesApi.getUploadDetails(uploadId);
      if (data.success) {
        setUploadDetails(data);
      } else {
        setUploadStatus(data.message || "Failed to load details");
        setUploadStatusType("error");
        setShowUploadDetails(null);
      }
    } catch (err) {
      console.error("Error loading details:", err);
      setUploadStatus("Error loading upload details");
      setUploadStatusType("error");
      setShowUploadDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const downloadTemplate = (type) => {
    let template = "";
    
    if (type === "cat") {
      template = `RegNo,Subject,MarksObtained,TotalMarks
CSE-001,Mathematics,18,25
CSE-002,Physics,22,25
CSE-001,Physics,20,25`;
    } else if (type === "semester") {
      template = `RegNo,Semester,GPA
CSE-001,3,8.5
CSE-002,3,9.2
CSE-003,3,7.8`;
    } else {
      template = `RegNo,Subject,Marks
CSE-001,Mathematics,85
CSE-002,Physics,90
CSE-001,Physics,88`;
    }

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(template));
    element.setAttribute("download", `grades_template_${type}.csv`);
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
              {/* File Input and Template Downloads */}
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex flex-col gap-4 mb-4">
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
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">📥 Download Templates</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => downloadTemplate("cat")}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        CAT Template
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadTemplate("semester")}
                        className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Semester GPA
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadTemplate("regular")}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Regular Template
                      </button>
                    </div>
                  </div>
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
                    <option value="Internal">Internal</option>
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
                      <th className="p-3">Grades</th>
                      <th className="p-3">Uploaded At</th>
                      <th className="p-3">Actions</th>
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
                        <td className="p-3">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {h.gradeCount || 0}
                          </span>
                        </td>
                        <td className="p-3 text-gray-400">
                          {h.uploadedAt
                            ? new Date(h.uploadedAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(h.uploadId)}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(h.uploadId)}
                              className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                              title="Delete Upload"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 p-3 rounded border border-blue-500/30">
                  <h5 className="font-semibold text-blue-400 mb-2">CAT/Internal/Mid Format</h5>
                  <ul className="space-y-1 text-xs text-gray-300">
                    <li>• RegNo, Subject, MarksObtained, TotalMarks</li>
                    <li>• Use for CAT-1, CAT-2, CAT-3, Internal, Mid-Semester</li>
                    <li>• Example: CSE-001, Math, 18, 25</li>
                  </ul>
                </div>
                <div className="bg-green-500/10 p-3 rounded border border-green-500/30">
                  <h5 className="font-semibold text-green-400 mb-2">Semester GPA</h5>
                  <ul className="space-y-1 text-xs text-gray-300">
                    <li>• RegNo, Semester, GPA</li>
                    <li>• Use for semester results</li>
                    <li>• Example: CSE-001, 3, 8.5</li>
                  </ul>
                </div>
                <div className="bg-purple-500/10 p-3 rounded border border-purple-500/30">
                  <h5 className="font-semibold text-purple-400 mb-2">Regular Format</h5>
                  <ul className="space-y-1 text-xs text-gray-300">
                    <li>• RegNo, Subject, Marks</li>
                    <li>• Use for End-Semester, Arrear</li>
                    <li>• Example: CSE-001, Physics, 85</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 border border-red-500/30">
            <h3 className="text-xl font-bold mb-4 text-red-400">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this upload? This will remove all grades associated with this upload. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUpload(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Details Modal */}
      {showUploadDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-purple-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-purple-400">Upload Details</h3>
              <button
                onClick={() => {
                  setShowUploadDetails(null);
                  setUploadDetails(null);
                }}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetails ? (
              <p className="text-center text-gray-400 py-8">Loading details...</p>
            ) : uploadDetails ? (
              <>
                <div className="bg-white/5 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">File Name</p>
                      <p className="font-medium">{uploadDetails.uploadInfo.fileName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Date</p>
                      <p className="font-medium">{uploadDetails.uploadInfo.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Semester</p>
                      <p className="font-medium">Sem {uploadDetails.uploadInfo.semester}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Department</p>
                      <p className="font-medium">{uploadDetails.uploadInfo.department}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Test Type</p>
                      <p className="font-medium">{uploadDetails.uploadInfo.testType}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Grades</p>
                      <p className="font-medium">{uploadDetails.totalGrades}</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-purple-600/40 text-left">
                        <th className="p-3">Reg No</th>
                        <th className="p-3">Subject</th>
                        {uploadDetails.uploadInfo.gradeType === "cat_with_total" ? (
                          <>
                            <th className="p-3">Marks Obtained</th>
                            <th className="p-3">Total Marks</th>
                          </>
                        ) : uploadDetails.uploadInfo.gradeType === "semester_gpa" ? (
                          <th className="p-3">GPA</th>
                        ) : (
                          <th className="p-3">Marks</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {uploadDetails.grades.map((grade, i) => (
                        <tr key={i} className="hover:bg-white/5 border-b border-white/10">
                          <td className="p-3 font-medium">{grade.regNumber}</td>
                          <td className="p-3">{grade.subject}</td>
                          {uploadDetails.uploadInfo.gradeType === "cat_with_total" ? (
                            <>
                              <td className="p-3">
                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                  {grade.marks}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                  {grade.totalMarks}
                                </span>
                              </td>
                            </>
                          ) : uploadDetails.uploadInfo.gradeType === "semester_gpa" ? (
                            <td className="p-3">
                              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                                {grade.gpa}
                              </span>
                            </td>
                          ) : (
                            <td className="p-3">
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                {grade.marks}
                              </span>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="text-center text-red-400 py-8">Failed to load details</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherGradeUpload;