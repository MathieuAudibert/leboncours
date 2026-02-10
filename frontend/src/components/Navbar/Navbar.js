import React, { useState, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, LogIn } from 'lucide-react';
import './Navbar.css';

const Navbar = memo(function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    // Will connect to backend later
    console.log('Search:', searchQuery);
  }, [searchQuery]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobile}>
          <span className="logo-icon">📚</span>
          <span className="logo-text">leboncours</span>
        </Link>

        {/* Search Bar - Desktop */}
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <Search size={18} className="search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search for courses, mentors, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search courses"
          />
          <button type="submit" className="search-btn" aria-label="Submit search">
            Search
          </button>
        </form>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'nav-link--active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActive('/about') ? 'nav-link--active' : ''}`}
          >
            About
          </Link>
          <div className="nav-divider" />
          <button className="nav-btn nav-btn--outline">
            <LogIn size={16} />
            <span>Log in</span>
          </button>
          <button className="nav-btn nav-btn--primary">
            <User size={16} />
            <span>Sign up</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggle"
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          <div className="mobile-menu-backdrop" onClick={closeMobile} />
          <div className="mobile-menu-content">
            <form className="mobile-search" onSubmit={handleSearchSubmit}>
              <Search size={18} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </form>
            <Link to="/" className="mobile-link" onClick={closeMobile}>Home</Link>
            <Link to="/about" className="mobile-link" onClick={closeMobile}>About</Link>
            <div className="mobile-divider" />
            <button className="mobile-btn mobile-btn--outline">Log in</button>
            <button className="mobile-btn mobile-btn--primary">Sign up</button>
          </div>
        </div>
      )}
    </nav>
  );
});

export default Navbar;
