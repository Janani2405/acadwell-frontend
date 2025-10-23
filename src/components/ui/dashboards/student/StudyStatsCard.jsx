// frontend/src/components/ui/dashboards/student/StudyStatsCard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Target, 
  BarChart, 
  Award,
  BookOpen,
  Sparkles,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { gradesApi } from '../../../../api/api';

const StudyStatsCard = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssessments: 0,
    avgCatPercentage: 0,
    avgGpa: 0,
    overallPerformance: 0,
    isImproving: false
  });

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const data = await gradesApi.fetchMyGrades();
        if (data.success && data.grades) {
          calculateStats(data.grades);
          setGrades(data.grades);
        }
      } catch (err) {
        console.error("Error fetching grades:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const calculateStats = (gradesData) => {
    if (!gradesData || gradesData.length === 0) {
      return;
    }

    // Total assessments
    const totalAssessments = gradesData.length;

    // Calculate CAT average
    const catGrades = gradesData.filter(g => {
      const hasTotal = g.totalMarks !== undefined && g.totalMarks !== null;
      const testType = g.testType || "";
      return hasTotal || testType.includes("CAT") || testType.includes("Mid-Semester") || testType.includes("Internal");
    });

    const catWithTotal = catGrades.filter(g => g.totalMarks && g.totalMarks > 0);
    const avgCatPercentage = catWithTotal.length > 0
      ? catWithTotal.reduce((sum, g) => sum + (g.marks / g.totalMarks * 100), 0) / catWithTotal.length
      : 0;

    // Calculate average GPA
    const semesterGrades = gradesData.filter(g => g.gpa !== undefined && g.gpa !== null);
    const avgGpa = semesterGrades.length > 0
      ? semesterGrades.reduce((sum, g) => sum + g.gpa, 0) / semesterGrades.length
      : 0;

    // Calculate overall performance
    const regularGrades = gradesData.filter(g => {
      const hasTotal = g.totalMarks !== undefined && g.totalMarks !== null;
      const hasGpa = g.gpa !== undefined && g.gpa !== null;
      return !hasTotal && !hasGpa && g.marks !== undefined;
    });
    const avgRegular = regularGrades.length > 0
      ? regularGrades.reduce((sum, g) => sum + parseFloat(g.marks), 0) / regularGrades.length
      : 0;

    const overallPerformance = avgGpa > 0 ? avgGpa * 10 : avgCatPercentage > 0 ? avgCatPercentage : avgRegular;

    // Calculate improvement trend
    const recentGrades = [...gradesData]
      .sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt))
      .slice(-10);

    if (recentGrades.length >= 6) {
      const firstHalf = recentGrades.slice(0, Math.floor(recentGrades.length / 2));
      const secondHalf = recentGrades.slice(Math.floor(recentGrades.length / 2));

      const getScore = (g) => {
        if (g.gpa !== undefined) return g.gpa * 10;
        if (g.totalMarks && g.totalMarks > 0) return (g.marks / g.totalMarks) * 100;
        return parseFloat(g.marks) || 0;
      };

      const firstAvg = firstHalf.reduce((sum, g) => sum + getScore(g), 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, g) => sum + getScore(g), 0) / secondHalf.length;
      
      const isImproving = secondAvg > firstAvg;

      setStats({
        totalAssessments,
        avgCatPercentage,
        avgGpa,
        overallPerformance,
        isImproving
      });
    } else {
      setStats({
        totalAssessments,
        avgCatPercentage,
        avgGpa,
        overallPerformance,
        isImproving: false
      });
    }
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return { text: "Outstanding", color: "text-yellow-400", bgColor: "bg-yellow-500/20", icon: Trophy };
    if (score >= 80) return { text: "Excellent", color: "text-purple-400", bgColor: "bg-purple-500/20", icon: Award };
    if (score >= 70) return { text: "Good", color: "text-blue-400", bgColor: "bg-blue-500/20", icon: Sparkles };
    if (score >= 60) return { text: "Average", color: "text-green-400", bgColor: "bg-green-500/20", icon: Target };
    return { text: "Needs Improvement", color: "text-orange-400", bgColor: "bg-orange-500/20", icon: Target };
  };

  const performance = getPerformanceLevel(stats.overallPerformance);
  const PerformanceIcon = performance.icon;

  const handleViewFullStats = () => {
    navigate('/dashboard/student/statistics');
  };

  if (loading) {
    return (
      <div className="dashboard-card study-stats-card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (grades.length === 0) {
    return (
      <div className="dashboard-card study-stats-card">
        <h3 className="card-title">📊 Study Statistics</h3>
        <p className="card-subtitle">Your academic performance</p>
        
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-400 text-sm">No grades available yet</p>
          <p className="text-gray-500 text-xs mt-1">Statistics will appear when grades are uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card study-stats-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="card-title">📊 Study Statistics</h3>
          <p className="card-subtitle">Your academic performance</p>
        </div>
        <div className={`${performance.bgColor} p-2 rounded-lg`}>
          <PerformanceIcon className={`w-6 h-6 ${performance.color}`} />
        </div>
      </div>

      {/* Performance Badge */}
      <div className={`mb-4 p-3 rounded-lg ${performance.bgColor} border border-white/10`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Overall Performance</p>
            <p className={`text-2xl font-bold ${performance.color}`}>
              {stats.overallPerformance.toFixed(1)}%
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${performance.color}`}>
              {performance.text}
            </p>
            {stats.isImproving && (
              <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                Improving
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon hours" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.totalAssessments}</span>
            <span className="stat-label">Total Exams</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon assignments" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="stat-info">
            <span className="stat-number">
              {stats.avgCatPercentage > 0 ? `${stats.avgCatPercentage.toFixed(1)}%` : 'N/A'}
            </span>
            <span className="stat-label">CAT Average</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon score" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <Award className="w-5 h-5 text-white" />
          </div>
          <div className="stat-info">
            <span className="stat-number">
              {stats.avgGpa > 0 ? stats.avgGpa.toFixed(2) : 'N/A'}
            </span>
            <span className="stat-label">Average GPA</span>
          </div>
        </div>

        <div className="stat-item">
          <div className={`stat-icon streak ${stats.isImproving ? 'bg-emerald-500' : 'bg-orange-500'}`}>
            {stats.isImproving ? (
              <TrendingUp className="w-5 h-5 text-white" />
            ) : (
              <CheckCircle className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="stat-info">
            <span className="stat-number">
              {stats.isImproving ? '📈' : '✓'}
            </span>
            <span className="stat-label">
              {stats.isImproving ? 'Improving' : 'Stable'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-purple-400 mb-1">Quick Insight</p>
            <p className="text-xs text-gray-300">
              {stats.overallPerformance >= 80 
                ? "You're doing great! Keep up the excellent work and maintain this consistency."
                : stats.overallPerformance >= 60
                ? "Good progress! Focus on your weaker subjects to improve further."
                : "Don't give up! Review your study methods and seek help where needed."}
            </p>
          </div>
        </div>
      </div>
      
      {/* View Full Dashboard Button */}
      <button 
        onClick={handleViewFullStats}
        className="detailed-stats-btn mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200"
      >
        <BarChart className="w-4 h-4" />
        View Detailed Statistics
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default StudyStatsCard;