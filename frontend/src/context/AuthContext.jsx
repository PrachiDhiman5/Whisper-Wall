import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(true);
    const [refreshVersion, setRefreshVersion] = useState(0);

    const triggerRefresh = () => setRefreshVersion(prev => prev + 1);

    useEffect(() => {
        const processToken = () => {
            if (!token || typeof token !== 'string' || !token.includes('.')) {
                setUser(null);
                setAuthToken(null);
                setLoading(false);
                return;
            }

            try {
                const parts = token.split('.');
                if (parts.length !== 3) throw new Error("Invalid JWT format");

                const base64Url = parts[1];
                let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                while (base64.length % 4) base64 += '=';

                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decoded = JSON.parse(jsonPayload);
                console.log("[AuthContext] Success:", decoded.email);

                setUser({
                    id: decoded.userId || "guest",
                    name: decoded.name || "User",
                    email: decoded.email || "",
                    profilePicture: decoded.profilePicture || "",
                    anonymousId: decoded.anonymousId || "#0000000",
                    loggedIn: true
                });
            } catch (error) {
                console.error("[AuthContext] Error:", error.message);
                setUser({ loggedIn: true, name: "User" }); // Minimum fallback to prevent crashes
            } finally {
                setAuthToken(token);
                setLoading(false);
            }
        };

        processToken();
    }, [token]);

    const login = (newToken) => {
        if (newToken !== token) {
            setLoading(true);
            sessionStorage.setItem('auth_token', newToken);
            setToken(newToken);
        } else {
            setLoading(false); // Already have this token, ensure we aren't stuck in loading
        }
    };

    const logout = () => {
        sessionStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, refreshVersion, triggerRefresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
