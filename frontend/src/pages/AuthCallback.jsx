import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');

        if (tokenFromUrl && !user) {
            login(tokenFromUrl);
        } else if (user) {
            navigate('/feed');
        } else if (!tokenFromUrl && !user) {
            // Check if we already have a token in the URL or if something went wrong
            const hasError = params.get('error');
            if (hasError) {
                navigate(`/?error=${hasError}`);
            } else {
                console.error("No token found in callback URL");
                navigate('/?error=no_token');
            }
        }
    }, [location, login, navigate, user]);

    return (
        <div className="container" style={{ padding: '100px', textAlign: 'center' }}>
            <h1>Authenticating...</h1>
            <p>Please wait while we connect you to WhisperWall.</p>
        </div>
    );
};

export default AuthCallback;
