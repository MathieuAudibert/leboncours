import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import PageLoader from './components/PageLoader/PageLoader';


const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));
const AboutPage = lazy(() => import('./pages/About/AboutPage'));
const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const SignupPage = lazy(() => import('./pages/Signup/SignupPage'));
const CoursesPage = lazy(() => import('./pages/Courses/CoursesPage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
