import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { SiRust, SiReact, SiPostgresql } from 'react-icons/si';
import { Heart, GraduationCap } from 'lucide-react';


const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <GraduationCap size={24} className="footer-logo-icon-svg" />
              <span className="footer-logo-text">leboncours</span>
            </Link>
            <p className="footer-tagline">
              A decentralized marketplace for micro-tutoring sessions.
              Speed, Simplicity, and Professional Management.
            </p>
            <div className="footer-tech">
              <span className="tech-badge"><SiRust size={14} /> Rust</span>
              <span className="tech-badge"><SiReact size={14} /> React</span>
              <span className="tech-badge"><SiPostgresql size={14} /> PostgreSQL (Aiven)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Platform</h4>
            <nav className="footer-nav">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About</Link>
              <span className="footer-link footer-link--disabled">Find Mentors</span>
              <span className="footer-link footer-link--disabled">Browse Courses</span>
              <span className="footer-link footer-link--disabled">Become a Mentor</span>
            </nav>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4 className="footer-heading">Resources</h4>
            <nav className="footer-nav">
              <span className="footer-link footer-link--disabled">Help Center</span>
              <span className="footer-link footer-link--disabled">API Docs</span>
              <span className="footer-link footer-link--disabled">Blog</span>
              <span className="footer-link footer-link--disabled">Community</span>
            </nav>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <nav className="footer-nav">
              <span className="footer-link footer-link--disabled">Privacy Policy</span>
              <span className="footer-link footer-link--disabled">Terms of Service</span>
              <span className="footer-link footer-link--disabled">Cookie Policy</span>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} Leboncours
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
