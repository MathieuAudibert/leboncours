import React, { memo, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Clock,
  Star,
  Users,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  ArrowRight,
  Bell,
  Video,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { MdSchool } from 'react-icons/md';
import { GoVerified } from 'react-icons/go';
import { useAuth } from '../../context/AuthContext';

/* ═══════════════════════════════════════
   MOCK DATA — would come from backend
   ═══════════════════════════════════════ */

/* Simulated user — change role to 'Teacher' to preview teacher dashboard */
/* (Now uses AuthContext — MOCK_USER kept as fallback) */

const UPCOMING_SESSIONS_STUDENT = [
  { id: 1, subject: 'React & TypeScript', teacher: 'Lucas B.', date: '2026-02-12', time: '10:00', state: 'Confirmed', level: 'Intermediate' },
  { id: 2, subject: 'French for Beginners', teacher: 'Pierre D.', date: '2026-02-14', time: '14:30', state: 'Pending', level: 'Beginner' },
  { id: 3, subject: 'Calculus I & II', teacher: 'Marie C.', date: '2026-02-16', time: '09:00', state: 'Confirmed', level: 'Intermediate' },
];

const UPCOMING_SESSIONS_TEACHER = [
  { id: 1, subject: 'React & TypeScript', student: 'Emma L.', date: '2026-02-12', time: '10:00', state: 'Confirmed', level: 'Intermediate' },
  { id: 2, subject: 'React & TypeScript', student: 'Thomas R.', date: '2026-02-13', time: '15:00', state: 'Pending', level: 'Intermediate' },
  { id: 3, subject: 'Algorithms & Data Structures', student: 'Sarah K.', date: '2026-02-15', time: '11:30', state: 'Confirmed', level: 'Advanced' },
];

const ENROLLED_COURSES = [
  { id: 1, subject: 'React & TypeScript', teacher: 'Lucas B.', hourly_price: 50, progress: 60, rating: 4.9 },
  { id: 2, subject: 'French for Beginners', teacher: 'Pierre D.', hourly_price: 20, progress: 25, rating: 4.8 },
  { id: 3, subject: 'Calculus I & II', teacher: 'Marie C.', hourly_price: 35, progress: 10, rating: 4.6 },
];

const TEACHING_COURSES = [
  { id: 1, subject: 'React & TypeScript', students: 156, hourly_price: 50, rating: 4.9, sessions_this_week: 8 },
  { id: 2, subject: 'Algorithms & Data Structures', students: 143, hourly_price: 48, rating: 4.9, sessions_this_week: 5 },
];

const RECENT_MESSAGES = [
  { id: 1, sender: 'Lucas B.', preview: 'See you tomorrow for the TS session!', time: '2h ago' },
  { id: 2, sender: 'Pierre D.', preview: 'I sent you the materials for next class.', time: '5h ago' },
];

const NOTIFICATIONS = [
  { id: 1, text: 'Your session with Lucas B. is in 2 days.', type: 'reminder' },
  { id: 2, text: 'Pierre D. confirmed your booking.', type: 'success' },
];

/* ═══════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════ */
const StateTag = memo(function StateTag({ state }) {
  const cls = state === 'Confirmed' ? 'dash-state--confirmed' :
    state === 'Pending' ? 'dash-state--pending' :
    state === 'Canceled' ? 'dash-state--canceled' : '';
  return <span className={`dash-state ${cls}`}>{state}</span>;
});

/* ═══════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════ */
const DashboardPage = memo(function DashboardPage() {
  const { user } = useAuth();

  const isTeacher = user?.role === 'Teacher';

  const upcomingSessions = isTeacher ? UPCOMING_SESSIONS_TEACHER : UPCOMING_SESSIONS_STUDENT;

  const stats = useMemo(() => {
    if (isTeacher) {
      return [
        { icon: Users, value: TEACHING_COURSES.reduce((s, c) => s + c.students, 0), label: 'Total Students' },
        { icon: Calendar, value: TEACHING_COURSES.reduce((s, c) => s + c.sessions_this_week, 0), label: 'Sessions This Week' },
        { icon: Star, value: (TEACHING_COURSES.reduce((s, c) => s + c.rating, 0) / TEACHING_COURSES.length).toFixed(1), label: 'Avg. Rating' },
        { icon: TrendingUp, value: `€${TEACHING_COURSES.reduce((s, c) => s + c.hourly_price * c.sessions_this_week, 0)}`, label: 'Est. This Week' },
      ];
    }
    return [
      { icon: BookOpen, value: ENROLLED_COURSES.length, label: 'Enrolled Courses' },
      { icon: Calendar, value: upcomingSessions.filter(s => s.state === 'Confirmed').length, label: 'Upcoming Sessions' },
      { icon: Clock, value: '12h', label: 'Study Time' },
      { icon: Star, value: '4.8', label: 'Avg. Course Rating' },
    ];
  }, [isTeacher, upcomingSessions]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="dash-page">
      <div className="container">
        {/* ── Welcome Header ── */}
        <div className="dash-header">
          <div className="dash-header-text">
            <p className="dash-greeting">Welcome back,</p>
            <h1 className="dash-name">{user.firstname} {user.name}</h1>
            <div className="dash-role-tag">
              {isTeacher ? <MdSchool size={14} /> : <BookOpen size={14} />}
              <span>{user.role}</span>
              <GoVerified size={14} className="dash-verified" />
            </div>
          </div>
          <div className="dash-header-actions">
            <Link to="/courses" className="btn btn--outline dash-header-btn">
              <BookOpen size={16} />
              Browse Courses
            </Link>
            <Link to="/profile" className="btn btn--primary dash-header-btn">
              <ArrowRight size={16} />
              My Profile
            </Link>
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div className="dash-stats-row">
          {stats.map((s) => (
            <div className="dash-stat-card" key={s.label}>
              <div className="dash-stat-icon">
                <s.icon size={20} />
              </div>
              <div>
                <span className="dash-stat-value">{s.value}</span>
                <span className="dash-stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-grid">
          {/* ── LEFT COLUMN ── */}
          <div className="dash-main">
            {/* Upcoming Sessions */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <Calendar size={18} />
                  Upcoming Sessions
                </h2>
                <span className="dash-card-count">{upcomingSessions.length}</span>
              </div>
              <div className="dash-sessions-list">
                {upcomingSessions.map((session) => (
                  <div className="dash-session-row" key={session.id}>
                    <div className="dash-session-date-block">
                      <span className="dash-session-day">{new Date(session.date).getDate()}</span>
                      <span className="dash-session-month">{new Date(session.date).toLocaleString('en', { month: 'short' })}</span>
                    </div>
                    <div className="dash-session-info">
                      <span className="dash-session-subject">{session.subject}</span>
                      <span className="dash-session-meta">
                        {isTeacher ? `Student: ${session.student}` : `Teacher: ${session.teacher}`}
                        &nbsp;·&nbsp;{session.time}
                        &nbsp;·&nbsp;{session.level}
                      </span>
                    </div>
                    <StateTag state={session.state} />
                    <button className="dash-session-join-btn" title="Join session">
                      <Video size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {upcomingSessions.length === 0 && (
                <p className="dash-empty">No upcoming sessions. <Link to="/courses">Browse courses</Link></p>
              )}
            </div>

            {/* Courses */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <BookOpen size={18} />
                  {isTeacher ? 'My Teaching Courses' : 'Enrolled Courses'}
                </h2>
                <Link to="/courses" className="dash-card-link">
                  See all <ChevronRight size={14} />
                </Link>
              </div>

              {isTeacher ? (
                <div className="dash-courses-list">
                  {TEACHING_COURSES.map((course) => (
                    <div className="dash-course-row" key={course.id}>
                      <div className="dash-course-icon-wrap">
                        <MdSchool size={20} />
                      </div>
                      <div className="dash-course-info">
                        <span className="dash-course-name">{course.subject}</span>
                        <span className="dash-course-meta">
                          {course.students} students · €{course.hourly_price}/hr · {course.sessions_this_week} sessions/week
                        </span>
                      </div>
                      <div className="dash-course-rating">
                        <Star size={14} className="courses-rating-star" />
                        {course.rating}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dash-courses-list">
                  {ENROLLED_COURSES.map((course) => (
                    <div className="dash-course-row" key={course.id}>
                      <div className="dash-course-icon-wrap">
                        <BookOpen size={20} />
                      </div>
                      <div className="dash-course-info">
                        <span className="dash-course-name">{course.subject}</span>
                        <span className="dash-course-meta">
                          {course.teacher} · €{course.hourly_price}/hr
                        </span>
                        <div className="dash-progress-bar">
                          <div className="dash-progress-fill" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                      <span className="dash-course-progress-text">{course.progress}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN (Sidebar) ── */}
          <aside className="dash-sidebar">
            {/* Notifications */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <Bell size={18} />
                  Notifications
                </h2>
              </div>
              <div className="dash-notif-list">
                {NOTIFICATIONS.map((n) => (
                  <div className="dash-notif-row" key={n.id}>
                    <div className={`dash-notif-icon ${n.type === 'success' ? 'dash-notif-icon--success' : 'dash-notif-icon--reminder'}`}>
                      {n.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    </div>
                    <span className="dash-notif-text">{n.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <MessageSquare size={18} />
                  Messages
                </h2>
              </div>
              <div className="dash-messages-list">
                {RECENT_MESSAGES.map((msg) => (
                  <div className="dash-msg-row" key={msg.id}>
                    <div className="dash-msg-avatar">
                      {msg.sender.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div className="dash-msg-body">
                      <div className="dash-msg-header">
                        <span className="dash-msg-sender">{msg.sender}</span>
                        <span className="dash-msg-time">{msg.time}</span>
                      </div>
                      <span className="dash-msg-preview">{msg.preview}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Calendar */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <Clock size={18} />
                  This Week
                </h2>
              </div>
              <div className="dash-week-grid">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const hasSessions = [0, 2, 4].includes(i);
                  return (
                    <div className={`dash-week-day ${hasSessions ? 'dash-week-day--active' : ''}`} key={day}>
                      <span className="dash-week-label">{day}</span>
                      {hasSessions && <span className="dash-week-dot" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
});

export default DashboardPage;
