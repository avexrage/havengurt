import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        const user = auth.login(email, password);
        setUser(user);
        return user;
    };

    const register = async (name, email, password) => {
        const user = auth.register(name, email, password);
        setUser(user);
        return user;
    };

    const loginWithGoogle = async () => {
        const user = await auth.loginWithGoogle();
        setUser(user);
        return user;
    };

    const logout = () => {
        auth.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
