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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
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
  ThumbsUp
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

  // Categorize grades
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

  // Calculate overall statistics
  const totalGrades = grades.length;
  
  // Calculate average percentage for CAT exams
  const catWithTotal = catGrades.filter(g => g.totalMarks && g.totalMarks > 0);
  const avgCatPercentage = catWithTotal.length > 0
    ? catWithTotal.reduce((sum, g) => sum + (g.marks / g.totalMarks * 100), 0) / catWithTotal.length
    : 0;

  // Calculate average GPA
  const avgGpa = semesterGrades.length > 0
    ? semesterGrades.reduce((sum, g) => sum + g.gpa, 0) / semesterGrades.length
    : 0;

  // Calculate overall average
  const allNumericGrades = regularGrades.filter(g => g.marks !== undefined);
  const avgRegular = allNumericGrades.length > 0
    ? allNumericGrades.reduce((sum, g) => sum + parseFloat(g.marks), 0) / allNumericGrades.length
    : 0;

  // Determine overall performance
  const overallPerformance = avgGpa > 0 ? avgGpa * 10 : avgCatPercentage > 0 ? avgCatPercentage : avgRegular;

  // Get encouraging message based on performance
  const getEncouragingMessage = (score) => {
    if (score >= 90) {
      return {
        icon: <Trophy className="w-8 h-8 text-yellow-400" />,
        title: "Outstanding Performance! 🏆",
        message: "You're at the top of your game! Your dedication and hard work are truly paying off. Keep this momentum going!",
        color: "from-yellow-500 to-orange-500"
      };
    } else if (score >= 80) {
      return {
        icon: <Award className="w-8 h-8 text-purple-400" />,
        title: "Excellent Work! 🌟",
        message: "You're doing great! Your consistent efforts are showing wonderful results. You're so close to excellence!",
        color: "from-purple-500 to-pink-500"
      };
    } else if (score >= 70) {
      return {
        icon: <Star className="w-8 h-8 text-blue-400" />,
        title: "Good Progress! ⭐",
        message: "You're on the right track! With a little more focus, you'll reach even greater heights. Keep pushing forward!",
        color: "from-blue-500 to-cyan-500"
      };
    } else if (score >= 60) {
      return {
        icon: <Target className="w-8 h-8 text-green-400" />,
        title: "You're Getting There! 🎯",
        message: "Every step counts! Focus on understanding the concepts better. You have the potential to do much better!",
        color: "from-green-500 to-teal-500"
      };
    } else {
      return {
        icon: <Zap className="w-8 h-8 text-orange-400" />,
        title: "Time to Power Up! ⚡",
        message: "Don't give up! Every expert was once a beginner. Seek help, practice more, and you'll see improvement. You've got this!",
        color: "from-orange-500 to-red-500"
      };
    }
  };

  const encouragement = getEncouragingMessage(overallPerformance);

  // Prepare data for semester-wise performance (Line Chart)
  const semesterData = {};
  grades.forEach(g => {
    const sem = g.semester || "Unknown";
    if (!semesterData[sem]) {
      semesterData[sem] = { semester: `Sem ${sem}`, grades: [], total: 0, count: 0 };
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
    }
  });

  const semesterPerformance = Object.values(semesterData)
    .map(s => ({
      semester: s.semester,
      average: s.count > 0 ? (s.total / s.count).toFixed(1) : 0,
      grades: s.count
    }))
    .sort((a, b) => {
      const semA = parseInt(a.semester.replace('Sem ', ''));
      const semB = parseInt(b.semester.replace('Sem ', ''));
      return semA - semB;
    });

  // Prepare data for subject-wise performance (Bar Chart)
  const subjectData = {};
  grades.forEach(g => {
    const subject = g.subject || "Unknown";
    if (!subjectData[subject]) {
      subjectData[subject] = { subject, scores: [], total: 0, count: 0 };
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
      subjectData[subject].total += score;
      subjectData[subject].count += 1;
    }
  });

  const subjectPerformance = Object.values(subjectData)
    .map(s => ({
      subject: s.subject.length > 15 ? s.subject.substring(0, 15) + '...' : s.subject,
      average: s.count > 0 ? (s.total / s.count).toFixed(1) : 0
    }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 10);

  // Prepare data for grade distribution (Pie Chart)
  const gradeDistribution = [
    { name: "Excellent (≥80%)", value: 0, color: "#10b981" },
    { name: "Good (60-79%)", value: 0, color: "#3b82f6" },
    { name: "Average (40-59%)", value: 0, color: "#f59e0b" },
    { name: "Below Average (<40%)", value: 0, color: "#ef4444" }
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
    
    if (score >= 80) gradeDistribution[0].value++;
    else if (score >= 60) gradeDistribution[1].value++;
    else if (score >= 40) gradeDistribution[2].value++;
    else if (score > 0) gradeDistribution[3].value++;
  });

  // Prepare data for test type performance (Radar Chart)
  const testTypeData = {};
  grades.forEach(g => {
    const testType = g.testType || "Unknown";
    if (!testTypeData[testType]) {
      testTypeData[testType] = { testType, total: 0, count: 0 };
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
      testTypeData[testType].total += score;
      testTypeData[testType].count += 1;
    }
  });

  const testTypePerformance = Object.values(testTypeData).map(t => ({
    testType: t.testType,
    average: t.count > 0 ? parseFloat((t.total / t.count).toFixed(1)) : 0
  }));

  // Calculate improvement trend
  const recentGrades = [...grades]
    .sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt))
    .slice(-10);

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
      subject: g.subject
    };
  });

  const firstHalf = trendData.slice(0, 5).reduce((sum, d) => sum + d.score, 0) / Math.min(5, trendData.length);
  const secondHalf = trendData.slice(-5).reduce((sum, d) => sum + d.score, 0) / Math.min(5, trendData.length);
  const isImproving = secondHalf > firstHalf;
  const improvementPercent = Math.abs(((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1);

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
                <p className="text-white/90">{encouragement.message}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Overall Score</p>
                <p className="text-4xl font-bold text-white">{overallPerformance.toFixed(1)}%</p>
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
                <p className="text-blue-200 text-sm">CAT Average</p>
                <p className="text-3xl font-bold text-white">{avgCatPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card bg-gradient-to-br from-green-600 to-green-800">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-green-200 text-sm">Average GPA</p>
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
                  <TrendingDown className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <p className="text-white/80 text-sm">Performance Trend</p>
                <p className="text-2xl font-bold text-white">
                  {isImproving ? '↑' : '↓'} {improvementPercent}%
                </p>
              </div>
            </div>
          </div>

          {/* Semester-wise Performance (Line Chart) */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <h3 className="card-title mb-6">📈 Semester-wise Performance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={semesterPerformance}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="semester" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="average"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorAvg)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Subject-wise Performance (Bar Chart) */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1", gridRow: "span 1" }}>
            <h3 className="card-title mb-6">📚 Top Subject Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={subjectPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" domain={[0, 100]} />
                <YAxis type="category" dataKey="subject" stroke="#9ca3af" width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="average" fill="#3b82f6" radius={[0, 8, 8, 0]}>
                  {subjectPerformance.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.average >= 80
                          ? '#10b981'
                          : entry.average >= 60
                          ? '#3b82f6'
                          : entry.average >= 40
                          ? '#f59e0b'
                          : '#ef4444'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grade Distribution (Pie Chart) */}
          <div className="dashboard-card">
            <h3 className="card-title mb-6">🎯 Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution.filter(g => g.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {gradeDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Test Type Performance (Radar Chart) */}
          <div className="dashboard-card">
            <h3 className="card-title mb-6">🎭 Test Type Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={testTypePerformance}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="testType" stroke="#9ca3af" />
                <PolarRadiusAxis stroke="#9ca3af" domain={[0, 100]} />
                <Radar
                  name="Average"
                  dataKey="average"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Performance Trend */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <h3 className="card-title mb-6">📊 Recent Performance Trend (Last 10 Assessments)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="index" stroke="#9ca3af" label={{ value: 'Assessment Number', position: 'insideBottom', offset: -5 }} />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                          <p className="text-white font-semibold">{payload[0].payload.subject}</p>
                          <p className="text-purple-400">Score: {payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Motivational Tips */}
          <div className="dashboard-card bg-gradient-to-br from-indigo-600 to-purple-600" style={{ gridColumn: "1 / -1" }}>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">💡 Study Tips for Better Performance</h3>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start gap-2">
                    <ThumbsUp className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span><strong>Consistent Practice:</strong> Regular study sessions are better than last-minute cramming</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ThumbsUp className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span><strong>Seek Help:</strong> Don't hesitate to ask teachers or peers when you're stuck</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ThumbsUp className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span><strong>Focus on Weak Areas:</strong> Identify subjects where you scored lower and give them extra attention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ThumbsUp className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span><strong>Take Breaks:</strong> Regular breaks improve concentration and retention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ThumbsUp className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span><strong>Celebrate Progress:</strong> Acknowledge your improvements, no matter how small!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentStatistics;