import React, { useEffect, useState } from "react";
import { gradesApi } from "../../../../api/api";
import "../../../css/dashboards/student/StudentDashboard.css";
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
const StudentGrades = () => {
  const [userName, setUserName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
      const storedName = localStorage.getItem("name");
      if (storedName) {
        setUserName(storedName);
      } else {
        setUserName("Student");
      }
    }, []);
  // Toggle sidebar for mobile/tablet
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking overlay
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Mobile Menu Toggle Button
  const MobileMenuToggle = () => (
    <button 
      className="mobile-menu-toggle"
      onClick={toggleSidebar}
      aria-label="Toggle menu"
    >
      {isSidebarOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
    </button>
  );
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ 
    semester: "", 
    department: "", 
    testType: "" 
  });
  const [viewMode, setViewMode] = useState("all"); // "all", "cat", "semester", "regular"

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await gradesApi.fetchMyGrades();
        if (data.success) {
          setGrades(data.grades || []);
        } else {
          setError(data.message || "Failed to load grades.");
        }
      } catch (err) {
        console.error("Fetch grades error:", err);
        setError("Server error while loading grades.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  // Categorize grades - CAT format includes Mid-Semester and Internal
  const catGrades = grades.filter(g => {
    const hasTotal = g.totalMarks !== undefined && g.totalMarks !== null;
    const testType = g.testType || "";
    return hasTotal || testType.includes("CAT") || testType.includes("Mid-Semester") || testType.includes("Internal");
  });
  
  const semesterGrades = grades.filter(g => g.gpa !== undefined && g.gpa !== null);
  const regularGrades = grades.filter(g => {
    const hasTotal = g.totalMarks !== undefined && g.totalMarks !== null;
    const hasGpa = g.gpa !== undefined && g.gpa !== null;
    const testType = g.testType || "";
    const isCatType = testType.includes("CAT") || testType.includes("Mid-Semester") || testType.includes("Internal");
    return !hasTotal && !hasGpa && !isCatType;
  });

  const filtered = grades.filter((g) => {
    if (filters.semester && String(g.semester) !== String(filters.semester)) 
      return false;
    if (filters.department && g.department !== filters.department) 
      return false;
    if (filters.testType && g.testType !== filters.testType) 
      return false;
    
    // View mode filtering
    if (viewMode === "cat") {
      const testType = g.testType || "";
      const hasTotal = g.totalMarks !== undefined && g.totalMarks !== null;
      const isCatType = testType.includes("CAT") || testType.includes("Mid-Semester") || testType.includes("Internal");
      if (!hasTotal && !isCatType) return false;
    }
    if (viewMode === "semester" && (g.gpa === undefined || g.gpa === null))
      return false;
    if (viewMode === "regular") {
      const testType = g.testType || "";
      const hasTotal = g.totalMarks !== undefined && g.totalMarks !== null;
      const hasGpa = g.gpa !== undefined && g.gpa !== null;
      const isCatType = testType.includes("CAT") || testType.includes("Mid-Semester") || testType.includes("Internal");
      if (hasTotal || hasGpa || isCatType) return false;
    }
    
    return true;
  });

  if (loading) return <p className="text-center py-8">Loading your grades...</p>;
  if (error) return <p className="text-red-400 text-center py-8">{error}</p>;

  return (
    
    <div className="student-dashboard-wrapper">
     
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle />
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <div className="student-dashboard-main">
        <div className="student-dashboard-content">
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="card-title">📊 My Grades</h2>

            {/* View Mode Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                All Grades ({grades.length})
              </button>
              <button
                onClick={() => setViewMode("cat")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "cat"
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                CAT/Internal/Mid ({catGrades.length})
              </button>
              <button
                onClick={() => setViewMode("semester")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "semester"
                    ? "bg-green-600 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                Semester GPA ({semesterGrades.length})
              </button>
              <button
                onClick={() => setViewMode("regular")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "regular"
                    ? "bg-orange-600 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                Other Exams ({regularGrades.length})
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white/5 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">🔍 Filter Grades</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Semester</label>
                  <select
                    value={filters.semester}
                    onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                    className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                  >
                    <option value="">All Semesters</option>
                    {[...Array(8)].map((_, i) => (
                      <option key={i} value={String(i + 1)}>
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                  >
                    <option value="">All Departments</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="IT">Information Technology</option>
                    <option value="AI&DS">AI & Data Science</option>
                    <option value="MECH">Mechanical</option>
                    <option value="EEE">Electrical & Electronics</option>
                    <option value="CIVIL">Civil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Test Type</label>
                  <select
                    value={filters.testType}
                    onChange={(e) => setFilters({ ...filters, testType: e.target.value })}
                    className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                  >
                    <option value="">All Tests</option>
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
            </div>

            {/* Grades Table */}
            {filtered.length === 0 ? (
              <p className="text-gray-400 text-center py-12">
                {grades.length === 0 
                  ? "No grades uploaded yet. Check back soon!" 
                  : "No grades match your filters."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-purple-600/40 text-left">
                      <th className="p-3">Subject</th>
                      <th className="p-3">Marks Obtained</th>
                      <th className="p-3">Total Marks</th>
                      <th className="p-3">Percentage</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Test Type</th>
                      <th className="p-3">Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((g, i) => {
                      const testType = g.testType || "";
                      const isCatType = testType.includes("CAT") || testType.includes("Mid-Semester") || testType.includes("Internal");
                      const hasTotal = g.totalMarks !== undefined && g.totalMarks !== null;
                      const isSemester = g.gpa !== undefined && g.gpa !== null;
                      
                      const marksObtained = hasTotal ? g.marks : (isSemester ? g.gpa : g.marks);
                      const totalMarks = hasTotal ? g.totalMarks : (isSemester ? "10.0" : null);
                      const percentage = hasTotal && g.totalMarks > 0 
                        ? ((g.marks / g.totalMarks) * 100).toFixed(1)
                        : isSemester && g.gpa
                        ? ((g.gpa / 10) * 100).toFixed(1)
                        : null;

                      return (
                        <tr 
                          key={i} 
                          className="hover:bg-white/5 border-b border-white/10 transition-colors"
                        >
                          <td className="p-3 font-medium">{g.subject || "-"}</td>
                          
                          {/* Marks Obtained Column */}
                          <td className="p-3">
                            {marksObtained !== undefined && marksObtained !== null ? (
                              <span className={`px-2 py-1 rounded ${
                                isSemester
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}>
                                {isSemester ? `${marksObtained} GPA` : marksObtained}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          
                          {/* Total Marks Column */}
                          <td className="p-3">
                            {totalMarks !== null ? (
                              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                {totalMarks}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          
                          {/* Percentage Column */}
                          <td className="p-3">
                            {percentage !== null ? (
                              <span className={`px-2 py-1 rounded ${
                                parseFloat(percentage) >= 80 
                                  ? "bg-green-500/20 text-green-400"
                                  : parseFloat(percentage) >= 60
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}>
                                {percentage}%
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          
                          <td className="p-3">{g.date || "-"}</td>
                          <td className="p-3">Sem {g.semester || "-"}</td>
                          <td className="p-3">{g.department || "-"}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              isCatType || hasTotal
                                ? "bg-blue-500/20 text-blue-400"
                                : isSemester
                                ? "bg-green-500/20 text-green-400"
                                : "bg-purple-500/20 text-purple-400"
                            }`}>
                              {g.testType || "-"}
                            </span>
                          </td>
                          <td className="p-3 text-gray-300">{g.teacherName || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary Stats */}
            {filtered.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                {viewMode === "cat" || (viewMode === "all" && catGrades.filter(g => 
                  (!filters.semester || String(g.semester) === String(filters.semester)) &&
                  (!filters.department || g.department === filters.department) &&
                  (!filters.testType || g.testType === filters.testType)
                ).length > 0) ? (
                  // CAT Statistics
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-blue-400">📊 CAT/Internal/Mid-Sem Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center bg-blue-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Total Exams</p>
                        <p className="text-2xl font-bold text-white">
                          {filtered.filter(g => {
                            const testType = g.testType || "";
                            return g.totalMarks !== undefined || testType.includes("CAT") || testType.includes("Mid-Semester") || testType.includes("Internal");
                          }).length}
                        </p>
                      </div>
                      <div className="text-center bg-green-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Average Percentage</p>
                        <p className="text-2xl font-bold text-green-400">
                          {(() => {
                            const catFiltered = filtered.filter(g => {
                              const testType = g.testType || "";
                              return (g.totalMarks !== undefined && g.totalMarks > 0) || testType.includes("CAT") || testType.includes("Mid-Semester") || testType.includes("Internal");
                            }).filter(g => g.totalMarks && g.totalMarks > 0);
                            if (catFiltered.length === 0) return "N/A";
                            const avgPercentage = catFiltered.reduce((sum, g) => 
                              sum + (g.marks / g.totalMarks * 100), 0) / catFiltered.length;
                            return avgPercentage.toFixed(1) + "%";
                          })()}
                        </p>
                      </div>
                      <div className="text-center bg-purple-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Highest Score</p>
                        <p className="text-2xl font-bold text-purple-400">
                          {(() => {
                            const catFiltered = filtered.filter(g => {
                              const testType = g.testType || "";
                              return (g.totalMarks !== undefined && g.totalMarks > 0) || testType.includes("CAT") || testType.includes("Mid-Semester") || testType.includes("Internal");
                            }).filter(g => g.totalMarks && g.totalMarks > 0);
                            if (catFiltered.length === 0) return "N/A";
                            const highest = Math.max(...catFiltered.map(g => (g.marks / g.totalMarks * 100)));
                            return highest.toFixed(1) + "%";
                          })()}
                        </p>
                      </div>
                      <div className="text-center bg-yellow-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Lowest Score</p>
                        <p className="text-2xl font-bold text-yellow-400">
                          {(() => {
                            const catFiltered = filtered.filter(g => {
                              const testType = g.testType || "";
                              return (g.totalMarks !== undefined && g.totalMarks > 0) || testType.includes("CAT") || testType.includes("Mid-Semester") || testType.includes("Internal");
                            }).filter(g => g.totalMarks && g.totalMarks > 0);
                            if (catFiltered.length === 0) return "N/A";
                            const lowest = Math.min(...catFiltered.map(g => (g.marks / g.totalMarks * 100)));
                            return lowest.toFixed(1) + "%";
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : viewMode === "semester" || (viewMode === "all" && semesterGrades.filter(g => 
                  (!filters.semester || String(g.semester) === String(filters.semester)) &&
                  (!filters.department || g.department === filters.department) &&
                  (!filters.testType || g.testType === filters.testType)
                ).length > 0) ? (
                  // Semester GPA Statistics
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-green-400">📈 Semester GPA Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center bg-green-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Total Semesters</p>
                        <p className="text-2xl font-bold text-white">
                          {filtered.filter(g => g.gpa !== undefined).length}
                        </p>
                      </div>
                      <div className="text-center bg-blue-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Average GPA</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {(() => {
                            const semFiltered = filtered.filter(g => g.gpa !== undefined);
                            if (semFiltered.length === 0) return "N/A";
                            const avgGpa = semFiltered.reduce((sum, g) => sum + g.gpa, 0) / semFiltered.length;
                            return avgGpa.toFixed(2);
                          })()}
                        </p>
                      </div>
                      <div className="text-center bg-purple-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Highest GPA</p>
                        <p className="text-2xl font-bold text-purple-400">
                          {(() => {
                            const semFiltered = filtered.filter(g => g.gpa !== undefined);
                            if (semFiltered.length === 0) return "N/A";
                            return Math.max(...semFiltered.map(g => g.gpa)).toFixed(2);
                          })()}
                        </p>
                      </div>
                      <div className="text-center bg-yellow-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Lowest GPA</p>
                        <p className="text-2xl font-bold text-yellow-400">
                          {(() => {
                            const semFiltered = filtered.filter(g => g.gpa !== undefined);
                            if (semFiltered.length === 0) return "N/A";
                            return Math.min(...semFiltered.map(g => g.gpa)).toFixed(2);
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular Statistics
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-purple-400">📝 Regular Exam Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center bg-purple-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Total Grades</p>
                        <p className="text-2xl font-bold text-white">{filtered.length}</p>
                      </div>
                      <div className="text-center bg-green-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Average</p>
                        <p className="text-2xl font-bold text-green-400">
                          {(filtered.reduce((sum, g) => {
                            const marks = typeof g.marks === 'number' ? g.marks : parseFloat(g.marks) || 0;
                            return sum + marks;
                          }, 0) / filtered.length).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center bg-blue-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Highest</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {Math.max(...filtered.map(g => typeof g.marks === 'number' ? g.marks : parseFloat(g.marks) || 0))}
                        </p>
                      </div>
                      <div className="text-center bg-red-500/10 p-3 rounded">
                        <p className="text-gray-400 text-xs">Lowest</p>
                        <p className="text-2xl font-bold text-red-400">
                          {Math.min(...filtered.map(g => typeof g.marks === 'number' ? g.marks : parseFloat(g.marks) || 0))}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Grade Legend */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-semibold mb-3">📌 Grade Type Legend</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 bg-blue-500/10 p-2 rounded">
                  <span className="bg-blue-500/30 text-blue-400 px-2 py-1 rounded font-medium">CAT/MID/INT</span>
                  <span className="text-gray-300">CAT, Mid-Semester, Internal with Total Marks</span>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 p-2 rounded">
                  <span className="bg-green-500/30 text-green-400 px-2 py-1 rounded font-medium">SEM</span>
                  <span className="text-gray-300">Semester GPA (Grade Point Average)</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-500/10 p-2 rounded">
                  <span className="bg-purple-500/30 text-purple-400 px-2 py-1 rounded font-medium">REG</span>
                  <span className="text-gray-300">Regular Exams (End Semester, Arrear)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;