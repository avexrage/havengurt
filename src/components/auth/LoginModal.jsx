import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../Icons';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { login, register, loginWithGoogle } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                // Check against DB Settings first for "Admin" username login
                const adminSettings = await db.getAdminSettings();
                console.log("Attempting Admin Login:", { inputEmail: email, inputPass: password, dbSettings: adminSettings });

                if (email === adminSettings.username && password === adminSettings.password) {
                    // Local Admin Login validated by DB
                    onClose();
                    if (onLoginSuccess) onLoginSuccess({
                        email: adminSettings.notifiedEmail,
                        name: 'Admin',
                        isAdmin: true
                    });
                    return;
                } else {
                    await login(email, password);
                }
            } else {
                await register(name, email, password);
            }
            onClose();
            if (onLoginSuccess) onLoginSuccess({ email: email });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            onClose();
            if (onLoginSuccess) onLoginSuccess({ email: 'google-user' }); // Placeholder or get from auth result
        } catch (err) {
            console.error("Google Login Error:", err);
            setError(err.message || 'Google Login Failed');
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><Icons.X /></button>

                <div className="text-center mb-8">
                    <h2 className="font-bold text-2xl text-brand-blue mb-2">{isLogin ? 'Welcome Back' : 'Join Havengurt'}</h2>
                    <p className="text-gray-500 text-sm">
                        {isLogin ? 'Login to track your orders' : 'Create an account to get started'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-300 focus:border-brand-blue outline-none"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email or Username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:border-brand-blue outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:border-brand-blue outline-none"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full btn-blue text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>

                    {isLogin && (
                        <div className="text-center mt-2">
                            <button type="button" onClick={async () => {
                                if (window.confirm("Reset Admin password to default (admin/admin)?")) {
                                    await db.saveAdminSettings({ username: 'admin', password: 'admin', notifiedEmail: 'havengurt@gmail.com' });
                                    alert("Admin credentials reset to: admin / admin");
                                }
                            }} className="text-xs text-gray-400 hover:text-brand-blue underline">
                                Forgot Admin Password? (Reset)
                            </button>
                        </div>
                    )}
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Google
                </button>

                <p className="text-center mt-6 text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-brand-blue font-bold hover:underline">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};
