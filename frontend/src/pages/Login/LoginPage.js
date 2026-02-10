import React, { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, GraduationCap } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = memo(function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate — will connect to backend later
    setTimeout(() => setLoading(false), 1500);
    console.log('Login:', form);
  }, [form]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left - Form */}
        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            {/* Header */}
            <div className="auth-header">
              <Link to="/" className="auth-logo">
                <GraduationCap size={32} className="logo-icon-svg" />
                <span className="logo-text">leboncours</span>
              </Link>
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">
                Log in to your account to access your courses and messages.
              </p>
            </div>

            {/* Social login */}
            <div className="auth-social">
              <button type="button" className="auth-social-btn">
                <FcGoogle size={20} />
                <span>Google</span>
              </button>
              <button type="button" className="auth-social-btn">
                <FaGithub size={20} />
                <span>GitHub</span>
              </button>
            </div>

            <div className="auth-divider">
              <span>or continue with email</span>
            </div>

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">
                  Email address
                </label>
                <div className="form-input-wrap">
                  <Mail size={18} className="form-input-icon" />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="form-input"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="login-password">
                    Password
                  </label>
                  <Link to="/login" className="form-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="form-input-wrap">
                  <Lock size={18} className="form-input-icon" />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="form-input"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="form-input-toggle"
                    onClick={togglePassword}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Log in</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="auth-footer-text">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-footer-link">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Right - Visual */}
        <div className="auth-visual-side">
          <div className="auth-visual-content">
            <div className="auth-visual-icon">
              <GraduationCap size={48} />
            </div>
            <h2 className="auth-visual-title">
              Learn anything,<br />from anyone
            </h2>
            <p className="auth-visual-text">
              Join 10,000+ learners booking one-on-one sessions with skilled mentors worldwide.
            </p>
            <div className="auth-visual-stats">
              <div className="auth-visual-stat">
                <span className="auth-visual-stat-value">500+</span>
                <span className="auth-visual-stat-label">Mentors</span>
              </div>
              <div className="auth-visual-stat-divider" />
              <div className="auth-visual-stat">
                <span className="auth-visual-stat-value">10k+</span>
                <span className="auth-visual-stat-label">Learners</span>
              </div>
              <div className="auth-visual-stat-divider" />
              <div className="auth-visual-stat">
                <span className="auth-visual-stat-value">4.8</span>
                <span className="auth-visual-stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LoginPage;
