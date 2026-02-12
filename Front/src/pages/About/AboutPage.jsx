import React, { memo } from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { VALUES, TIMELINE, TECH } from '../../helpers/aboutData';

/* ===== Sub-Components ===== */
const ValueCard = memo(function ValueCard({ icon: Icon, title, desc, color }) {
  return (
    <div className="value-card" style={{ '--value-color': color }}>
      <div className="value-icon-wrap">
        <Icon size={24} />
      </div>
      <h3 className="value-title">{title}</h3>
      <p className="value-desc">{desc}</p>
    </div>
  );
});

const TimelineItem = memo(function TimelineItem({ icon: Icon, title, desc, index }) {
  return (
    <div className="timeline-item">
      <div className="timeline-marker">
        <div className="timeline-dot">
          <Icon size={18} />
        </div>
        {index < TIMELINE.length - 1 && <div className="timeline-line" />}
      </div>
      <div className="timeline-content">
        <h3 className="timeline-title">{title}</h3>
        <p className="timeline-desc">{desc}</p>
      </div>
    </div>
  );
});

/* ===== About Page ===== */
export default function AboutPage() {
  return (
    <div className="about">
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="container about-hero-inner">
          <h1 className="about-hero-title">
            Making knowledge<br />
            <span className="about-hero-highlight">accessible to all</span>
          </h1>
          <p className="about-hero-subtitle">
            Leboncours bridges the gap between casual learning and professional tutoring
            by allowing quick, one-off booking of video call sessions for any skill.
          </p>
        </div>
      </section>

      {/* ── Mission Statement ── */}
      <section className="section about-mission">
        <div className="container">
          <div className="mission-card glass-panel">
            <div className="mission-icon-wrap">
              <Target size={32} />
            </div>
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-text">
              We believe everyone has something valuable to teach and something new to learn.
              Leboncours creates a space where knowledge flows freely — from a senior developer
              helping with a tricky code review, to a musician teaching chord progressions,
              to a language enthusiast sharing conversation practice. No semester-long commitments.
              Just fast, focused, one-on-one sessions.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section about-values">
        <div className="container">
          <div className="section-header section-header--center">
            <h2 className="section-title">What drives us</h2>
            <p className="section-subtitle">
              Six core values that shape everything we build
            </p>
          </div>
          <div className="values-grid">
            {VALUES.map((v) => (
              <ValueCard key={v.title} {...v} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section about-timeline">
        <div className="container">
          <div className="section-header section-header--center">
            <h2 className="section-title">Our journey</h2>
          </div>
          <div className="timeline">
            {TIMELINE.map((item, i) => (
              <TimelineItem key={item.title} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="section about-tech">
        <div className="container">
          <div className="section-header section-header--center">
            <h2 className="section-title">Built with modern tech</h2>
            <p className="section-subtitle">
              Performance and reliability at the core
            </p>
          </div>
          <div className="tech-grid">
            {TECH.map((t) => (
              <div key={t.name} className="tech-card" style={{ '--tech-color': t.color }}>
                <t.icon size={36} className="tech-icon" />
                <h3 className="tech-name">{t.name}</h3>
                <p className="tech-desc">{t.desc}</p>
              </div>
            ))}
          </div>
          <div className="tech-cta">
            <a
              href="https://github.com/MathieuAudibert/leboncours"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline btn--lg"
            >
              <FaGithub size={18} />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section about-cta">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Join the community</h2>
            <p className="cta-subtitle">
              Whether you want to learn a new skill or share your expertise,
              leboncours is the place for you.
            </p>
            <div className="cta-actions">
              <button className="btn btn--primary btn--lg">
                Get Started
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
