'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email) {
            setError('Email is required');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/auth/forgot-password', { email });
            setEmailSent(true);
            toast.success('Reset link sent!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset link');
            toast.error(err.response?.data?.message || 'Failed to send reset link');
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
                                <path clipRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V3a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM11.25 21a.75.75 0 011.5 0v.75a.75.75 0 01-1.5 0V21zM3 11.25a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm18.75 0a.75.75 0 010 1.5h-.75a.75.75 0 010-1.5h.75zM5.47 5.47a.75.75 0 011.06 0l.53.53a.75.75 0 01-1.06 1.06l-.53-.53a.75.75 0 010-1.06zm13.28 13.28a.75.75 0 011.06 0l.53.53a.75.75 0 01-1.06 1.06l-.53-.53a.75.75 0 010-1.06zM6.53 17.47a.75.75 0 010 1.06l-.53.53a.75.75 0 01-1.06-1.06l.53-.53a.75.75 0 011.06 0zm11.94-11.94a.75.75 0 010 1.06l-.53.53a.75.75 0 01-1.06-1.06l.53-.53a.75.75 0 011.06 0z" fillRule="evenodd"></path>
                                <path clipRule="evenodd" d="M12 6a6 6 0 100 12 6 6 0 000-12zM8.25 12a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <div className="flex flex-col items-center">
                            <img src="/wishpay_header.svg" alt="WishPay Logo" className="h-8 w-auto" />
                        </div>
                    </div>
                    <h1 className="font-bold text-slate-900 mb-2 text-center text-[28px]">
                        Forgot Password
                    </h1>
                    <p className="text-sm text-gray-500 text-center font-medium mb-8">
                        Enter your email to receive a reset link
                    </p>
                </header>

                {!emailSent ? (
                    <form className="w-full flex flex-col gap-6" onSubmit={handleForgotPassword}>
                        <div className="relative w-full">
                            <div className="absolute left-4 top-[28px] -translate-y-1/2 text-gray-400 pointer-events-none">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                aria-label="Email Address"
                                className={`w-full bg-[#F0F2F5] text-slate-900 placeholder-gray-400 text-sm border border-transparent py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-[#103B6D]/20 rounded-[12px] h-[56px] ${error ? '!border-red-500 focus:!ring-red-200' : ''}`}
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                             {error && (
                                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</p>
                            )}
                        </div>

                        <button
                            className="w-full bg-[#103B6D] hover:bg-[#0A2A4F] text-white font-semibold py-3.5 rounded-full shadow-[0_4px_14px_0_rgba(30,64,121,0.39)] mt-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-medium">
                            If an account exists with <strong>{email}</strong>, we've sent instructions to reset your password.
                        </div>
                        <p className="text-xs text-gray-500 mb-6">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                         <button
                            onClick={() => setEmailSent(false)}
                            className="text-sm font-semibold text-blue-900 hover:underline"
                        >
                            Try another email
                        </button>
                    </div>
                )}

                <footer className="mt-8 text-center">
                    <Link className="flex items-center gap-2 text-sm text-gray-500 font-medium hover:text-slate-900 transition-colors" href="/login">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </footer>
            </main>
        </div>
    );
}