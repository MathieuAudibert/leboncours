import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogIn, GraduationCap, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  }, [searchQuery]);

  const handleLogout = useCallback(() => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobile}>
          <GraduationCap size={28} className="logo-icon-svg" />
          <span className="logo-text">leboncours</span>
        </Link>

        {/* Desktop Nav Links - next to search */}
        <div className="navbar-nav">
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
          <Link
            to="/courses"
            className={`nav-link ${isActive('/courses') ? 'nav-link--active' : ''}`}
          >
            Courses
          </Link>
        </div>

        {/* Auth Buttons - pushed right */}
        <div className="navbar-auth">
          {user ? (
            <div className="nav-user-menu-wrap">
              <button
                className="nav-user-btn"
                onClick={() => setUserMenuOpen(prev => !prev)}
              >
                <span className="nav-user-avatar">
                  {user.firstname[0]}{user.name[0]}
                </span>
                <span className="nav-user-name">{user.firstname}</span>
                <ChevronDown size={14} className={`nav-user-chevron ${userMenuOpen ? 'nav-user-chevron--open' : ''}`} />
              </button>
              {userMenuOpen && (
                <>
                  <div className="nav-user-backdrop" onClick={() => setUserMenuOpen(false)} />
                  <div className="nav-user-dropdown">
                    <div className="nav-user-dropdown-header">
                      <span className="nav-user-dropdown-name">{user.firstname} {user.name}</span>
                      <span className="nav-user-dropdown-role">{user.role}</span>
                    </div>
                    <div className="nav-user-dropdown-divider" />
                    <Link to="/dashboard" className="nav-user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <Link to="/profile" className="nav-user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <User size={16} />
                      Profile
                    </Link>
                    <div className="nav-user-dropdown-divider" />
                    <button className="nav-user-dropdown-item nav-user-dropdown-item--danger" onClick={handleLogout}>
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn--outline">
                <LogIn size={16} />
                <span>Log in</span>
              </Link>
              <Link to="/signup" className="nav-btn nav-btn--primary">
                <User size={16} />
                <span>Sign up</span>
              </Link>
            </>
          )}
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
            <Link to="/courses" className="mobile-link" onClick={closeMobile}>Courses</Link>
            {user && (
              <>
                <Link to="/dashboard" className="mobile-link" onClick={closeMobile}>Dashboard</Link>
                <Link to="/profile" className="mobile-link" onClick={closeMobile}>Profile</Link>
              </>
            )}
            <div className="mobile-divider" />
            {user ? (
              <button className="mobile-btn mobile-btn--outline" onClick={() => { handleLogout(); closeMobile(); }}>Log out</button>
            ) : (
              <>
                <Link to="/login" className="mobile-btn mobile-btn--outline" onClick={closeMobile}>Log in</Link>
                <Link to="/signup" className="mobile-btn mobile-btn--primary" onClick={closeMobile}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
