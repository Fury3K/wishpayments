'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});

    if (!token) {
        return (
            <div className="text-center text-red-500 font-medium">
                Invalid or missing reset token.
            </div>
        );
    }

    const validate = () => {
        const newErrors: { password?: string; confirmPassword?: string } = {};
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/auth/reset-password', { token, password });
            toast.success('Password reset successful! Redirecting to login...');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setErrors({ general: err.response?.data?.message || 'Failed to reset password' });
            toast.error(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="w-full flex flex-col gap-6" onSubmit={handleResetPassword}>
            <div className="relative w-full">
                <div className="absolute left-4 top-[28px] -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Lock className={`w-5 h-5 ${errors.password ? 'text-red-500' : ''}`} />
                </div>
                <input
                    aria-label="New Password"
                    className={`w-full bg-[#F0F2F5] text-slate-900 placeholder-gray-400 text-sm border border-transparent py-3.5 pl-11 pr-11 focus:ring-2 focus:ring-[#103B6D]/20 rounded-[12px] h-[56px] ${errors.password ? '!border-red-500 focus:!ring-red-200' : ''}`}
                    placeholder="New Password"
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

            <div className="relative w-full">
                <div className="absolute left-4 top-[28px] -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Lock className={`w-5 h-5 ${errors.confirmPassword ? 'text-red-500' : ''}`} />
                </div>
                <input
                    aria-label="Confirm New Password"
                    className={`w-full bg-[#F0F2F5] text-slate-900 placeholder-gray-400 text-sm border border-transparent py-3.5 pl-11 pr-11 focus:ring-2 focus:ring-[#103B6D]/20 rounded-[12px] h-[56px] ${errors.confirmPassword ? '!border-red-500 focus:!ring-red-200' : ''}`}
                    placeholder="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    type="button"
                    className="absolute right-4 top-[28px] -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.confirmPassword}</p>
                )}
            </div>

            {errors.general && (
                <div className="text-red-500 text-sm text-center font-medium -mt-2">
                    {errors.general}
                </div>
            )}

            <button
                className="w-full bg-[#103B6D] hover:bg-[#0A2A4F] text-white font-semibold py-3.5 rounded-full shadow-[0_4px_14px_0_rgba(30,64,121,0.39)] mt-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                type="submit"
                disabled={loading}
            >
                {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Reset Password'}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
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
                        Set New Password
                    </h1>
                    <p className="text-sm text-gray-500 text-center font-medium mb-8">
                        Enter your new password below
                    </p>
                </header>

                <Suspense fallback={<div className="loading loading-spinner loading-md"></div>}>
                    <ResetPasswordContent />
                </Suspense>
            </main>
        </div>
    );
}