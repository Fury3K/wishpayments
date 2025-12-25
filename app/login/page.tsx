'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                toast.success('Login successful!');
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4F6F9] font-inter">
            <main className="bg-white rounded-[24px] px-8 py-12 shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full max-w-[380px] flex flex-col items-center">
                <header className="w-full flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center gap-3 mb-6">
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#103B6D] to-[#3B82F6] shadow-lg shadow-blue-100/50 ring-1 ring-black/5">
                            <svg className="w-9 h-9 text-[#C5A059] drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <div className="flex flex-col items-center">
                            <img src="/wishpay_header.svg" alt="WishPay Logo" className="h-8 w-auto" />
                        </div>
                    </div>
                    <h1 className="font-bold text-slate-900 mb-2 text-center text-[28px]">
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500 text-center font-medium mb-8">
                        Sign in to your account
                    </p>
                </header>

                <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
                    <div className="relative w-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            aria-label="Email Address"
                            className="w-full bg-[#F0F2F5] text-slate-900 placeholder-gray-400 text-sm border-none py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-[#103B6D]/20 rounded-[12px] h-[56px]"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative w-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            aria-label="Password"
                            className="w-full bg-[#F0F2F5] text-slate-900 placeholder-gray-400 text-sm border-none py-3.5 pl-11 pr-11 focus:ring-2 focus:ring-[#103B6D]/20 rounded-[12px] h-[56px]"
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <div className="w-full flex justify-end mt-1">
                        <a className="text-sm font-medium hover:underline text-blue-900" href="#">
                            Forgot Password?
                        </a>
                    </div>

                    <button
                        className="w-full bg-[#103B6D] hover:bg-[#0A2A4F] text-white font-semibold py-3.5 rounded-full shadow-[0_4px_14px_0_rgba(30,64,121,0.39)] mt-4 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Log In'}
                    </button>
                </form>

                <div className="w-full flex items-center gap-3 mt-8 mb-6">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-xs text-gray-400 font-medium uppercase">Or continue with</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <a
                        href="/api/auth/google"
                        className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-semibold py-3.5 rounded-full flex justify-center items-center gap-3 transition-colors"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Google
                    </a>
                    <a
                        href="/api/auth/facebook"
                        className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold py-3.5 rounded-full flex justify-center items-center gap-3 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                    </a>
                </div>

                <footer className="mt-8 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Don't have an account?{' '}
                        <Link className="text-slate-900 hover:underline text-blue-900 font-bold" href="/register">Sign Up.</Link>
                    </p>
                </footer>
            </main>
        </div>
    );
}