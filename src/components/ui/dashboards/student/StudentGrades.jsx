import React, { useEffect, useState } from "react";
import { gradesApi } from "../../../../api/api";
import "../../../css/dashboards/student/StudentDashboard.css";

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ 
    semester: "", 
    department: "", 
    testType: "" 
  });

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

  const filtered = grades.filter((g) => {
    if (filters.semester && String(g.semester) !== String(filters.semester)) 
      return false;
    if (filters.department && g.department !== filters.department) 
      return false;
    if (filters.testType && g.testType !== filters.testType) 
      return false;
    return true;
  });

  if (loading) return <p className="text-center py-8">Loading your grades...</p>;
  if (error) return <p className="text-red-400 text-center py-8">{error}</p>;

  return (
    <div className="student-dashboard-wrapper">
      <div className="student-dashboard-main">
        <div className="student-dashboard-content">
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="card-title">📊 My Grades</h2>

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
                      <th className="p-3">Marks</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Test Type</th>
                      <th className="p-3">Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((g, i) => (
                      <tr 
                        key={i} 
                        className="hover:bg-white/5 border-b border-white/10 transition-colors"
                      >
                        <td className="p-3 font-medium">{g.subject}</td>
                        <td className="p-3">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            {g.marks}
                          </span>
                        </td>
                        <td className="p-3">{g.date || "-"}</td>
                        <td className="p-3">Sem {g.semester || "-"}</td>
                        <td className="p-3">{g.department || "-"}</td>
                        <td className="p-3">{g.testType || "-"}</td>
                        <td className="p-3 text-gray-300">{g.teacherName || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary Stats */}
            {filtered.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Total Grades</p>
                  <p className="text-2xl font-bold text-white">{filtered.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Average</p>
                  <p className="text-2xl font-bold text-green-400">
                    {(filtered.reduce((sum, g) => {
                      const marks = typeof g.marks === 'number' ? g.marks : parseFloat(g.marks) || 0;
                      return sum + marks;
                    }, 0) / filtered.length).toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Highest</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {Math.max(...filtered.map(g => typeof g.marks === 'number' ? g.marks : parseFloat(g.marks) || 0))}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Lowest</p>
                  <p className="text-2xl font-bold text-red-400">
                    {Math.min(...filtered.map(g => typeof g.marks === 'number' ? g.marks : parseFloat(g.marks) || 0))}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;