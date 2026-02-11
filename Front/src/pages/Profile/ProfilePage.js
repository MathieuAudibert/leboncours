import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Mail,
  Star,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Edit3,
  Settings,
  Award,
  ChevronRight,
} from 'lucide-react';
import { MdVerified } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

/* ═══════════════════════════════════════
   MOCK DATA matching the user roles
   ═══════════════════════════════════════ */
const STUDENT_COURSES = [
  { id: 1, name: 'React & TypeScript', teacher: 'Lucas B.', price: '€50/hr' },
  { id: 2, name: 'French for Beginners', teacher: 'Pierre D.', price: '€20/hr' },
  { id: 3, name: 'Calculus I & II', teacher: 'Marie C.', price: '€35/hr' },
];

const TEACHER_COURSES = [
  { id: 1, name: 'React & TypeScript', students: 156, price: '€50/hr' },
  { id: 2, name: 'Algorithms & Data Structures', students: 143, price: '€48/hr' },
];

const STUDENT_SESSIONS = [
  { id: 1, subject: 'React & TypeScript', with: 'Lucas B.', date: 'Feb 12, 2026', time: '10:00', state: 'Confirmed' },
  { id: 2, subject: 'French for Beginners', with: 'Pierre D.', date: 'Feb 14, 2026', time: '14:30', state: 'Pending' },
  { id: 3, subject: 'Calculus I & II', with: 'Marie C.', date: 'Feb 16, 2026', time: '09:00', state: 'Confirmed' },
];

const TEACHER_SESSIONS = [
  { id: 1, subject: 'React & TypeScript', with: 'Emma L.', date: 'Feb 12, 2026', time: '10:00', state: 'Confirmed' },
  { id: 2, subject: 'React & TypeScript', with: 'Thomas R.', date: 'Feb 13, 2026', time: '15:00', state: 'Pending' },
  { id: 3, subject: 'Algorithms & DS', with: 'Sarah K.', date: 'Feb 15, 2026', time: '11:30', state: 'Confirmed' },
];

const REVIEWS = [
  { id: 1, author: 'Emma L.', rating: 5, text: 'Excellent explanation of React hooks. Very patient and clear!', date: '2 days ago' },
  { id: 2, author: 'Thomas R.', rating: 5, text: 'Great session on TypeScript generics. Would book again.', date: '1 week ago' },
];

/* ═══════════════════════════════════════
   PROFILE PAGE
   ═══════════════════════════════════════ */
const ProfilePage = memo(function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const isTeacher = user.role === 'Teacher';
  const courses = isTeacher ? TEACHER_COURSES : STUDENT_COURSES;
  const sessions = isTeacher ? TEACHER_SESSIONS : STUDENT_SESSIONS;

  return (
    <div className="profile-page">
      <div className="container">
        {/* ── Header / Cover ── */}
        <div className="profile-cover">
          <div className="profile-cover-bg profile-cover-bg--filled" />
          <div className="profile-avatar-wrap">
            <div className="profile-avatar profile-avatar--filled">
              {user.firstname[0]}{user.name[0]}
            </div>
            <div className="profile-avatar-badge">
              <MdVerified size={18} />
            </div>
          </div>
        </div>

        <div className="profile-layout">
          {/* ── Sidebar ── */}
          <aside className="profile-sidebar">
            {/* Identity card */}
            <div className="profile-card">
              <div className="profile-name-row">
                <h2 className="profile-real-name">{user.firstname} {user.name}</h2>
                <button className="profile-edit-btn" title="Edit profile">
                  <Edit3 size={15} />
                </button>
              </div>
              <span className="profile-role-tag">{user.role}</span>

              <div className="profile-meta">
                <div className="profile-meta-item">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </div>
                <div className="profile-meta-item">
                  <MapPin size={14} />
                  <span>{user.location}</span>
                </div>
                <div className="profile-meta-item">
                  <Calendar size={14} />
                  <span>Joined {new Date(user.joinedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="profile-bio">
                <p className="profile-bio-text">{user.bio}</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="profile-card">
              <h3 className="profile-card-title">Overview</h3>
              <div className="profile-stat-grid">
                <div className="profile-stat-item">
                  <div className="profile-stat-icon-wrap">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <span className="profile-stat-value">{user.stats.courses}</span>
                    <span className="profile-stat-label">Courses</span>
                  </div>
                </div>
                <div className="profile-stat-item">
                  <div className="profile-stat-icon-wrap">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="profile-stat-value">{user.stats.hours}h</span>
                    <span className="profile-stat-label">Hours</span>
                  </div>
                </div>
                <div className="profile-stat-item">
                  <div className="profile-stat-icon-wrap">
                    <Star size={18} />
                  </div>
                  <div>
                    <span className="profile-stat-value">{user.stats.rating}</span>
                    <span className="profile-stat-label">Rating</span>
                  </div>
                </div>
                <div className="profile-stat-item">
                  <div className="profile-stat-icon-wrap">
                    <Award size={18} />
                  </div>
                  <div>
                    <span className="profile-stat-value">{user.stats.reviews}</span>
                    <span className="profile-stat-label">Reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings link */}
            <button className="profile-settings-btn">
              <Settings size={16} />
              <span>Account Settings</span>
              <ChevronRight size={16} className="profile-settings-chevron" />
            </button>
          </aside>

          {/* ── Main content ── */}
          <div className="profile-main">
            {/* Courses */}
            <div className="profile-card">
              <h3 className="profile-card-title">
                <BookOpen size={18} />
                {isTeacher ? 'Teaching Courses' : 'Enrolled Courses'}
              </h3>
              <div className="profile-courses-list">
                {courses.map((c) => (
                  <div className="profile-course-row" key={c.id}>
                    <div className="profile-course-icon profile-course-icon--filled">
                      <BookOpen size={18} />
                    </div>
                    <div className="profile-course-info">
                      <span className="profile-course-name">{c.name}</span>
                      <span className="profile-course-meta">
                        {isTeacher ? `${c.students} students` : c.teacher} · {c.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="profile-card">
              <h3 className="profile-card-title">
                <Calendar size={18} />
                Upcoming Sessions
              </h3>
              <div className="profile-sessions-list">
                {sessions.map((s) => (
                  <div className="profile-session-row" key={s.id}>
                    <div className="profile-session-date-block">
                      <span className="profile-session-day">{s.date.split(' ')[1].replace(',', '')}</span>
                      <span className="profile-session-month">{s.date.split(' ')[0]}</span>
                    </div>
                    <div className="profile-session-info">
                      <span className="profile-session-subject">{s.subject}</span>
                      <span className="profile-session-meta">with {s.with} · {s.time}</span>
                    </div>
                    <span className={`profile-session-state profile-session-state--${s.state.toLowerCase()}`}>
                      {s.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="profile-card">
              <h3 className="profile-card-title">
                <Star size={18} />
                Recent Reviews
              </h3>
              <div className="profile-reviews-list">
                {REVIEWS.map((r) => (
                  <div className="profile-review-row" key={r.id}>
                    <div className="profile-review-avatar">
                      {r.author.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div className="profile-review-body">
                      <div className="profile-review-header">
                        <span className="profile-review-author">{r.author}</span>
                        <span className="profile-review-date">{r.date}</span>
                      </div>
                      <div className="profile-review-stars">
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </div>
                      <p className="profile-review-text">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProfilePage;
