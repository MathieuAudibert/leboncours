import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Mail,
  BookOpen,
  Calendar,
  Clock,
  Edit3,
  X,
} from 'lucide-react';
import { MdVerified } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import {
  apiListCourses,
  apiListTeacherCourses,
  apiListEventCourses,
  apiListUsers,
} from '../../api';

const EmptyState = ({ loading, label }) => (
  <p style={{ color: '#9CA3AF', padding: '1rem 0' }}>
    {loading ? `Loading ${label}...` : `No ${label} yet.`}
  </p>
);

function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ firstname: '', name: '', email: '' });
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const isTeacher = user.role === 'Teacher';

    async function fetchData() {
      try {
        const [coursesRes, usersRes] = await Promise.all([
          apiListCourses({ per_page: 100 }),
          apiListUsers({ per_page: 100 }, token).catch(() => ({ data: [] })),
        ]);

        const courseMap = {};
        (coursesRes.data || []).forEach((c) => { courseMap[c.id] = c; });
        const userMap = {};
        (usersRes.data || []).forEach((u) => { userMap[u.id] = u; });

        if (isTeacher) {
          /* Teacher: courses via teacher-courses, sessions via event-courses on those courses */
          const tcRes = await apiListTeacherCourses({ teacher_id: user.id, per_page: 100 }, token).catch(() => ({ data: [] }));
          const teacherCourseIds = (tcRes.data || []).map((tc) => tc.course_id).filter(Boolean);
          const myCourses = teacherCourseIds.map((cid) => courseMap[cid]).filter(Boolean);
          if (!cancelled) setCourses(myCourses);

          /* Sessions for teacher: event-courses on courses I teach */
          const allEvents = await apiListEventCourses({ per_page: 100 }, token).catch(() => ({ data: [] }));
          const mySessions = (allEvents.data || [])
            .filter((ev) => teacherCourseIds.includes(ev.course_id))
            .map((ev) => ({
              ...ev,
              courseName: courseMap[ev.course_id]?.subject || 'Unknown',
              withName: userMap[ev.student_id]
                ? `${userMap[ev.student_id].firstname} ${userMap[ev.student_id].name}`
                : 'Student',
            }));
          if (!cancelled) setSessions(mySessions);
        } else {
          /* Student: sessions via event-courses where student_id = me */
          const evRes = await apiListEventCourses({ student_id: user.id, per_page: 100 }, token).catch(() => ({ data: [] }));
          const events = evRes.data || [];

          /* Resolve course names and teacher names */
          const tcRes = await apiListTeacherCourses({ per_page: 100 }, token).catch(() => ({ data: [] }));
          const courseTeacherMap = {};
          (tcRes.data || []).forEach((tc) => {
            if (tc.course_id && tc.teacher_id) {
              courseTeacherMap[tc.course_id] = userMap[tc.teacher_id]
                ? `${userMap[tc.teacher_id].firstname} ${userMap[tc.teacher_id].name}`
                : null;
            }
          });

          const myCourseIds = [...new Set(events.map((e) => e.course_id).filter(Boolean))];
          const myCourses = myCourseIds.map((cid) => ({
            ...courseMap[cid],
            teacher: courseTeacherMap[cid] || null,
          })).filter((c) => c.id);
          if (!cancelled) setCourses(myCourses);

          const mySessions = events.map((ev) => ({
            ...ev,
            courseName: courseMap[ev.course_id]?.subject || 'Unknown',
            withName: courseTeacherMap[ev.course_id] || 'Teacher',
          }));
          if (!cancelled) setSessions(mySessions);
        }
      } catch {
        /* silently fail */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [user, token]);

  if (!user) return <Navigate to="/login" replace />;

  const isTeacher = user.role === 'Teacher';

  return (
    <div className="profile-page">
      <div className="container">
        {/* ── Header / Cover ── */}
        <div className="profile-cover">
          <div className="profile-cover-bg profile-cover-bg--filled" />
          <div className="profile-avatar-wrap">
            <div className="profile-avatar profile-avatar--filled">
              {user.firstname?.[0]}{user.name?.[0]}
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
                <button
                  className="profile-edit-btn"
                  title="Edit profile"
                  onClick={() => {
                    setEditForm({ firstname: user.firstname || '', name: user.name || '', email: user.email || '' });
                    setEditError('');
                    setShowEdit(true);
                  }}
                >
                  <Edit3 size={15} />
                </button>
              </div>
              <span className="profile-role-tag">{user.role}</span>

              <div className="profile-meta">
                <div className="profile-meta-item">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            {/* Quick stats — derived from real data */}
            <div className="profile-card">
              <h3 className="profile-card-title">Overview</h3>
              <div className="profile-stat-grid">
                <div className="profile-stat-item">
                  <div className="profile-stat-icon-wrap">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <span className="profile-stat-value">{courses.length}</span>
                    <span className="profile-stat-label">{isTeacher ? 'Teaching' : 'Enrolled'}</span>
                  </div>
                </div>
                <div className="profile-stat-item">
                  <div className="profile-stat-icon-wrap">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="profile-stat-value">{sessions.length}</span>
                    <span className="profile-stat-label">Sessions</span>
                  </div>
                </div>
                <div className="profile-stat-item">
                  <div className="profile-stat-icon-wrap">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="profile-stat-value">
                      {sessions.filter((s) => s.state === 'Confirmed').length}
                    </span>
                    <span className="profile-stat-label">Confirmed</span>
                  </div>
                </div>
              </div>
            </div>

          </aside>

          {/* ── Main content ── */}
          <div className="profile-main">
              <>
                {/* Courses */}
                <div className="profile-card">
                  <h3 className="profile-card-title">
                    <BookOpen size={18} />
                    {isTeacher ? 'Teaching Courses' : 'Enrolled Courses'}
                  </h3>
                  <div className="profile-courses-list">
                    {courses.length === 0 ? (
                      <EmptyState loading={loading} label="courses" />
                    ) : courses.map((c) => (
                      <div className="profile-course-row" key={c.id}>
                        <div className="profile-course-icon profile-course-icon--filled">
                          <BookOpen size={18} />
                        </div>
                        <div className="profile-course-info">
                          <span className="profile-course-name">{c.subject}</span>
                          <span className="profile-course-meta">
                            {c.teacher ? `${c.teacher} · ` : ''}€{c.hourly_price}/hr
                            {c.level ? ` · ${c.level}` : ''}
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
                    Sessions
                  </h3>
                  <div className="profile-sessions-list">
                    {sessions.length === 0 ? (
                      <EmptyState loading={loading} label="sessions" />
                    ) : sessions.map((s) => {
                      const d = s.dates ? new Date(s.dates) : null;
                      return (
                        <div className="profile-session-row" key={s.id}>
                          <div className="profile-session-date-block">
                            <span className="profile-session-day">{d ? d.getDate() : '—'}</span>
                            <span className="profile-session-month">
                              {d ? d.toLocaleString('en', { month: 'short' }) : ''}
                            </span>
                          </div>
                          <div className="profile-session-info">
                            <span className="profile-session-subject">{s.courseName}</span>
                            <span className="profile-session-meta">
                              with {s.withName}
                              {d ? ` · ${d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}` : ''}
                            </span>
                          </div>
                          <span className={`profile-session-state profile-session-state--${(s.state || '').toLowerCase()}`}>
                            {s.state || 'Unknown'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
          </div>
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      {showEdit && (
        <div className="profile-modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Edit Profile</h3>
              <button className="profile-modal-close" onClick={() => setShowEdit(false)}>
                <X size={18} />
              </button>
            </div>

            <form
              className="profile-modal-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setEditError('');
                try {
                  await updateUser(editForm);
                  setShowEdit(false);
                } catch (err) {
                  setEditError(err.message || 'Update failed.');
                } finally {
                  setSaving(false);
                }
              }}
            >
              <label className="profile-modal-label">
                First name
                <input
                  className="profile-modal-input"
                  value={editForm.firstname}
                  onChange={(e) => setEditForm((f) => ({ ...f, firstname: e.target.value }))}
                  required
                />
              </label>
              <label className="profile-modal-label">
                Last name
                <input
                  className="profile-modal-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </label>
              <label className="profile-modal-label">
                Email
                <input
                  className="profile-modal-input"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </label>

              {editError && <p className="profile-modal-error">{editError}</p>}

              <button className="profile-modal-submit" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
