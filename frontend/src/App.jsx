import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Feed from './pages/Feed';
import ConfessionSheet from './pages/ConfessionSheet';
import ProfilePage from './pages/ProfilePage';
import AuthCallback from './pages/AuthCallback';
import { ToastProvider } from './context/ToastContext';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="container flex-center" style={{ padding: '100px' }}>
      <div className="loader-spinner"></div>
    </div>
  );
  if (!user) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="app-layout bg-gradient">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth-callback" element={<AuthCallback />} />

                <Route path="/feed" element={
                  <ProtectedRoute><Feed /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
