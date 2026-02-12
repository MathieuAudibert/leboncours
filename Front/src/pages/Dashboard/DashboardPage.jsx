import { memo, useMemo, useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  ChevronRight,
  ArrowRight,
  Video,
  CheckCircle,
} from 'lucide-react';
import { MdSchool } from 'react-icons/md';
import { GoVerified } from 'react-icons/go';
import { useAuth } from '../../context/AuthContext';
import DashboardCharts from '../../components/DashboardCharts/DashboardCharts';
import { fetchDashboardData, buildStats } from '../../helpers/dashboardHelpers';

const ICON_MAP = { BookOpen, Calendar, Clock, Star, TrendingUp, CheckCircle };

const StateTag = memo(function StateTag({ state }) {
  const cls = state === 'Confirmed' ? 'dash-state--confirmed' :
    state === 'Pending' ? 'dash-state--pending' :
      state === 'Canceled' ? 'dash-state--canceled' : '';
  return <span className={`dash-state ${cls}`}>{state}</span>;
});

const DashboardPage = memo(function DashboardPage() {
  const { user, token } = useAuth();
  const isTeacher = user?.role === 'Teacher';

  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    fetchDashboardData(user, token, isTeacher)
      .then((data) => {
        if (cancelled) return;
        setUpcomingSessions(data.sessionsList);
        setMyCourses(data.myCourses);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user, token, isTeacher]);

  const stats = useMemo(() => {
    return buildStats(isTeacher, myCourses, upcomingSessions).map((s) => ({
      ...s,
      icon: ICON_MAP[s.icon] || BookOpen,
    }));
  }, [isTeacher, myCourses, upcomingSessions]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="dash-page">
      <div className="container">
        {/* Welcome Header */}
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

        {/* Quick Stats */}
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

        {/* Charts */}
        <DashboardCharts isTeacher={isTeacher} sessions={upcomingSessions} courses={myCourses} />

        <div className="dash-grid">
          {/* LEFT COLUMN */}
          <div className="dash-main">
            {/* Upcoming Sessions */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <Calendar size={18} />
                  Sessions
                </h2>
                <span className="dash-card-count">{upcomingSessions.length}</span>
              </div>
              {loading ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>Loading...</p>
              ) : (
                <div className="dash-sessions-list">
                  {upcomingSessions.map((session) => {
                    const d = session.dates ? new Date(session.dates) : null;
                    return (
                      <div className="dash-session-row" key={session.id}>
                        <div className="dash-session-date-block">
                          <span className="dash-session-day">{d ? d.getDate() : '—'}</span>
                          <span className="dash-session-month">{d ? d.toLocaleString('en', { month: 'short' }) : ''}</span>
                        </div>
                        <div className="dash-session-info">
                          <span className="dash-session-subject">{session.subject}</span>
                          <span className="dash-session-meta">
                            {session.personLabel}: {session.personName}
                            {d ? ` · ${d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}` : ''}
                            {session.level ? ` · ${session.level}` : ''}
                          </span>
                        </div>
                        <StateTag state={session.state} />
                        <button className="dash-session-join-btn" title="Join session">
                          <Video size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {!loading && upcomingSessions.length === 0 && (
                <p className="dash-empty">No sessions yet. <Link to="/courses">Browse courses</Link></p>
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

              {loading ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>Loading...</p>
              ) : (
                <div className="dash-courses-list">
                  {myCourses.length === 0 ? (
                    <p className="dash-empty">No courses yet. <Link to="/courses">Browse courses</Link></p>
                  ) : myCourses.map((course) => (
                    <div className="dash-course-row" key={course.id}>
                      <div className="dash-course-icon-wrap">
                        {isTeacher ? <MdSchool size={20} /> : <BookOpen size={20} />}
                      </div>
                      <div className="dash-course-info">
                        <span className="dash-course-name">{course.subject}</span>
                        <span className="dash-course-meta">
                          {course.teacher ? `${course.teacher} · ` : ''}€{course.hourly_price}/hr
                          {course.level ? ` · ${course.level}` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <aside>
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
                  const now = new Date();
                  const mondayOffset = (now.getDay() + 6) % 7;
                  const monday = new Date(now);
                  monday.setDate(now.getDate() - mondayOffset);
                  const targetDate = new Date(monday);
                  targetDate.setDate(monday.getDate() + i);
                  const hasSessions = upcomingSessions.some((s) => {
                    if (!s.dates) return false;
                    const sd = new Date(s.dates);
                    return sd.toDateString() === targetDate.toDateString();
                  });
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
