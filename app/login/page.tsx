'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);
    const [isVerificationNeeded, setIsVerificationNeeded] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    useEffect(() => {
        const verified = searchParams.get('verified');
        const error = searchParams.get('error');

        if (verified === 'true') {
            toast.success('Email verified successfully! You can now log in.');
        } else if (error === 'invalid_token') {
            toast.error('Invalid or expired verification token.');
        } else if (error === 'missing_token') {
            toast.error('Verification token is missing.');
        } else if (error === 'server_error') {
            toast.error('An error occurred during verification.');
        }
    }, [searchParams]);

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleResendVerification = async () => {
        setResendLoading(true);
        try {
            await axios.post('/api/auth/resend-verification', { email });
            toast.success('Verification email sent! Please check your inbox.');
            setIsVerificationNeeded(false);
            setErrors({});
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to resend verification email');
        } finally {
            setResendLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setIsVerificationNeeded(false);

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/auth/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                toast.success('Login successful!');
                router.push('/dashboard');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setErrors({ general: errorMessage });
            
            if (err.response?.status === 403) {
                setIsVerificationNeeded(true);
            }
            
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="relative w-full">
                <div className="absolute left-4 top-[28px] -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Mail className={`w-5 h-5 ${errors.email ? 'text-red-500' : ''}`} />
                </div>
                <input
                    aria-label="Email Address"
                    className={`w-full bg-[#F0F2F5] text-slate-900 placeholder-gray-400 text-sm border border-transparent py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-[#103B6D]/20 rounded-[12px] h-[56px] ${errors.email ? '!border-red-500 focus:!ring-red-200' : ''}`}
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email}</p>
                )}
            </div>

            <div className="relative w-full">
                <div className="absolute left-4 top-[28px] -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Lock className={`w-5 h-5 ${errors.password ? 'text-red-500' : ''}`} />
                </div>
                <input
                    aria-label="Password"
                    className={`w-full bg-[#F0F2F5] text-slate-900 placeholder-gray-400 text-sm border border-transparent py-3.5 pl-11 pr-11 focus:ring-2 focus:ring-[#103B6D]/20 rounded-[12px] h-[56px] ${errors.password ? '!border-red-500 focus:!ring-red-200' : ''}`}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    className="absolute right-4 top-[28px] -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                {errors.password && (
                    <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.password}</p>
                )}
            </div>

            {errors.general && (
                <div className="flex flex-col items-center gap-2 mt-1">
                    <div className="text-red-500 text-sm text-center font-medium">
                        {errors.general}
                    </div>
                    {isVerificationNeeded && (
                        <button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={resendLoading}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline disabled:opacity-50"
                        >
                            {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                        </button>
                    )}
                </div>
            )}

            <div className="w-full flex justify-end mt-1">
                <Link className="text-sm font-medium hover:underline text-blue-900" href="/forgot-password">
                    Forgot Password?
                </Link>
            </div>

            <button
                className="w-full bg-[#103B6D] hover:bg-[#0A2A4F] text-white font-semibold py-3.5 rounded-full shadow-[0_4px_14px_0_rgba(30,64,121,0.39)] mt-4 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                type="submit"
                disabled={loading}
            >
                {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Log In'}
            </button>
        </form>
    );
}

export default function LoginPage() {
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

                <Suspense fallback={<div className="loading loading-spinner loading-md"></div>}>
                    <LoginForm />
                </Suspense>

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