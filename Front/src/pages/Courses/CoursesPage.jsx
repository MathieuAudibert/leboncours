import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  BookOpen,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Info,
  X,
  User,
  Calendar,
  Clock,
  Euro,
  MessageSquare,
  CheckCircle,
  LogIn,
  Plus,
  FileText,
  GraduationCap,
  Tag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  apiListCourses,
  apiCreateCourse,
  apiListTeacherCourses,
  apiCreateTeacherCourse,
  apiListUsers,
  apiCreateEventCourse,
} from '../../api';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

function SubjectRenderer({ data }) {
  return (
    <span className="courses-subject-row">
      <span className="courses-subject-name">{data.subject}</span>
      {data.description && (
        <span className="courses-info-trigger" title={data.description}>
          <Info size={15} className="courses-info-icon" />
        </span>
      )}
    </span>
  );
}

function TeacherRenderer({ value }) {
  if (!value) return <span className="courses-teacher"><span className="courses-teacher-name">—</span></span>;
  const initials = value.split(' ').map(w => w[0]).join('');
  return (
    <span className="courses-teacher">
      <span className="courses-teacher-avatar">{initials}</span>
      <span className="courses-teacher-name">{value}</span>
    </span>
  );
}

function LevelRenderer({ value }) {
  const levelClass = value
    ? `courses-level courses-level--${value.toLowerCase()}`
    : 'courses-level';
  return <span className={levelClass}>{value || '—'}</span>;
}

function PriceRenderer({ value }) {
  return <span className="courses-price">€{value}/hr</span>;
}

function DescriptionRenderer({ value }) {
  return <span className="courses-description">{value || '—'}</span>;
}

function CreateCourseModal({ onClose, onCreated }) {
  const [subject, setSubject] = useState('');
  const [hourlyPrice, setHourlyPrice] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [description, setDescription] = useState('');
  const [created, setCreated] = useState(false);

  const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

  const canSubmit = subject.trim().length > 0 && hourlyPrice && Number(hourlyPrice) > 0;

  const handleCreate = () => {
    const newCourse = {
      subject: subject.trim(),
      hourly_price: Number(hourlyPrice),
      level,
      description: description.trim() || null,
    };
    onCreated(newCourse);
    setCreated(true);
    setTimeout(() => {
      setCreated(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div className="booking-modal create-course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="booking-close" onClick={onClose}>
          <X size={20} />
        </button>

        {created ? (
          <div className="booking-success">
            <div className="booking-success-icon">
              <CheckCircle size={48} />
            </div>
            <h3>Course Created!</h3>
            <p>Your new course has been added to the catalog.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="booking-header">
              <div className="booking-badges">
                <span className="courses-category-badge">
                  <GraduationCap size={12} />
                  Teacher
                </span>
              </div>
              <h2 className="booking-title">Create a New Course</h2>
              <p className="booking-desc">Fill in the details below to publish your course on LeBonCours.</p>
            </div>

            {/* Form */}
            <div className="booking-form">
              <div className="booking-field">
                <label className="booking-label">
                  <BookOpen size={14} />
                  Subject *
                </label>
                <input
                  type="text"
                  className="booking-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. React & TypeScript"
                  maxLength={255}
                />
              </div>

              <div className="booking-field-row">
                <div className="booking-field">
                  <label className="booking-label">
                    <Euro size={14} />
                    Hourly Price (€) *
                  </label>
                  <input
                    type="number"
                    className="booking-input"
                    value={hourlyPrice}
                    onChange={(e) => setHourlyPrice(e.target.value)}
                    placeholder="e.g. 35"
                    min={1}
                    max={500}
                  />
                </div>
                <div className="booking-field">
                  <label className="booking-label">
                    <Tag size={14} />
                    Level
                  </label>
                  <select
                    className="booking-input create-course-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="booking-field">
                <label className="booking-label">
                  <FileText size={14} />
                  Description (optional)
                </label>
                <textarea
                  className="booking-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what students will learn..."
                  rows={3}
                />
              </div>
            </div>

            {/* Preview */}
            {subject && (
              <div className="create-course-preview">
                <span className="create-course-preview-label">Preview</span>
                <div className="create-course-preview-row">
                  <span className={`courses-level courses-level--${level.toLowerCase()}`}>{level}</span>
                  <span className="courses-price">€{hourlyPrice || 0}/hr</span>
                </div>
                <span className="create-course-preview-subject">{subject}</span>
                {description && <span className="create-course-preview-desc">{description}</span>}
              </div>
            )}

            {/* Actions */}
            <div className="booking-actions">
              <button className="btn btn--outline booking-cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn--primary booking-book-btn"
                onClick={handleCreate}
                disabled={!canSubmit}
              >
                <Plus size={16} />
                Create Course
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BookingModal({ course, onClose, onBooked }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(' PM');
  const [message, setMessage] = useState('');
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    if (onBooked) onBooked(course, selectedDate, selectedTime, message);
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="booking-close" onClick={onClose}>
          <X size={20} />
        </button>

        {booked ? (
          <div className="booking-success">
            <div className="booking-success-icon">
              <CheckCircle size={48} />
            </div>
            <h3>Session Booked!</h3>
            <p>Your booking request has been sent.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="booking-header">
              <div className="booking-badges">
                {course.level && (
                  <span className={`courses-level courses-level--${course.level.toLowerCase()}`}>
                    {course.level}
                  </span>
                )}
              </div>
              <h2 className="booking-title">{course.subject}</h2>
              <p className="booking-desc">{course.description || 'No description available.'}</p>
            </div>

            {/* Course details */}
            <div className="booking-details">
              {course.teacher && (
                <div className="booking-detail">
                  <User size={16} />
                  <span className="booking-detail-label">Teacher</span>
                  <span className="booking-detail-value">{course.teacher}</span>
                </div>
              )}
              <div className="booking-detail">
                <Euro size={16} />
                <span className="booking-detail-label">Price</span>
                <span className="booking-detail-value booking-price">€{course.hourly_price}/hr</span>
              </div>
            </div>

            {/* Booking form */}
            <div className="booking-form">
              <div className="booking-field-row">
                <div className="booking-field">
                  <label className="booking-label">
                    <Calendar size={14} />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    className="booking-input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="booking-field">
                  <label className="booking-label">
                    <Clock size={14} />
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    className="booking-input"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="booking-field">
                <label className="booking-label">
                  <MessageSquare size={14} />
                  Message (optional)
                </label>
                <textarea
                  className="booking-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any notes for the teacher..."
                  rows={3}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="booking-actions">
              <button className="btn btn--outline booking-cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn--primary booking-book-btn"
                onClick={handleBook}
                disabled={!selectedDate || !selectedTime}
              >
                <Calendar size={16} />
                Book Session
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CoursesPage() {
  const { user, token } = useAuth();
  const isTeacher = user?.role === 'Teacher';
  const isLogin = !!user;
  const gridRef = useRef(null);
  const [quickFilter, setQuickFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  /* Fetch courses + teacher-courses + teacher users, then join client-side */
  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [coursesRes, tcRes, teachersRes] = await Promise.all([
          apiListCourses({ per_page: 100 }),
          apiListTeacherCourses({ per_page: 100 }, token).catch(() => ({ data: [] })),
          apiListUsers({ role: 'Teacher', per_page: 100 }, token).catch(() => ({ data: [] })),
        ]);

        if (cancelled) return;

        const teacherMap = {};
        (teachersRes.data || []).forEach((t) => {
          teacherMap[t.id] = `${t.firstname} ${t.name}`;
        });

        const courseTeacherMap = {};
        (tcRes.data || []).forEach((tc) => {
          if (tc.course_id && tc.teacher_id) {
            courseTeacherMap[tc.course_id] = teacherMap[tc.teacher_id] || null;
          }
        });

        const enriched = (coursesRes.data || []).map((c) => ({
          ...c,
          teacher: courseTeacherMap[c.id] || null,
        }));

        setCourses(enriched);
      } catch {
        if (!cancelled) setCourses([]);
      } finally {
        if (!cancelled) setLoadingCourses(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [token]);

  const handleCourseCreated = useCallback(async (newCourseData) => {
    try {
      const created = await apiCreateCourse(
        {
          subject: newCourseData.subject,
          hourly_price: newCourseData.hourly_price,
          level: newCourseData.level,
          description: newCourseData.description,
        },
        token,
      );
      // Also create teacher-course link
      if (user?.id && created?.id) {
        await apiCreateTeacherCourse({ teacher_id: user.id, course_id: created.id }, token).catch(() => { });
      }
      const enriched = { ...created, teacher: `${user.firstname} ${user.name}` };
      setCourses((prev) => [enriched, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [token, user]);

  const handleBookSession = useCallback(async (course, date, time, _message) => {
    if (!user?.id || !course?.id) return;
    try {
      const dates = `${date}T${time}:00`;
      await apiCreateEventCourse({ student_id: user.id, course_id: course.id, dates, state: 'Pending' }, token);
    } catch {
      /* silently fail — booking modal already shows success */
    }
  }, [user, token]);

  const columnDefs = useMemo(() => [
    {
      headerName: 'Subject',
      field: 'subject',
      flex: 2.5,
      minWidth: 260,
      filter: 'agTextColumnFilter',
      cellRenderer: SubjectRenderer,
      cellStyle: { overflow: 'visible' },
      tooltipValueGetter: (params) => params.data.description,
    },
    {
      headerName: 'Teacher',
      field: 'teacher',
      flex: 1,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      cellRenderer: TeacherRenderer,
    },
    {
      headerName: 'Level',
      field: 'level',
      width: 145,
      filter: 'agTextColumnFilter',
      cellRenderer: LevelRenderer,
    },
    {
      headerName: 'Price',
      field: 'hourly_price',
      width: 120,
      filter: 'agNumberColumnFilter',
      cellRenderer: PriceRenderer,
      sort: 'asc',
    },
    {
      headerName: 'Description',
      field: 'description',
      flex: 2,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      cellRenderer: DescriptionRenderer,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: showFilters,
    suppressHeaderMenuButton: false,
  }), [showFilters]);

  const handleQuickFilterChange = useCallback((e) => {
    setQuickFilter(e.target.value);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Stats derived from real data
  const stats = useMemo(() => {
    if (courses.length === 0) return { total: 0, avgPrice: 0, levels: 0 };
    return {
      total: courses.length,
      avgPrice: Math.round(courses.reduce((s, c) => s + c.hourly_price, 0) / courses.length),
      levels: [...new Set(courses.map(c => c.level).filter(Boolean))].length,
    };
  }, [courses]);

  return (
    <div className="courses-page">
      <div className="container">
        {/* Header */}
        <div className="courses-header">
          <div className="courses-header-text">
            <div className="badge">
              <BookOpen size={14} />
              <span>All Courses</span>
            </div>
            <h1 className="courses-title">Browse Courses</h1>
            <p className="courses-subtitle">
              Explore {stats.total} courses across {stats.levels} levels — find the perfect mentor for you.
            </p>
          </div>

          <div className="courses-stats-row">
            <div className="courses-stat-chip">
              <span className="courses-stat-chip-value">{stats.total}</span>
              <span className="courses-stat-chip-label">Courses</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="courses-toolbar">
          <div className="courses-search-wrap">
            <Search size={18} className="courses-search-icon" />
            <input
              type="text"
              placeholder="Quick search across all columns..."
              className="courses-search-input"
              value={quickFilter}
              onChange={handleQuickFilterChange}
            />
          </div>

          <div className="courses-toolbar-actions">
            {isTeacher && (
              <button
                className="courses-toolbar-btn courses-toolbar-btn--create"
                onClick={() => setShowCreateModal(true)}
                title="Create a new course"
              >
                <Plus size={16} />
                <span>New Course</span>
              </button>
            )}
            <button
              className={`courses-toolbar-btn ${showFilters ? 'courses-toolbar-btn--active' : ''}`}
              onClick={toggleFilters}
              title="Toggle column filters"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* AG Grid */}
        <div className="courses-grid-wrapper ag-theme-quartz">
          <AgGridReact
            ref={gridRef}
            rowData={courses}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilterText={quickFilter}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            domLayout="autoHeight"
            rowHeight={64}
            rowSelection="single"
            animateRows={true}
            enableCellTextSelection={true}
            suppressMovableColumns={false}
            tooltipShowDelay={0}
            tooltipHideDelay={3000}
            onRowClicked={(e) => setSelectedCourse(e.data)}
          />
        </div>

        {/* Footer note */}
        {loadingCourses && (
          <p className="courses-footer-note">
            <RotateCcw size={14} />
            <span>Loading courses from the backend...</span>
          </p>
        )}
        {!loadingCourses && courses.length === 0 && (
          <p className="courses-footer-note">
            <RotateCcw size={14} />
            <span>No courses found. Make sure the backend is running on port 3001.</span>
          </p>
        )}
      </div>

      {/* Booking Modal */}
      {selectedCourse && (
        isLogin ? (
          <BookingModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
            onBooked={handleBookSession}
          />
        ) : (
          <div className="booking-overlay">
            <div className="booking-modal" >
              <div className="booking-header" style={{ textAlign: 'center' }}>
                <h2 className="booking-title">You're not logged in</h2>
                <p className="booking-desc">Please log in or create an account to book a session.</p>
              </div>
              <div className="booking-actions">
                <button className="btn btn--outline booking-cancel-btn" onClick={() => setSelectedCourse(null)}>
                  Cancel
                </button>
                <Link to="/login" className="btn btn--primary booking-book-btn">
                  <LogIn size={16} />
                  Log in
                </Link>
              </div>
            </div>
          </div>
        )
      )}

      {/* Create Course Modal (Teachers only) */}
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCourseCreated}
        />
      )}
    </div>
  );
}

export default CoursesPage;
