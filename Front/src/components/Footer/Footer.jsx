import { Link } from 'react-router-dom';
import { SiRust, SiReact, SiPostgresql } from 'react-icons/si';
import { GraduationCap } from 'lucide-react';


function Footer() {
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
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} Leboncours
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
