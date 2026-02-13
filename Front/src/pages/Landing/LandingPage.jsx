import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  Shield,
  Zap,
  ChevronRight,
  Euro,
} from 'lucide-react';
import { GoRocket, GoVerified } from 'react-icons/go';
import { SkeletonCard } from '../../components/SkeletonLoader/SkeletonLoader';
import { apiListCourses } from '../../api';
import { CATEGORIES, STEPS } from '../../helpers/landingData';

/* ===== Sub-Components ===== */
function CategoryCard({ name, icon: Icon, color, count }) {
  return (
    <button className="category-card" style={{ '--cat-color': color }}>
      <div className="category-icon-wrap">
        <Icon size={28} />
      </div>
      <span className="category-name">{name}</span>
      <span className="category-count">{count} courses</span>
    </button>
  );
}

function StepCard({ icon: Icon, title, desc, index }) {
  return (
    <div className="step-card">
      <div className="step-number">{index + 1}</div>
      <div className="step-icon-wrap">
        <Icon size={28} />
      </div>
      <h3 className="step-title">{title}</h3>
      <p className="step-desc">{desc}</p>
    </div>
  );
}

/* ===== Featured Course Card ===== */
function FeaturedCourseCard({ course }) {
  const levelClass = course.level
    ? `courses-level courses-level--${course.level.toLowerCase()}`
    : 'courses-level';
  return (
    <Link to="/courses" className="featured-course-card card-hover">
      <div className="featured-course-top">
        <span className={levelClass}>{course.level || 'All levels'}</span>
      </div>
      <h4 className="featured-course-subject">{course.subject}</h4>
      <p className="featured-course-desc">
        {course.description || 'No description available.'}
      </p>
      <div className="featured-course-footer">
        <span className="featured-course-price">
          <Euro size={14} /> €{course.hourly_price}/hr
        </span>
      </div>
    </Link>
  );
}

/* ===== Landing Page ===== */
export default function LandingPage() {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiListCourses({ per_page: 4 })
      .then((res) => {
        if (!cancelled) setCourses(res.data || []);
      })
      .catch(() => {
        if (!cancelled) setCourses([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingCourses(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="landing">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <GoRocket size={14} />
              <span>The #1 Micro-Tutoring Platform</span>
            </div>
            <h1 className="hero-title">
              Learn anything,<br />
              from <span className="hero-highlight">anyone</span>
            </h1>
            <p className="hero-subtitle">
              Book one-on-one video sessions with skilled mentors.
              From code reviews to guitar lessons — fast, simple, and affordable.
            </p>
            <div className="hero-actions">
              <button className="btn btn--primary btn--lg">
                <span>Get Started</span>
                <ArrowRight size={18} />
              </button>
              <Link to="/about" className="btn btn--ghost btn--lg">
                Learn More
              </Link>
            </div>
            <div className="hero-trust">
              <GoVerified size={16} className="trust-icon" />
              <span>Trusted by 10,000+ learners worldwide</span>
            </div>
          </div>
          <div className="hero-visual">
            {/* Background decorations */}
            <div className="hero-decor hero-decor--blob" />
            <div className="hero-decor hero-decor--ring" />
            <div className="hero-decor hero-decor--ring-sm" />
            <div className="hero-decor hero-decor--dots" />
            <div className="hero-decor hero-decor--line" />

            <div className="hero-card hero-card--1">
              <div className="hero-card-avatar">👨‍💻</div>
              <div>
                <div className="hero-card-name">Alex M.</div>
                <div className="hero-card-skill">Rust & Systems</div>
              </div>
              <div className="hero-card-rating">
                <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
                <span>4.9</span>
              </div>
            </div>
            <div className="hero-card hero-card--2">
              <div className="hero-card-avatar">🎸</div>
              <div>
                <div className="hero-card-name">Sophie L.</div>
                <div className="hero-card-skill">Guitar & Music Theory</div>
              </div>
              <div className="hero-card-price">€25/hr</div>
            </div>
            <div className="hero-card hero-card--3">
              <div className="hero-card-avatar">🗣️</div>
              <div>
                <div className="hero-card-name">Pierre D.</div>
                <div className="hero-card-skill">French for Beginners</div>
              </div>
              <div className="hero-card-badge">
                <Shield size={12} />
                Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by category</h2>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.name} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section steps-section">
        <div className="container">
          <div className="section-header section-header--center">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">
              Get started in three simple steps
            </p>
          </div>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <StepCard key={step.title} {...step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured courses</h2>
            <Link to="/courses" className="section-link">
              Browse all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="featured-grid">
            {loadingCourses
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : courses.length > 0
                ? courses.map((c) => <FeaturedCourseCard key={c.id} course={c} />)
                : Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            }
          </div>
          {!loadingCourses && courses.length === 0 && (
            <p className="featured-note">
              <Zap size={14} />
              Could not load courses — make sure the backend is running on port 3001.
            </p>
          )}
        </div>
      </section>

    </div>
  );
}
