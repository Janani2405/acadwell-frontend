import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  MessageCircle, 
  BarChart3, 
  Shield, 
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Brain,
  TrendingUp,
  Globe,
  ChevronDown
} from 'lucide-react';
import '../css/Homepage.css'; // 🔗 external Tailwind-based CSS file
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleRegister= () => {
    navigate('/register');
  };
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <BookOpen className="feature-icon" />,
      title: "Smart Q&A System",
      description: "Get instant help from peers and experts in your field of study",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Peer Matching",
      description: "Connect with study partners who share your academic goals",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <Heart className="feature-icon" />,
      title: "Wellness Tracking",
      description: "Monitor your mental health and academic stress levels",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <BarChart3 className="feature-icon" />,
      title: "Progress Analytics",
      description: "Visualize your academic journey with detailed insights",
      color: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Students Helped", icon: <Users className="stat-icon" /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp className="stat-icon" /> },
    { number: "24/7", label: "Support Available", icon: <Globe className="stat-icon" /> },
    { number: "500+", label: "Universities", icon: <Award className="stat-icon" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "AcadWell helped me connect with study partners and manage my stress during finals week.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Engineering Student", 
      content: "The anonymous Q&A feature made me comfortable asking questions I was too shy to ask in class.",
      rating: 5
    },
    {
      name: "Emma Johnson",
      role: "Psychology Major",
      content: "The wellness tracking helped me identify patterns in my study habits and mental health.",
      rating: 5
    }
  ];

  return (
    <div className="homepage-wrapper">
      {/* Animated Background */}
      <div className="background-blobs"></div>

      {/* Navigation */}
      <nav className="nav-bar">
        <div className="nav-logo">
          <div className="logo-icon">
            <Brain className="logo-brain" />
          </div>
          <span className="logo-text">AcadWell</span>
        </div>
        
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#testimonials" className="nav-link">Reviews</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>

        <div className="nav-actions">
          <button onClick={handleSignIn} className="btn-signin">Sign In</button>
          <button onClick={handleRegister} className="btn-getstarted">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className={`hero-content ${isVisible ? 'fade-in' : 'fade-out'}`}>
          <div className="hero-badge">
            <Star className="hero-badge-icon" />
            <span>Trusted by 10,000+ Students Worldwide</span>
          </div>

          <h1 className="hero-heading">
            Your Academic
            <span className="hero-gradient-text">Wellness Partner</span>
          </h1>

          <p className="hero-subtext">
            Connect anonymously with peers, track your mental wellness, get academic support, 
            and thrive in your educational journey with our comprehensive platform.
          </p>

          <div className="hero-actions">
            <button onClick={handleGetStarted} className="btn-primary">
              <span>Start Your Journey</span>
              <ArrowRight className="btn-icon" />
            </button>
           
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon-wrapper">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="scroll-indicator">
          <ChevronDown className="scroll-icon" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-heading">
              Powerful Features for
              <span className="features-gradient-text">Academic Success</span>
            </h2>
            <p className="features-subtext">
              Everything you need to excel academically while maintaining your mental wellness
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`feature-card ${activeFeature === index ? 'feature-active' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Feature Showcase */}
          <div className="feature-showcase">
            <div className="showcase-grid">
              <div>
                <h3 className="showcase-heading">Anonymous & Safe Environment</h3>
                <div className="showcase-points">
                  <div className="showcase-point">
                    <CheckCircle className="point-icon" />
                    <div>
                      <strong className="point-title">Complete Privacy:</strong>
                      <p className="point-description">Your identity is protected with advanced anonymization</p>
                    </div>
                  </div>
                  <div className="showcase-point">
                    <CheckCircle className="point-icon" />
                    <div>
                      <strong className="point-title">Safe Space:</strong>
                      <p className="point-description">Moderated environment free from judgment</p>
                    </div>
                  </div>
                  <div className="showcase-point">
                    <CheckCircle className="point-icon" />
                    <div>
                      <strong className="point-title">24/7 Support:</strong>
                      <p className="point-description">Crisis detection and immediate help when needed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="showcase-card">
                <div className="showcase-card-header">
                  <Shield className="secure-icon" />
                  <span className="secure-text">Secure Connection</span>
                </div>
                <div className="showcase-bars">
                  <div className="bar bar1"></div>
                  <div className="bar bar2"></div>
                  <div className="bar bar3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2 className="testimonials-heading">What Students Say</h2>
            <p className="testimonials-subtext">Real experiences from our community</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="testimonial-star" />
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div>
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-card">
            <h2 className="cta-heading">Ready to Transform Your Academic Journey?</h2>
            <p className="cta-subtext">
              Join thousands of students who are already thriving with AcadWell
            </p>
            <div className="cta-actions">
              <button className="btn-primary">Get Started Free</button>
              <button className="btn-secondary">Schedule Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-about">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <Brain className="logo-brain" />
                </div>
                <span className="footer-logo-text">AcadWell</span>
              </div>
              <p className="footer-description">
                Empowering students through academic wellness and peer support.
              </p>
            </div>
            
            <div>
              <h4 className="footer-title">Features</h4>
              <ul className="footer-links">
                <li>Q&A System</li>
                <li>Peer Matching</li>
                <li>Wellness Tracking</li>
                <li>Progress Analytics</li>
              </ul>
            </div>
            
            <div>
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
              </ul>
            </div>
            
            <div>
              <h4 className="footer-title">Connect</h4>
              <ul className="footer-links">
                <li>Community</li>
                <li>Social Media</li>
                <li>Newsletter</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copy">&copy; 2024 AcadWell. All rights reserved.</p>
            <div className="footer-policy-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
