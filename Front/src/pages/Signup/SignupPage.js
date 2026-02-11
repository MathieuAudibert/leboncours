import React, { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const PASSWORD_RULES = [
  { key: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'number', label: 'One number', test: (v) => /\d/.test(v) },
];

const SignupPage = memo(function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    // Simulate — will connect to backend later
    setTimeout(() => setLoading(false), 1500);
    console.log('Signup:', form);
  }, [form, agreed]);

  const passwordStrength = PASSWORD_RULES.filter(r => r.test(form.password)).length;

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
              <h1 className="auth-title">Create your account</h1>
              <p className="auth-subtitle">
                Start learning from the best mentors — it's free to get started.
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
                <label className="form-label" htmlFor="signup-name">
                  Full name
                </label>
                <div className="form-input-wrap">
                  <User size={18} className="form-input-icon" />
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="form-input"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">
                  Email address
                </label>
                <div className="form-input-wrap">
                  <Mail size={18} className="form-input-icon" />
                  <input
                    id="signup-email"
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
                <label className="form-label" htmlFor="signup-password">
                  Password
                </label>
                <div className="form-input-wrap">
                  <Lock size={18} className="form-input-icon" />
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="form-input"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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

                {/* Password strength */}
                {form.password.length > 0 && (
                  <div className="password-strength">
                    <div className="password-bar">
                      <div
                        className={`password-bar-fill password-bar--${
                          passwordStrength <= 1 ? 'weak' : passwordStrength === 2 ? 'medium' : 'strong'
                        }`}
                        style={{ width: `${(passwordStrength / PASSWORD_RULES.length) * 100}%` }}
                      />
                    </div>
                    <ul className="password-rules">
                      {PASSWORD_RULES.map(rule => (
                        <li
                          key={rule.key}
                          className={`password-rule ${rule.test(form.password) ? 'password-rule--pass' : ''}`}
                        >
                          <CheckCircle2 size={14} />
                          <span>{rule.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Terms checkbox */}
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="form-checkbox-box" />
                <span className="form-checkbox-label">
                  I agree to the{' '}
                  <Link to="/signup" className="form-link">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/signup" className="form-link">Privacy Policy</Link>
                </span>
              </label>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading || !agreed}
              >
                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>
                    <User size={18} />
                    <span>Create account</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="auth-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-footer-link">
                Log in
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
              Your learning journey<br />starts here
            </h2>
            <p className="auth-visual-text">
              Access hundreds of skilled mentors, book sessions instantly, and learn at your own pace.
            </p>
            <div className="auth-visual-features">
              <div className="auth-visual-feature">
                <CheckCircle2 size={18} />
                <span>Free to sign up</span>
              </div>
              <div className="auth-visual-feature">
                <CheckCircle2 size={18} />
                <span>Cancel anytime</span>
              </div>
              <div className="auth-visual-feature">
                <CheckCircle2 size={18} />
                <span>500+ verified mentors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SignupPage;
