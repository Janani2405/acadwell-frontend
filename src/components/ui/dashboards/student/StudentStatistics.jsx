import React, { useEffect, useState } from "react";
import { gradesApi } from "../../../../api/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Cell,
  PieChart,
  Pie
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  BookOpen,
  Sparkles,
  Trophy,
  Star,
  Zap,
  CheckCircle2,
  AlertCircle,
  Brain,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Calendar,
  BarChart3,
  X, Menu 
} from "lucide-react";
import "../../../css/dashboards/student/StudentDashboard.css";
import Sidebar from './Sidebar';
const StudentStatistics = () => {


   const [userName, setUserName] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  if (loading) {
    return (

      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400 text-center py-8">{error}</p>;
  }

  if (grades.length === 0) {
    return (
      <div className="student-dashboard-wrapper">
        
        <div className="student-dashboard-main">
          <div className="student-dashboard-content">
            <div className="dashboard-card text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">No Data Yet</h3>
              <p className="text-gray-400">
                Your statistics will appear here once grades are uploaded.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== DATA PROCESSING ====================
  
  // Categorize grades by type
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

  // Calculate key metrics
  const totalGrades = grades.length;
  
  const catWithTotal = catGrades.filter(g => g.totalMarks && g.totalMarks > 0);
  const avgCatPercentage = catWithTotal.length > 0
    ? catWithTotal.reduce((sum, g) => sum + (g.marks / g.totalMarks * 100), 0) / catWithTotal.length
    : 0;

  const avgGpa = semesterGrades.length > 0
    ? semesterGrades.reduce((sum, g) => sum + g.gpa, 0) / semesterGrades.length
    : 0;

  const allNumericGrades = regularGrades.filter(g => g.marks !== undefined);
  const avgRegular = allNumericGrades.length > 0
    ? allNumericGrades.reduce((sum, g) => sum + parseFloat(g.marks), 0) / allNumericGrades.length
    : 0;

  const overallPerformance = avgGpa > 0 ? avgGpa * 10 : avgCatPercentage > 0 ? avgCatPercentage : avgRegular;

  // ==================== SEMESTER PROGRESS ====================
  const semesterData = {};
  grades.forEach(g => {
    const sem = g.semester || "Unknown";
    if (!semesterData[sem]) {
      semesterData[sem] = { 
        semester: `Sem ${sem}`, 
        total: 0, 
        count: 0,
        scores: []
      };
    }
    
    let score = 0;
    if (g.gpa !== undefined) {
      score = g.gpa * 10;
    } else if (g.totalMarks && g.totalMarks > 0) {
      score = (g.marks / g.totalMarks) * 100;
    } else if (g.marks) {
      score = parseFloat(g.marks);
    }
    
    if (score > 0) {
      semesterData[sem].total += score;
      semesterData[sem].count += 1;
      semesterData[sem].scores.push(score);
    }
  });

  const semesterPerformance = Object.values(semesterData)
    .map(s => ({
      semester: s.semester,
      average: s.count > 0 ? parseFloat((s.total / s.count).toFixed(1)) : 0,
      highest: s.scores.length > 0 ? Math.max(...s.scores).toFixed(1) : 0,
      lowest: s.scores.length > 0 ? Math.min(...s.scores).toFixed(1) : 0,
      count: s.count
    }))
    .sort((a, b) => {
      const semA = parseInt(a.semester.replace('Sem ', ''));
      const semB = parseInt(b.semester.replace('Sem ', ''));
      return semA - semB;
    });

  // ==================== SUBJECT ANALYSIS ====================
  const subjectData = {};
  grades.forEach(g => {
    const subject = g.subject || "Unknown";
    if (subject.includes("Semester") && subject.includes("GPA")) return; // Skip GPA entries
    
    if (!subjectData[subject]) {
      subjectData[subject] = { subject, scores: [] };
    }
    
    let score = 0;
    if (g.gpa !== undefined) {
      score = g.gpa * 10;
    } else if (g.totalMarks && g.totalMarks > 0) {
      score = (g.marks / g.totalMarks) * 100;
    } else if (g.marks) {
      score = parseFloat(g.marks);
    }
    
    if (score > 0) {
      subjectData[subject].scores.push(score);
    }
  });

  const subjectPerformance = Object.values(subjectData)
    .map(s => ({
      subject: s.subject,
      displaySubject: s.subject.length > 20 ? s.subject.substring(0, 20) + '...' : s.subject,
      average: s.scores.length > 0 ? parseFloat((s.scores.reduce((a, b) => a + b, 0) / s.scores.length).toFixed(1)) : 0,
      assessments: s.scores.length,
      highest: s.scores.length > 0 ? Math.max(...s.scores).toFixed(1) : 0,
      lowest: s.scores.length > 0 ? Math.min(...s.scores).toFixed(1) : 0
    }))
    .filter(s => s.average > 0)
    .sort((a, b) => b.average - a.average);

  // Top performer - THE BEST SUBJECT
  const topPerformer = subjectPerformance.length > 0 ? subjectPerformance[0] : null;

  // Top strengths (subjects above 75% but not #1)
  const topStrengths = subjectPerformance.filter(s => s.average >= 75).slice(1, 5);

  // Subjects needing attention (between 60-75%, excluding top performers)
  const needsAttention = subjectPerformance.filter(s => s.average >= 60 && s.average < 75);

  // Critical subjects (below 60%)
  const criticalSubjects = subjectPerformance.filter(s => s.average < 60);

  // ==================== PERFORMANCE DISTRIBUTION ====================
  const performanceRanges = [
    { range: "90-100%", label: "Excellent", min: 90, max: 100, count: 0, color: "#10b981" },
    { range: "80-89%", label: "Very Good", min: 80, max: 89, count: 0, color: "#3b82f6" },
    { range: "70-79%", label: "Good", min: 70, max: 79, count: 0, color: "#8b5cf6" },
    { range: "60-69%", label: "Satisfactory", min: 60, max: 69, count: 0, color: "#f59e0b" },
    { range: "Below 60%", label: "Needs Work", min: 0, max: 59, count: 0, color: "#ef4444" }
  ];

  grades.forEach(g => {
    let score = 0;
    if (g.gpa !== undefined) {
      score = g.gpa * 10;
    } else if (g.totalMarks && g.totalMarks > 0) {
      score = (g.marks / g.totalMarks) * 100;
    } else if (g.marks) {
      score = parseFloat(g.marks);
    }
    
    if (score > 0) {
      performanceRanges.forEach(range => {
        if (score >= range.min && score <= range.max) {
          range.count++;
        }
      });
    }
  });

  const distributionData = performanceRanges.filter(r => r.count > 0);

  // ==================== TEST TYPE COMPARISON ====================
  const testTypeData = {};
  grades.forEach(g => {
    const testType = g.testType || "Other";
    if (!testTypeData[testType]) {
      testTypeData[testType] = { testType, scores: [] };
    }
    
    let score = 0;
    if (g.gpa !== undefined) {
      score = g.gpa * 10;
    } else if (g.totalMarks && g.totalMarks > 0) {
      score = (g.marks / g.totalMarks) * 100;
    } else if (g.marks) {
      score = parseFloat(g.marks);
    }
    
    if (score > 0) {
      testTypeData[testType].scores.push(score);
    }
  });

  const testTypeComparison = Object.values(testTypeData)
    .map(t => ({
      testType: t.testType,
      average: t.scores.length > 0 ? parseFloat((t.scores.reduce((a, b) => a + b, 0) / t.scores.length).toFixed(1)) : 0,
      count: t.scores.length,
      highest: t.scores.length > 0 ? Math.max(...t.scores).toFixed(1) : 0
    }))
    .sort((a, b) => b.average - a.average);

  // ==================== PERFORMANCE INSIGHTS (NOT TREND) ====================
  const recentGrades = [...grades]
    .sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt))
    .slice(-Math.min(15, grades.length));

  const recentData = recentGrades.map((g, index) => {
    let score = 0;
    if (g.gpa !== undefined) {
      score = g.gpa * 10;
    } else if (g.totalMarks && g.totalMarks > 0) {
      score = (g.marks / g.totalMarks) * 100;
    } else if (g.marks) {
      score = parseFloat(g.marks);
    }
    
    return {
      index: index + 1,
      score: parseFloat(score.toFixed(1)),
      subject: g.subject,
      testType: g.testType
    };
  });

  const firstHalf = recentData.slice(0, Math.ceil(recentData.length / 2));
  const secondHalf = recentData.slice(Math.ceil(recentData.length / 2));
  const firstAvg = firstHalf.reduce((sum, d) => sum + d.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.score, 0) / secondHalf.length;
  const isImproving = secondAvg > firstAvg;
  const changePercent = Math.abs(((secondAvg - firstAvg) / firstAvg) * 100).toFixed(1);

  // Calculate consistency
  const allScores = recentData.map(d => d.score);
  const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  const variance = allScores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / allScores.length;
  const stdDev = Math.sqrt(variance);
  const isConsistent = stdDev < 10; // If std deviation < 10, considered consistent

  // ==================== ENCOURAGING MESSAGE ====================
  const getEncouragingMessage = (score) => {
    if (score >= 90) {
      return {
        icon: <Trophy className="w-8 h-8 text-yellow-400" />,
        title: "Outstanding Performance! 🏆",
        message: "You're in the top tier! Your dedication and hard work are truly exceptional.",
        color: "from-yellow-500 to-orange-500"
      };
    } else if (score >= 80) {
      return {
        icon: <Award className="w-8 h-8 text-purple-400" />,
        title: "Excellent Work! 🌟",
        message: "You're doing fantastic! You're very close to excellence - keep pushing!",
        color: "from-purple-500 to-pink-500"
      };
    } else if (score >= 70) {
      return {
        icon: <Star className="w-8 h-8 text-blue-400" />,
        title: "Good Progress! ⭐",
        message: "You're on the right path! Focus on consistency to reach the next level.",
        color: "from-blue-500 to-cyan-500"
      };
    } else if (score >= 60) {
      return {
        icon: <Target className="w-8 h-8 text-green-400" />,
        title: "Building Momentum! 🎯",
        message: "You're making progress! Dedicate more time to weak areas for better results.",
        color: "from-green-500 to-teal-500"
      };
    } else {
      return {
        icon: <Zap className="w-8 h-8 text-orange-400" />,
        title: "Time for Focused Action! ⚡",
        message: "Let's turn this around! With the right strategy and support, improvement is within reach.",
        color: "from-orange-500 to-red-500"
      };
    }
  };

  const encouragement = getEncouragingMessage(overallPerformance);

  // ==================== CUSTOM TOOLTIP ====================
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-purple-500/50 shadow-xl">
          <p className="text-white font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.name.includes('Average') || entry.name.includes('Score') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="student-dashboard-wrapper">
      
      <div className="student-dashboard-main">
        <div className="student-dashboard-content">
            {/* Mobile Menu Toggle */}
      <MobileMenuToggle />
      
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
          {/* Encouraging Message Banner */}
          <div className={`dashboard-card bg-gradient-to-r ${encouragement.color} p-6 mb-6`} style={{ gridColumn: "1 / -1" }}>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                {encouragement.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{encouragement.title}</h2>
                <p className="text-white/90 text-lg">{encouragement.message}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm mb-1">Overall Score</p>
                <p className="text-5xl font-bold text-white">{overallPerformance.toFixed(1)}<span className="text-2xl">%</span></p>
                <div className="flex items-center justify-end gap-1 mt-2">
                  {isImproving ? (
                    <>
                      <ArrowUp className="w-5 h-5 text-white" />
                      <span className="text-white text-sm font-semibold">Improving</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-5 h-5 text-white" />
                      <span className="text-white text-sm font-semibold">Focus Needed</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="dashboard-card bg-gradient-to-br from-purple-600 to-purple-800">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-purple-200 text-sm">Total Assessments</p>
                <p className="text-3xl font-bold text-white">{totalGrades}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card bg-gradient-to-br from-blue-600 to-blue-800">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">CAT/Internal Avg</p>
                <p className="text-3xl font-bold text-white">
                  {avgCatPercentage > 0 ? `${avgCatPercentage.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-card bg-gradient-to-br from-green-600 to-green-800">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-green-200 text-sm">Semester GPA</p>
                <p className="text-3xl font-bold text-white">
                  {avgGpa > 0 ? avgGpa.toFixed(2) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className={`dashboard-card bg-gradient-to-br ${isImproving ? 'from-emerald-600 to-emerald-800' : 'from-orange-600 to-orange-800'}`}>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Performance</p>
                <p className="text-2xl font-bold text-white">
                  {isConsistent ? 'Consistent' : 'Variable'}
                </p>
              </div>
            </div>
          </div>

          {/* Semester Progress */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <div className="mb-4">
              <h3 className="card-title flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Semester-wise Performance Journey
              </h3>
              <p className="text-sm text-gray-400">Track your academic progress across semesters</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={semesterPerformance}>
                <defs>
                  <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="semester" 
                  stroke="#9ca3af"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  domain={[0, 100]}
                  label={{ value: 'Performance (%)', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="highest"
                  stroke="none"
                  fill="url(#colorRange)"
                  fillOpacity={1}
                  name="Score Range"
                />
                <Area
                  type="monotone"
                  dataKey="lowest"
                  stroke="none"
                  fill="#ffffff"
                  fillOpacity={0}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  dot={{ fill: '#8b5cf6', r: 6 }}
                  activeDot={{ r: 8, fill: '#a78bfa' }}
                  name="Average Score"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Top Performer - Highlight THE BEST */}
          {topPerformer && (
            <div className="dashboard-card bg-gradient-to-br from-yellow-600 to-orange-600" style={{ gridColumn: "1 / -1" }}>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white/80 mb-1">🏆 YOUR TOP PERFORMING SUBJECT</h3>
                  <h2 className="text-3xl font-bold text-white mb-2">{topPerformer.subject}</h2>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <p className="text-white/80 text-xs">Average Score</p>
                      <p className="text-2xl font-bold text-white">{topPerformer.average}%</p>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <p className="text-white/80 text-xs">Best Score</p>
                      <p className="text-2xl font-bold text-white">{topPerformer.highest}%</p>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <p className="text-white/80 text-xs">Assessments</p>
                      <p className="text-2xl font-bold text-white">{topPerformer.assessments}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 px-6 py-4 rounded-lg backdrop-blur-sm">
                    <p className="text-white/80 text-sm mb-1">Keep It Up!</p>
                    <p className="text-white text-sm font-semibold">You're excelling here! 🌟</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Strengths */}
          {topStrengths.length > 0 && (
            <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
              <div className="mb-4">
                <h3 className="card-title flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Your Other Strengths ({topStrengths.length} subjects performing well)
                </h3>
                <p className="text-sm text-gray-400">Subjects where you're scoring above 75%</p>
              </div>
              <ResponsiveContainer width="100%" height={Math.max(200, topStrengths.length * 60)}>
                <BarChart data={topStrengths} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                  <XAxis type="number" stroke="#9ca3af" domain={[0, 100]} />
                  <YAxis 
                    type="category" 
                    dataKey="displaySubject" 
                    stroke="#9ca3af" 
                    width={120}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="average" fill="#10b981" radius={[0, 8, 8, 0]} name="Average Score">
                    {topStrengths.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`rgba(16, 185, 129, ${0.9 - index * 0.15})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-green-400 font-semibold text-sm mb-2">💡 Strategy to Maintain Excellence:</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {topStrengths.slice(0, 4).map((subject, i) => (
                        <div key={i} className="bg-white/5 p-2 rounded">
                          <p className="text-sm text-green-300">
                            <strong>{subject.subject}:</strong> {subject.average >= 85 ? 'Outstanding!' : 'Excellent!'} Keep momentum with weekly 20-min reviews
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subjects Needing Attention (60-75%) */}
          {needsAttention.length > 0 && (
            <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
              <div className="mb-4">
                <h3 className="card-title flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Subjects Needing More Focus ({needsAttention.length} subjects in 60-75% range)
                </h3>
                <p className="text-sm text-gray-400">You're doing okay here, but there's room for improvement</p>
              </div>
              <ResponsiveContainer width="100%" height={Math.max(200, needsAttention.length * 60)}>
                <BarChart data={needsAttention} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                  <XAxis type="number" stroke="#9ca3af" domain={[0, 100]} />
                  <YAxis 
                    type="category" 
                    dataKey="displaySubject" 
                    stroke="#9ca3af" 
                    width={120}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="average" fill="#eab308" radius={[0, 8, 8, 0]} name="Average Score">
                    {needsAttention.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`rgba(234, 179, 8, ${0.9 - index * 0.1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-yellow-400 font-semibold text-sm mb-2">🎯 Improvement Strategy:</h4>
                    <div className="space-y-2">
                      {needsAttention.slice(0, 3).map((subject, i) => (
                        <div key={i} className="bg-white/5 p-3 rounded">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-yellow-300 font-semibold">{subject.subject}</p>
                              <p className="text-xs text-yellow-200">Current: {subject.average.toFixed(1)}% → Target: {Math.min(85, subject.average + 15).toFixed(0)}%</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-300">
                            → Add 30 minutes daily practice • Review weak topics • Practice more problems • Ask doubts in class
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Critical Subjects (Below 60%) */}
          {criticalSubjects.length > 0 && (
            <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
              <div className="mb-4">
                <h3 className="card-title flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  Critical - Immediate Action Required ({criticalSubjects.length} subjects below 60%)
                </h3>
                <p className="text-sm text-gray-400">These subjects need urgent attention and support</p>
              </div>
              <ResponsiveContainer width="100%" height={Math.max(200, criticalSubjects.length * 60)}>
                <BarChart data={criticalSubjects} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                  <XAxis type="number" stroke="#9ca3af" domain={[0, 100]} />
                  <YAxis 
                    type="category" 
                    dataKey="displaySubject" 
                    stroke="#9ca3af" 
                    width={120}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="average" fill="#ef4444" radius={[0, 8, 8, 0]} name="Average Score">
                    {criticalSubjects.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`rgba(239, 68, 68, ${0.9 - index * 0.1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 bg-red-500/10 p-4 rounded-lg border-2 border-red-500/50">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-red-400 font-semibold text-sm mb-2">⚠️ URGENT Action Plan:</h4>
                    <div className="space-y-3">
                      {criticalSubjects.map((subject, i) => (
                        <div key={i} className="bg-red-500/10 p-3 rounded border border-red-500/30">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-red-300 font-bold">{i + 1}. {subject.subject}</p>
                              <p className="text-xs text-red-200">Current: {subject.average.toFixed(1)}% → First Target: 65%</p>
                            </div>
                            <span className="bg-red-500/30 px-2 py-1 rounded text-xs text-white font-bold">
                              CRITICAL
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-red-200 mt-2">
                            <div className="bg-red-500/20 p-2 rounded">
                              <p className="font-semibold mb-1">📖 Study Time</p>
                              <p>1 hour daily (minimum)</p>
                            </div>
                            <div className="bg-red-500/20 p-2 rounded">
                              <p className="font-semibold mb-1">🆘 Get Help</p>
                              <p>Teacher + Tutor immediately</p>
                            </div>
                          </div>
                          <p className="text-xs text-red-200 mt-2">
                            → Start with basics • One-on-one tutoring • Daily practice • Join peer study group
                          </p>
                        </div>
                      ))}
                      <div className="bg-red-500/20 p-3 rounded mt-3">
                        <p className="text-xs text-red-300 font-semibold">
                          ⚡ Priority: Focus ALL extra study time on these subjects first. Don't try to improve everything at once.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message if all subjects are doing well */}
          {criticalSubjects.length === 0 && needsAttention.length === 0 && topStrengths.length > 0 && (
            <div className="dashboard-card bg-gradient-to-br from-green-600 to-emerald-700" style={{ gridColumn: "1 / -1" }}>
              <div className="flex items-center gap-4 p-4">
                <Trophy className="w-12 h-12 text-yellow-300" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">🌟 Outstanding Performance Across All Subjects!</h3>
                  <p className="text-white/90">
                    You're performing excellently in all your subjects! Keep up the amazing work and maintain this consistency.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Grade Distribution */}
          <div className="dashboard-card">
            <div className="mb-4">
              <h3 className="card-title flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Grade Distribution
              </h3>
              <p className="text-sm text-gray-400">Where do your scores fall?</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="range" 
                  stroke="#9ca3af"
                  style={{ fontSize: '11px' }}
                  interval={0}
                />
                <YAxis 
                  stroke="#9ca3af"
                  label={{ value: 'Number of Grades', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Grades">
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">
              {performanceRanges.map((range, i) => (
                <div key={i}>
                  <div className="h-2 rounded-full mb-1" style={{ backgroundColor: range.color }}></div>
                  <p className="text-xs text-gray-400 font-semibold">{range.count}</p>
                  <p className="text-xs text-gray-500">{range.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Test Type Performance */}
          <div className="dashboard-card">
            <div className="mb-4">
              <h3 className="card-title flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Test Type Performance
              </h3>
              <p className="text-sm text-gray-400">Which formats suit you best?</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={testTypeComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="testType" 
                  stroke="#9ca3af"
                  style={{ fontSize: '11px' }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  domain={[0, 100]}
                  label={{ value: 'Average (%)', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="average" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Average Score">
                  {testTypeComparison.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.average >= 85 ? '#10b981' :
                        entry.average >= 70 ? '#3b82f6' :
                        entry.average >= 60 ? '#8b5cf6' :
                        '#f59e0b'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {testTypeComparison.slice(0, 3).map((test, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded">
                  <span className="text-sm text-gray-300">{test.testType}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{test.count} tests</span>
                    <span className="text-sm font-bold text-blue-400">{test.average}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Insights (not trend) */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <div className="mb-4">
              <h3 className="card-title flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Performance Insights
              </h3>
              <p className="text-sm text-gray-400">
                Analysis of your last {recentData.length} assessments
              </p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={recentData}>
                <defs>
                  <linearGradient id="insightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isImproving ? "#10b981" : "#f59e0b"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isImproving ? "#10b981" : "#f59e0b"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="index" 
                  stroke="#9ca3af"
                  label={{ value: 'Recent Assessments →', position: 'insideBottom', offset: -5, style: { fill: '#9ca3af' } }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  domain={[0, 100]}
                  label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-800 p-3 rounded-lg border border-purple-500/50 shadow-xl">
                          <p className="text-white font-semibold">{data.subject}</p>
                          <p className="text-sm text-gray-300">{data.testType}</p>
                          <p className="text-lg font-bold text-purple-400 mt-1">{data.score}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="none"
                  fill="url(#insightGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={isImproving ? "#10b981" : "#f59e0b"}
                  strokeWidth={3}
                  dot={{ fill: isImproving ? "#10b981" : "#f59e0b", r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Insights Boxes */}
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {/* Insight 1: Direction */}
              <div className={`p-4 rounded-lg border ${isImproving ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {isImproving ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-orange-400" />
                  )}
                  <h4 className={`font-semibold ${isImproving ? 'text-green-400' : 'text-orange-400'}`}>
                    Performance Direction
                  </h4>
                </div>
                <p className="text-sm text-gray-300 mb-2">
                  {isImproving 
                    ? `Your recent scores show a positive trend with a ${changePercent}% improvement. Great job!`
                    : `Your recent scores need attention. Focus on consistent study habits to improve.`
                  }
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className={isImproving ? 'text-green-300' : 'text-orange-300'}>
                    Change: {isImproving ? '+' : '-'}{changePercent}%
                  </span>
                </div>
              </div>

              {/* Insight 2: Consistency */}
              <div className={`p-4 rounded-lg border ${isConsistent ? 'bg-blue-500/10 border-blue-500/30' : 'bg-purple-500/10 border-purple-500/30'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className={`w-5 h-5 ${isConsistent ? 'text-blue-400' : 'text-purple-400'}`} />
                  <h4 className={`font-semibold ${isConsistent ? 'text-blue-400' : 'text-purple-400'}`}>
                    Consistency Level
                  </h4>
                </div>
                <p className="text-sm text-gray-300 mb-2">
                  {isConsistent 
                    ? `Your scores are consistent (±${stdDev.toFixed(1)}%). This shows stable performance and good preparation.`
                    : `Your scores vary significantly (±${stdDev.toFixed(1)}%). Try to maintain consistent study habits.`
                  }
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className={isConsistent ? 'text-blue-300' : 'text-purple-300'}>
                    Status: {isConsistent ? 'Consistent' : 'Variable'}
                  </span>
                </div>
              </div>

              {/* Insight 3: Action Items */}
              <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-semibold text-indigo-400">
                    Immediate Actions
                  </h4>
                </div>
                <ul className="text-sm text-gray-300 space-y-1.5">
                  {isImproving ? (
                    <>
                      <li>✓ Continue current methods</li>
                      <li>✓ Challenge with harder topics</li>
                      <li>✓ Help peers to reinforce</li>
                    </>
                  ) : (
                    <>
                      <li>• Review recent mistakes</li>
                      <li>• Increase study time 30min</li>
                      <li>• Ask teacher for help</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Comprehensive Study Recommendations */}
          <div className="dashboard-card bg-gradient-to-br from-indigo-600 to-purple-600" style={{ gridColumn: "1 / -1" }}>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-4 rounded-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">📚 Your Personalized Study Plan</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* For Top Performer */}
                  {topPerformer && (
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy className="w-5 h-5 text-yellow-300" />
                        <h4 className="font-semibold text-white">Excellence Strategy</h4>
                      </div>
                      <div className="space-y-2 text-white/90 text-sm">
                        <p><strong>🏆 {topPerformer.subject}</strong> - Your star subject!</p>
                        <ul className="space-y-1 ml-4 text-xs">
                          <li>• Maintain with 20-min weekly review</li>
                          <li>• Teach others to deepen mastery</li>
                          <li>• Explore advanced concepts</li>
                          <li>• This can pull up your overall average</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* For Strong Subjects */}
                  {topStrengths.length > 0 && (
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-green-300" />
                        <h4 className="font-semibold text-white">Strength Maintenance</h4>
                      </div>
                      <div className="space-y-2 text-white/90 text-sm">
                        {topStrengths.slice(0, 3).map((subject, i) => (
                          <div key={i}>
                            <p><strong>✓ {subject.subject}</strong> ({subject.average.toFixed(0)}%)</p>
                            <p className="text-xs ml-4">Weekly practice maintains excellence</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Critical Focus Area */}
                {(criticalSubjects.length > 0 || needsAttention.length > 0) && (
                  <div className={`p-4 rounded-lg backdrop-blur-sm border-2 ${
                    criticalSubjects.length > 0 
                      ? 'bg-red-500/20 border-red-400/50' 
                      : 'bg-yellow-500/20 border-yellow-400/50'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className={`w-5 h-5 ${criticalSubjects.length > 0 ? 'text-red-300' : 'text-yellow-300'}`} />
                      <h4 className="font-semibold text-white">
                        {criticalSubjects.length > 0 ? '⚠️ Critical Priority Focus' : '🎯 Priority Focus Areas'}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {/* Show critical subjects first */}
                      {criticalSubjects.slice(0, 2).map((subject, i) => (
                        <div key={i} className="bg-white/10 p-3 rounded">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-white font-semibold">{i + 1}. {subject.subject}</p>
                              <p className="text-red-200 text-xs">Critical: {subject.average.toFixed(1)}% → First target: 65%</p>
                            </div>
                            <span className="bg-red-500/40 px-2 py-1 rounded text-xs text-white font-bold">
                              CRITICAL
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-white/90">
                            <div className="bg-white/10 p-2 rounded">
                              <p className="font-semibold mb-1">📖 Study Time</p>
                              <p>1 hour daily (essential)</p>
                            </div>
                            <div className="bg-white/10 p-2 rounded">
                              <p className="font-semibold mb-1">🎯 Strategy</p>
                              <p>Teacher help + Tutor + Basics</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Show needs attention subjects */}
                      {needsAttention.slice(0, criticalSubjects.length > 0 ? 1 : 3).map((subject, i) => (
                        <div key={i} className="bg-white/10 p-3 rounded">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-white font-semibold">
                                {criticalSubjects.length + i + 1}. {subject.subject}
                              </p>
                              <p className="text-yellow-200 text-xs">
                                Current: {subject.average.toFixed(1)}% → Target: {Math.min(85, subject.average + 15).toFixed(0)}%
                              </p>
                            </div>
                            <span className="bg-yellow-500/30 px-2 py-1 rounded text-xs text-white font-semibold">
                              FOCUS
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-white/90">
                            <div className="bg-white/10 p-2 rounded">
                              <p className="font-semibold mb-1">📖 Study Time</p>
                              <p>30-45 mins daily</p>
                            </div>
                            <div className="bg-white/10 p-2 rounded">
                              <p className="font-semibold mb-1">🎯 Strategy</p>
                              <p>Practice + Doubt clearing</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 bg-white/10 p-3 rounded">
                      <p className="text-xs text-white font-semibold">
                        💡 Smart Tip: {criticalSubjects.length > 0 
                          ? 'Master critical subjects before moving to others. One subject at a time!' 
                          : 'Focus on these to reach 75%+, then maintain with regular review.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Universal Tips */}
                <div className="mt-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Universal Success Strategies
                  </h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="bg-white/10 p-3 rounded">
                      <p className="text-sm font-semibold text-white mb-1">⏰ Time Management</p>
                      <p className="text-xs text-white/80">Pomodoro: 25min focus + 5min break</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded">
                      <p className="text-sm font-semibold text-white mb-1">📝 Active Learning</p>
                      <p className="text-xs text-white/80">Teach concepts aloud or to peers</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded">
                      <p className="text-sm font-semibold text-white mb-1">🔄 Regular Review</p>
                      <p className="text-xs text-white/80">Spaced repetition for retention</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="dashboard-card bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-500/30" style={{ gridColumn: "1 / -1" }}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Your Academic Achievements
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg border border-yellow-500/30">
                <Trophy className="w-10 h-10 mx-auto mb-2 text-yellow-400" />
                <p className="text-gray-400 text-xs mb-1">Best Score</p>
                <p className="text-4xl font-bold text-white">
                  {Math.max(...grades.map(g => {
                    if (g.gpa !== undefined) return g.gpa * 10;
                    if (g.totalMarks && g.totalMarks > 0) return (g.marks / g.totalMarks) * 100;
                    return parseFloat(g.marks) || 0;
                  })).toFixed(1)}%
                </p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg border border-blue-500/30">
                <BookOpen className="w-10 h-10 mx-auto mb-2 text-blue-400" />
                <p className="text-gray-400 text-xs mb-1">Subjects Covered</p>
                <p className="text-4xl font-bold text-white">{subjectPerformance.length}</p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg border border-green-500/30">
                <Award className="w-10 h-10 mx-auto mb-2 text-green-400" />
                <p className="text-gray-400 text-xs mb-1">Excellent Scores (≥80%)</p>
                <p className="text-4xl font-bold text-white">
                  {grades.filter(g => {
                    let score = 0;
                    if (g.gpa !== undefined) score = g.gpa * 10;
                    else if (g.totalMarks && g.totalMarks > 0) score = (g.marks / g.totalMarks) * 100;
                    else score = parseFloat(g.marks) || 0;
                    return score >= 80;
                  }).length}
                </p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg border border-purple-500/30">
                <Zap className="w-10 h-10 mx-auto mb-2 text-purple-400" />
                <p className="text-gray-400 text-xs mb-1">Good Score Streak</p>
                <p className="text-4xl font-bold text-white">
                  {(() => {
                    const sorted = [...grades].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
                    let streak = 0;
                    for (let grade of sorted) {
                      let score = 0;
                      if (grade.gpa !== undefined) score = grade.gpa * 10;
                      else if (grade.totalMarks && grade.totalMarks > 0) score = (grade.marks / grade.totalMarks) * 100;
                      else score = parseFloat(grade.marks) || 0;
                      if (score >= 70) streak++;
                      else break;
                    }
                    return streak;
                  })()}
                </p>
                <p className="text-xs text-gray-400 mt-1">Consecutive good grades</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentStatistics;