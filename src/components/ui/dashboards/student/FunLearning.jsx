import React, { useEffect, useState } from 'react';
import { PlayCircle, BookOpen, ExternalLink, X, Menu } from 'lucide-react';
import '../../../css/dashboards/student/StudentDashboard.css';
import Sidebar from './Sidebar';

const FunLearning = () => {
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

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Process embeds after script loads
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Replace these with actual reel IDs from @code_with_mk_
  const reels = [
    {
      id: 1,
      reelId: "DQjvyfCE9YB",
      title: "Data Structures Explained",
      description: "Quick overview of common data structures"
    },
    {
      id: 2,
      reelId: "DGsoRHvyWZB",
      title: "Algorithm Basics",
      description: "Understanding sorting algorithms"
    },
    {
      id: 3,
      reelId: "DOAXAV3EqnM",
      title: "Coding Tips & Tricks",
      description: "Pro tips for clean code"
    },
    {
      id: 4,
      reelId: "DOLYeD5k9i-",
      title: "OOPS Concepts",
      description: "Master OOP fundamentals"
    },
    {
      id: 5,
      reelId: "DMnJP21xf00",
      title: "React Essentials",
      description: "Learn React in minutes"
    },
    {
      id: 6,
      reelId: "DGdJAI3yRzI",
      title: "Problem Solving",
      description: "Approach to solving coding problems"
    }
  ];

  return (
    <div className="student-dashboard-wrapper">
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle />
      
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      
      <div className="student-dashboard-main">
        <div className="student-dashboard-content">
          
          {/* Header */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="card-title flex items-center gap-2">
                  <PlayCircle className="w-6 h-6 text-purple-400" />
                  Fun Learning with Code
                </h2>
                <p className="card-subtitle">
                  Educational coding reels from 
                  <a 
                    href="https://www.instagram.com/code_with_mk_/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 ml-1 inline-flex items-center gap-1"
                  >
                    @code_with_mk_
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://www.instagram.com/codebyabi/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 ml-1 inline-flex items-center gap-1"
                  >
                    @codebyabi
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://www.instagram.com/codejavid/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 ml-1 inline-flex items-center gap-1"
                  >
                    @codejavid
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://www.instagram.com/codinginpy/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 ml-1 inline-flex items-center gap-1"
                  >
                    @codinginpy
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
              <BookOpen className="w-12 h-12 text-purple-400 opacity-20" />
            </div>
          </div>

          {/* Reels Grid */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reels.map((reel) => (
                <div key={reel.id} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-purple-500/50 transition-colors">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-white mb-1">{reel.title}</h3>
                    <p className="text-xs text-gray-400">{reel.description}</p>
                  </div>
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '177.78%' }}>
                    <iframe
                      src={`https://www.instagram.com/reel/${reel.reelId}/embed`}
                      className="absolute top-0 left-0 w-full h-full"
                      style={{ border: 0 }}
                      scrolling="no"
                      allowTransparency={true}
                      title={reel.title}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="dashboard-card bg-gradient-to-br from-purple-600 to-indigo-600" style={{ gridColumn: "1 / -1" }}>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <PlayCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Learn While Having Fun! 🎉</h3>
                <p className="text-white/90 mb-4">
                  Watch these quick educational reels to learn coding concepts in an entertaining way. 
                  Perfect for quick study breaks between your regular study sessions!
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://www.instagram.com/code_with_mk_/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-semibold transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Follow @code_with_mk_
                  </a>
                  <a 
                    href="https://www.instagram.com/codinginpy/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-semibold transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Follow @codinginpy
                  </a>
                 
                  <a 
                    href="https://www.instagram.com/codejavid/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-semibold transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Follow @codejavid
                  </a>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Learning Tips */}
          <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
            <h3 className="text-lg font-bold text-white mb-4">💡 How to Make the Most of These Reels</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/30">
                <h4 className="font-semibold text-purple-400 mb-2">⏰ Study Breaks</h4>
                <p className="text-sm text-gray-300">Watch 1-2 reels during your study breaks to stay motivated and learn something new</p>
              </div>
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold text-blue-400 mb-2">📝 Take Notes</h4>
                <p className="text-sm text-gray-300">Pause and note down key concepts. Try implementing what you learn in your own code</p>
              </div>
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                <h4 className="font-semibold text-green-400 mb-2">🔄 Practice</h4>
                <p className="text-sm text-gray-300">Watch multiple times and practice the concepts. Repetition helps with retention</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FunLearning;