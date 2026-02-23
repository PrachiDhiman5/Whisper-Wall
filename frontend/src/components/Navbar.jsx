import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfessionSheet from '../pages/ConfessionSheet';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, loading, triggerRefresh } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();

    const handleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    if (loading) return (
        <nav className="navbar glass fade-in">
            <div className="container nav-content">
                <div className="logo-group">
                    <span className="logo-icon">🌙</span>
                    <span className="logo-text">Whisper<span>Wall</span></span>
                </div>
            </div>
        </nav>
    );

    return (
        <>
            <nav className="navbar glass fade-in">
                <div className="container nav-content">
                    <Link to={user ? "/feed" : "/"} className="logo-group">
                        <span className="logo-icon">🌙</span>
                        <span className="logo-text">Whisper<span>Wall</span></span>
                    </Link>

                    <div className="nav-links">
                        {user ? (
                            <>
                                <Link to="/feed" className={location.pathname === '/feed' ? 'active' : ''}>Wall</Link>
                                <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
                                <button className="btn-confess" onClick={() => setIsModalOpen(true)}>
                                    <span className="plus">+</span> Confess
                                </button>
                                <div className="user-nav">
                                    <div className="avatar-small">
                                        <img src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`} alt="avatar" />
                                    </div>
                                    <button className="logout-link" onClick={logout}>Logout</button>
                                </div>
                            </>
                        ) : (
                            <button className="btn-login-pill" onClick={handleLogin}>Get Started</button>
                        )}
                    </div>
                </div>
            </nav>

            {user && (
                <ConfessionSheet
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={triggerRefresh}
                />
            )}
        </>
    );
};

export default Navbar;
