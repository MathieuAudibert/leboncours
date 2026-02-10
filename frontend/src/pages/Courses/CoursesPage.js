import React, { memo, useState, useCallback, useMemo, useRef } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  BookOpen,
  Search,
  SlidersHorizontal,
  Download,
  RotateCcw,
  Star,
  Users,
  Info,
} from 'lucide-react';
import { MdFilterListOff } from 'react-icons/md';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

/* ═══════════════════════════════════════
   MOCK DATA — matches DB schema (Courses + teacher join)
   ═══════════════════════════════════════ */
const MOCK_COURSES = [
  { id: 1, subject: 'Rust Systems Programming', hourly_price: 45, level: 'Advanced', description: 'Deep dive into ownership, lifetimes and systems-level Rust.', teacher: 'Alex M.', rating: 4.9, students: 87, category: 'Programming' },
  { id: 2, subject: 'Guitar & Music Theory', hourly_price: 25, level: 'Beginner', description: 'Learn chords, scales and music theory from scratch.', teacher: 'Sophie L.', rating: 4.7, students: 134, category: 'Music' },
  { id: 3, subject: 'French for Beginners', hourly_price: 20, level: 'Beginner', description: 'Conversational French with pronunciation focus.', teacher: 'Pierre D.', rating: 4.8, students: 210, category: 'Languages' },
  { id: 4, subject: 'Calculus I & II', hourly_price: 35, level: 'Intermediate', description: 'Limits, derivatives, integrals and series.', teacher: 'Marie C.', rating: 4.6, students: 98, category: 'Mathematics' },
  { id: 5, subject: 'React & TypeScript', hourly_price: 50, level: 'Intermediate', description: 'Build production-grade React apps with TypeScript.', teacher: 'Lucas B.', rating: 4.9, students: 156, category: 'Programming' },
  { id: 6, subject: 'Watercolor Painting', hourly_price: 30, level: 'Beginner', description: 'Techniques for landscape and portrait watercolors.', teacher: 'Emma R.', rating: 4.5, students: 63, category: 'Art' },
  { id: 7, subject: 'Organic Chemistry', hourly_price: 40, level: 'Advanced', description: 'Reactions, mechanisms and synthesis strategies.', teacher: 'Hugo T.', rating: 4.4, students: 45, category: 'Science' },
  { id: 8, subject: 'Python Data Science', hourly_price: 42, level: 'Intermediate', description: 'Pandas, NumPy, matplotlib and scikit-learn.', teacher: 'Léa F.', rating: 4.8, students: 201, category: 'Programming' },
  { id: 9, subject: 'Spanish Conversation', hourly_price: 22, level: 'Intermediate', description: 'Practice real-world Spanish dialogue and grammar.', teacher: 'Carlos G.', rating: 4.7, students: 178, category: 'Languages' },
  { id: 10, subject: 'Piano — Classical', hourly_price: 35, level: 'Intermediate', description: 'Classical repertoire from Bach to Chopin.', teacher: 'Julie P.', rating: 4.9, students: 92, category: 'Music' },
  { id: 11, subject: 'Machine Learning Fundamentals', hourly_price: 55, level: 'Advanced', description: 'Supervised & unsupervised learning, neural networks.', teacher: 'Nathan K.', rating: 4.8, students: 112, category: 'Programming' },
  { id: 12, subject: 'Yoga & Meditation', hourly_price: 18, level: 'Beginner', description: 'Hatha yoga basics and mindfulness meditation.', teacher: 'Clara V.', rating: 4.6, students: 245, category: 'Fitness' },
  { id: 13, subject: 'Linear Algebra', hourly_price: 38, level: 'Intermediate', description: 'Vectors, matrices, eigenvalues and applications.', teacher: 'Marie C.', rating: 4.7, students: 76, category: 'Mathematics' },
  { id: 14, subject: 'Digital Photography', hourly_price: 28, level: 'Beginner', description: 'Composition, lighting and post-processing essentials.', teacher: 'Thomas H.', rating: 4.5, students: 89, category: 'Art' },
  { id: 15, subject: 'German for Travelers', hourly_price: 24, level: 'Beginner', description: 'Essential German for travel and everyday situations.', teacher: 'Anna W.', rating: 4.6, students: 67, category: 'Languages' },
  { id: 16, subject: 'Algorithms & Data Structures', hourly_price: 48, level: 'Advanced', description: 'Sorting, graphs, dynamic programming and complexity.', teacher: 'Lucas B.', rating: 4.9, students: 143, category: 'Programming' },
  { id: 17, subject: 'Physics — Mechanics', hourly_price: 36, level: 'Intermediate', description: 'Newtonian mechanics, energy and rotational dynamics.', teacher: 'Hugo T.', rating: 4.5, students: 54, category: 'Science' },
  { id: 18, subject: 'Creative Writing', hourly_price: 26, level: 'Beginner', description: 'Short stories, character development and narrative voice.', teacher: 'Emma R.', rating: 4.7, students: 102, category: 'Art' },
  { id: 19, subject: 'Strength Training', hourly_price: 30, level: 'Intermediate', description: 'Programming, form and progressive overload principles.', teacher: 'Marc D.', rating: 4.6, students: 158, category: 'Fitness' },
  { id: 20, subject: 'Japanese — JLPT N5', hourly_price: 28, level: 'Beginner', description: 'Hiragana, katakana, basic kanji and grammar.', teacher: 'Yuki S.', rating: 4.8, students: 190, category: 'Languages' },
  { id: 21, subject: 'Docker & Kubernetes', hourly_price: 52, level: 'Advanced', description: 'Containerization, orchestration and cloud deployment.', teacher: 'Nathan K.', rating: 4.7, students: 88, category: 'Programming' },
  { id: 22, subject: 'Statistics & Probability', hourly_price: 34, level: 'Intermediate', description: 'Distributions, hypothesis testing and regression.', teacher: 'Marie C.', rating: 4.6, students: 71, category: 'Mathematics' },
  { id: 23, subject: 'Singing — Pop & Jazz', hourly_price: 32, level: 'Intermediate', description: 'Vocal technique, range and improvisation.', teacher: 'Sophie L.', rating: 4.8, students: 115, category: 'Music' },
  { id: 24, subject: 'Italian Cooking', hourly_price: 20, level: 'Beginner', description: 'Pasta, sauces and classic Italian home cooking.', teacher: 'Luca R.', rating: 4.9, students: 203, category: 'Other' },
];

/* ═══════════════════════════════════════
   CUSTOM CELL RENDERERS
   ═══════════════════════════════════════ */
function SubjectRenderer({ data }) {
  return (
    <span className="courses-subject-row">
      <span className="courses-subject-name">{data.subject}</span>
      <span className="courses-info-trigger" title={data.description}>
        <Info size={15} className="courses-info-icon" />
      </span>
    </span>
  );
}

function TeacherRenderer({ value }) {
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

function RatingRenderer({ value }) {
  return (
    <span className="courses-rating">
      <Star size={14} className="courses-rating-star" />
      {value}
    </span>
  );
}

function StudentsRenderer({ value }) {
  return (
    <span className="courses-students">
      <Users size={14} />
      {value}
    </span>
  );
}

function CategoryRenderer({ value }) {
  return <span className="courses-category-badge">{value}</span>;
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
const CoursesPage = memo(function CoursesPage() {
  const gridRef = useRef(null);
  const [quickFilter, setQuickFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
      headerName: 'Category',
      field: 'category',
      flex: 1,
      minWidth: 140,
      filter: 'agTextColumnFilter',
      cellRenderer: CategoryRenderer,
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
      headerName: 'Rating',
      field: 'rating',
      width: 110,
      filter: 'agNumberColumnFilter',
      cellRenderer: RatingRenderer,
    },
    {
      headerName: 'Students',
      field: 'students',
      width: 125,
      filter: 'agNumberColumnFilter',
      cellRenderer: StudentsRenderer,
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

  const handleResetFilters = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setFilterModel(null);
      setQuickFilter('');
    }
  }, []);

  const handleExportCsv = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: 'leboncours-courses.csv',
      });
    }
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Stats
  const stats = useMemo(() => ({
    total: MOCK_COURSES.length,
    avgPrice: Math.round(MOCK_COURSES.reduce((s, c) => s + c.hourly_price, 0) / MOCK_COURSES.length),
    categories: [...new Set(MOCK_COURSES.map(c => c.category))].length,
    avgRating: (MOCK_COURSES.reduce((s, c) => s + c.rating, 0) / MOCK_COURSES.length).toFixed(1),
  }), []);

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
              Explore {stats.total} courses across {stats.categories} categories — find the perfect mentor for you.
            </p>
          </div>

          {/* Quick stats */}
          <div className="courses-stats-row">
            <div className="courses-stat-chip">
              <span className="courses-stat-chip-value">{stats.total}</span>
              <span className="courses-stat-chip-label">Courses</span>
            </div>
            <div className="courses-stat-chip">
              <span className="courses-stat-chip-value">€{stats.avgPrice}</span>
              <span className="courses-stat-chip-label">Avg. price</span>
            </div>
            <div className="courses-stat-chip">
              <span className="courses-stat-chip-value">{stats.avgRating}</span>
              <span className="courses-stat-chip-label">Avg. rating</span>
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
            <button
              className={`courses-toolbar-btn ${showFilters ? 'courses-toolbar-btn--active' : ''}`}
              onClick={toggleFilters}
              title="Toggle column filters"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
            <button
              className="courses-toolbar-btn"
              onClick={handleResetFilters}
              title="Reset all filters"
            >
              <MdFilterListOff size={16} />
              <span>Reset</span>
            </button>
            <button
              className="courses-toolbar-btn"
              onClick={handleExportCsv}
              title="Export as CSV"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* AG Grid */}
        <div className="courses-grid-wrapper ag-theme-quartz">
          <AgGridReact
            ref={gridRef}
            rowData={MOCK_COURSES}
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
          />
        </div>

        {/* Footer note */}
        <p className="courses-footer-note">
          <RotateCcw size={14} />
          <span>Data refreshes automatically once the backend is connected.</span>
        </p>
      </div>
    </div>
  );
});

export default CoursesPage;
