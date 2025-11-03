import React, { useEffect, useState } from "react";
import { gradesApi } from "../../../../api/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area
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
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  Brain,
  Flame
} from "lucide-react";
import "../../../css/dashboards/student/StudentDashboard.css";

const StudentStatistics = () => {
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

  // ==================== CHART 1: SEMESTER PROGRESS ====================
  // Shows clear semester-by-semester improvement
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

  // ==================== CHART 2: SUBJECT STRENGTHS ====================
  // Clear view of best and worst subjects
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
      subject: s.subject.length > 20 ? s.subject.substring(0, 20) + '...' : s.subject,
      fullSubject: s.subject,
      average: s.scores.length > 0 ? parseFloat((s.scores.reduce((a, b) => a + b, 0) / s.scores.length).toFixed(1)) : 0,
      assessments: s.scores.length
    }))
    .filter(s => s.average > 0)
    .sort((a, b) => b.average - a.average);

  const topSubjects = subjectPerformance.slice(0, 5);
  const weakSubjects = subjectPerformance.slice(-5).reverse();

  // ==================== CHART 3: PERFORMANCE DISTRIBUTION ====================
  // Clear breakdown of grade ranges
  const performanceRanges = [
    { range: "90-100%\nExcellent", min: 90, max: 100, count: 0, color: "#10b981" },
    { range: "80-89%\nVery Good", min: 80, max: 89, count: 0, color: "#3b82f6" },
    { range: "70-79%\nGood", min: 70, max: 79, count: 0, color: "#8b5cf6" },
    { range: "60-69%\nSatisfactory", min: 60, max: 69, count: 0, color: "#f59e0b" },
    { range: "Below 60%\nNeeds Work", min: 0, max: 59, count: 0, color: "#ef4444" }
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

  // ==================== CHART 4: TEST TYPE COMPARISON ====================
  // Compare performance across different test types
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

  // ==================== PERFORMANCE TREND ====================
  const recentGrades = [...grades]
    .sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt))
    .slice(-Math.min(15, grades.length));

  const trendData = recentGrades.map((g, index) => {
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

  const firstHalf = trendData.slice(0, Math.ceil(trendData.length / 2));
  const secondHalf = trendData.slice(Math.ceil(trendData.length / 2));
  const firstAvg = firstHalf.reduce((sum, d) => sum + d.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.score, 0) / secondHalf.length;
  const isImproving = secondAvg > firstAvg;
  const trendChange = Math.abs(((secondAvg - firstAvg) / firstAvg) * 100).toFixed(1);

  // ==================== ENCOURAGING MESSAGE ====================
  const getEncouragingMessage = (score) => {
    if (score >= 90) {
      return {
        icon: <Trophy className="w-8 h-8 text-yellow-400" />,
        title: "Outstanding Performance! 🏆",
        message: "You're crushing it! Your dedication is truly exceptional. Keep this amazing momentum going!",
        color: "from-yellow-500 to-orange-500",
        tips: [
          "Maintain your study routine - it's clearly working!",
          "Help others - teaching reinforces your own knowledge",
          "Challenge yourself with advanced topics"
        ]
      };
    } else if (score >= 80) {
      return {
        icon: <Award className="w-8 h-8 text-purple-400" />,
        title: "Excellent Work! 🌟",
        message: "You're doing fantastic! Your hard work is paying off beautifully. Excellence is within reach!",
        color: "from-purple-500 to-pink-500",
        tips: [
          "Focus on weak areas to push past 90%",
          "Consistency is key - keep your momentum",
          "Practice more challenging problems"
        ]
      };
    } else if (score >= 70) {
      return {
        icon: <Star className="w-8 h-8 text-blue-400" />,
        title: "Good Progress! ⭐",
        message: "You're on the right path! With focused effort on your weaker subjects, you'll reach excellence soon!",
        color: "from-blue-500 to-cyan-500",
        tips: [
          "Identify and tackle your weakest subjects",
          "Increase study time by 30 minutes daily",
          "Form study groups for difficult topics"
        ]
      };
    } else if (score >= 60) {
      return {
        icon: <Target className="w-8 h-8 text-green-400" />,
        title: "Building Momentum! 🎯",
        message: "You're making progress! Focus on understanding concepts deeply rather than memorization.",
        color: "from-green-500 to-teal-500",
        tips: [
          "Review basics before tackling advanced topics",
          "Ask teachers for help on confusing subjects",
          "Practice regularly instead of last-minute cramming"
        ]
      };
    } else {
      return {
        icon: <Zap className="w-8 h-8 text-orange-400" />,
        title: "Time for a Breakthrough! ⚡",
        message: "Every expert started as a beginner. With the right strategy and support, improvement is absolutely possible!",
        color: "from-orange-500 to-red-500",
        tips: [
          "Seek one-on-one help from teachers immediately",
          "Break study sessions into shorter, focused blocks",
          "Focus on understanding ONE subject well first"
        ]
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
          
          {/* Encouraging Message Banner */}
          <div className={`dashboard-card bg-gradient-to-r ${encouragement.color} p-6 mb-6`} style={{ gridColumn: "1 / -1" }}>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                {encouragement.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{encouragement.title}</h2>
                <p className="text-white/90 mb-3">{encouragement.message}</p>
                <div className="flex flex-wrap gap-2">
                  {encouragement.tips.map((tip, i) => (
                    <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-xs text-white backdrop-blur-sm">
                      💡 {tip}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Overall Score</p>
                <p className="text-5xl font-bold text-white">{overallPerformance.toFixed(1)}<span className="text-2xl">%</span></p>
                <div className="flex items-center justify-end gap-1 mt-2">
                  {isImproving ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">+{trendChange}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">-{trendChange}%</span>
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
                {isImproving ? (
                  <TrendingUp className="w-8 h-8 text-white" />
                ) : (
                  <Flame className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <p className="text-white/80 text-sm">Trend</p>
                <p className="text-2xl font-bold text-white">
                  {isImproving ? `Improving ↑${trendChange}%` : `Focus Needed`}
                </p>
              </div>
            </div>
          </div>

          {/* Chart 1: Semester Progress with Min/Max Range */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <div className="mb-4">
              <h3 className="card-title">📈 Your Journey: Semester-wise Performance</h3>
              <p className="text-sm text-gray-400">Track your progress across semesters • Gray area shows your score range</p>
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
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
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
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {semesterPerformance.slice(-3).map((sem, i) => (
                <div key={i} className="bg-white/5 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">{sem.semester}</p>
                  <p className="text-2xl font-bold text-purple-400">{sem.average}%</p>
                  <p className="text-xs text-gray-500">{sem.count} assessments</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Top 5 Strengths */}
          <div className="dashboard-card">
            <div className="mb-4">
              <h3 className="card-title flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Your Top 5 Strengths
              </h3>
              <p className="text-sm text-gray-400">Subjects where you excel</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSubjects} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" domain={[0, 100]} />
                <YAxis 
                  type="category" 
                  dataKey="subject" 
                  stroke="#9ca3af" 
                  width={100}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="average" fill="#10b981" radius={[0, 8, 8, 0]} name="Average Score">
                  {topSubjects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(16, 185, 129, ${1 - index * 0.15})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 text-center bg-green-500/10 p-2 rounded-lg">
              <p className="text-xs text-green-400 font-semibold">
                💪 Keep up the great work in these subjects!
              </p>
            </div>
          </div>

          {/* Chart 3: Areas for Improvement */}
          <div className="dashboard-card">
            <div className="mb-4">
              <h3 className="card-title flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                Areas to Focus On
              </h3>
              <p className="text-sm text-gray-400">Subjects needing attention</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weakSubjects} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" domain={[0, 100]} />
                <YAxis 
                  type="category" 
                  dataKey="subject" 
                  stroke="#9ca3af" 
                  width={100}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="average" fill="#f59e0b" radius={[0, 8, 8, 0]} name="Average Score">
                  {weakSubjects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(245, 158, 11, ${0.5 + index * 0.1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 text-center bg-orange-500/10 p-2 rounded-lg">
              <p className="text-xs text-orange-400 font-semibold">
                🎯 Dedicate extra study time to these subjects
              </p>
            </div>
          </div>

          {/* Chart 4: Grade Distribution */}
          <div className="dashboard-card">
            <div className="mb-4">
              <h3 className="card-title">📊 Your Grade Distribution</h3>
              <p className="text-sm text-gray-400">Where do most of your scores fall?</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="range" 
                  stroke="#9ca3af"
                  style={{ fontSize: '11px' }}
                  interval={0}
                  angle={0}
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
            <div className="mt-4 grid grid-cols-5 gap-2">
              {performanceRanges.map((range, i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-2 rounded-full mb-1" style={{ backgroundColor: range.color }}></div>
                  <p className="text-xs text-gray-400">{range.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 5: Test Type Comparison */}
          <div className="dashboard-card">
            <div className="mb-4">
              <h3 className="card-title">🎯 Performance by Test Type</h3>
              <p className="text-sm text-gray-400">Which tests suit you best?</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={testTypeComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="testType" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  domain={[0, 100]}
                  label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
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

          {/* Chart 6: Recent Performance Trend */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <div className="mb-4">
              <h3 className="card-title flex items-center gap-2">
                {isImproving ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-orange-400" />
                )}
                Recent Performance Trend
              </h3>
              <p className="text-sm text-gray-400">
                Your last {trendData.length} assessments • 
                <span className={isImproving ? "text-green-400 ml-1" : "text-orange-400 ml-1"}>
                  {isImproving ? 'Improving' : 'Needs focus'} ({trendChange}% change)
                </span>
              </p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={trendData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isImproving ? "#10b981" : "#f59e0b"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isImproving ? "#10b981" : "#f59e0b"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="index" 
                  stroke="#9ca3af"
                  label={{ value: 'Assessment Number (Recent →)', position: 'insideBottom', offset: -5, style: { fill: '#9ca3af' } }}
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
                  fill="url(#trendGradient)"
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
            
            {/* Trend Analysis */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isImproving ? 'bg-green-500/10 border border-green-500/30' : 'bg-orange-500/10 border border-orange-500/30'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className={`w-5 h-5 ${isImproving ? 'text-green-400' : 'text-orange-400'}`} />
                  <h4 className={`font-semibold ${isImproving ? 'text-green-400' : 'text-orange-400'}`}>
                    Trend Analysis
                  </h4>
                </div>
                <p className="text-sm text-gray-300">
                  {isImproving 
                    ? `Great job! Your scores have improved by ${trendChange}% in recent assessments. Keep up the momentum!`
                    : `Your recent scores need attention. Focus on consistent study habits to improve by ${trendChange}%.`
                  }
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h4 className="font-semibold text-purple-400">Action Items</h4>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  {isImproving ? (
                    <>
                      <li>• Continue your current study methods</li>
                      <li>• Challenge yourself with harder problems</li>
                      <li>• Aim for consistent 90%+ scores</li>
                    </>
                  ) : (
                    <>
                      <li>• Review recent test mistakes carefully</li>
                      <li>• Schedule regular study sessions</li>
                      <li>• Seek help from teachers immediately</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Study Tips */}
          <div className="dashboard-card bg-gradient-to-br from-indigo-600 to-purple-600" style={{ gridColumn: "1 / -1" }}>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <ThumbsUp className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-4">📚 Personalized Study Recommendations</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Based on Your Strengths
                    </h4>
                    <ul className="space-y-2 text-white/90 text-sm">
                      {topSubjects.slice(0, 3).map((subject, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-300" />
                          <span><strong>{subject.fullSubject}:</strong> Maintain your {subject.average.toFixed(0)}% performance with regular revision</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Areas Needing Focus
                    </h4>
                    <ul className="space-y-2 text-white/90 text-sm">
                      {weakSubjects.slice(0, 3).map((subject, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-300" />
                          <span><strong>{subject.fullSubject}:</strong> Dedicate extra 30 mins daily to improve from {subject.average.toFixed(0)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    Universal Success Strategies
                  </h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="bg-white/10 p-3 rounded">
                      <p className="text-xs font-semibold text-white mb-1">🕐 Time Management</p>
                      <p className="text-xs text-white/80">Use Pomodoro: 25 min focus, 5 min break</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded">
                      <p className="text-xs font-semibold text-white mb-1">📝 Active Learning</p>
                      <p className="text-xs text-white/80">Teach concepts to others or explain aloud</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded">
                      <p className="text-xs font-semibold text-white mb-1">🎯 Practice Tests</p>
                      <p className="text-xs text-white/80">Simulate exam conditions weekly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="dashboard-card bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-500/30" style={{ gridColumn: "1 / -1" }}>
            <h3 className="text-xl font-bold text-white mb-4">📋 Your Performance Summary</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <p className="text-gray-400 text-xs mb-1">Best Score</p>
                <p className="text-3xl font-bold text-white">
                  {Math.max(...grades.map(g => {
                    if (g.gpa !== undefined) return g.gpa * 10;
                    if (g.totalMarks && g.totalMarks > 0) return (g.marks / g.totalMarks) * 100;
                    return parseFloat(g.marks) || 0;
                  })).toFixed(1)}%
                </p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-gray-400 text-xs mb-1">Subjects Studied</p>
                <p className="text-3xl font-bold text-white">{subjectPerformance.length}</p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-gray-400 text-xs mb-1">Scores Above 80%</p>
                <p className="text-3xl font-bold text-white">
                  {grades.filter(g => {
                    let score = 0;
                    if (g.gpa !== undefined) score = g.gpa * 10;
                    else if (g.totalMarks && g.totalMarks > 0) score = (g.marks / g.totalMarks) * 100;
                    else score = parseFloat(g.marks) || 0;
                    return score >= 80;
                  }).length}
                </p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Flame className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <p className="text-gray-400 text-xs mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-white">
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
                <p className="text-xs text-gray-400">Good scores (≥70%)</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentStatistics;