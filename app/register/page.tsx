'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validate = () => {
        const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
        
        if (!name.trim()) newErrors.name = 'Full name is required';
        
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

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

    const handleRegister = async (e: React.FormEvent) => {
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
            const response = await axios.post('/api/auth/register', { name, email, password });
            if (response.status === 201) {
                setIsSuccess(true);
                toast.success('Registration successful! Please check your email to verify your account.', { duration: 5000 });
            }
        } catch (err: any) {
            setErrors({ general: err.response?.data?.message || 'Registration failed' });
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4F6F9] font-inter">
                <main className="bg-white rounded-[24px] px-8 py-12 shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full max-w-[380px] flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify your email</h2>
                    <p className="text-gray-500 mb-8">
                        We've sent a verification link to <span className="font-medium text-slate-900">{email}</span>. Please check your inbox to activate your account.
                    </p>
                    <Link 
                        href="/login"
                        className="w-full bg-[#103B6D] hover:bg-[#0A2A4F] text-white font-semibold py-3.5 rounded-full shadow-[0_4px_14px_0_rgba(30,64,121,0.39)] transition-all duration-200 block"
                    >
                        Go to Login
                    </Link>
                </main>
            </div>
        );
    }

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
                        Create Account
                    </h1>
                    <p className="text-sm text-gray-500 text-center font-medium mb-8">
                        Start tracking your goals today
                    </p>
                </header>

                <form className="w-full flex flex-col gap-4" onSubmit={handleRegister}>
                    <div className="relative w-full">
                        <div className="absolute left-4 top-[28px] -translate-y-1/2 text-gray-400 pointer-events-none">
                            <User className={`w-5 h-5 ${errors.name ? 'text-red-500' : ''}`} />
                        </div>
                        <input
                            aria-label="Full Name"
                            className={`w-full bg-[#F0F2F5] text-slate-900 placeholder-gray-400 text-sm border border-transparent py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-[#103B6D]/20 rounded-[12px] h-[56px] ${errors.name ? '!border-red-500 focus:!ring-red-200' : ''}`}
                            placeholder="Full Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.name}</p>
                        )}
                    </div>

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

                    <div className="relative w-full">
                        <div className="absolute left-4 top-[28px] -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Lock className={`w-5 h-5 ${errors.confirmPassword ? 'text-red-500' : ''}`} />
                        </div>
                        <input
                            aria-label="Confirm Password"
                            className={`w-full bg-[#F0F2F5] text-slate-900 placeholder-gray-400 text-sm border border-transparent py-3.5 pl-11 pr-11 focus:ring-2 focus:ring-[#103B6D]/20 rounded-[12px] h-[56px] ${errors.confirmPassword ? '!border-red-500 focus:!ring-red-200' : ''}`}
                            placeholder="Confirm Password"
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
                        <div className="text-red-500 text-sm text-center font-medium mt-1">
                            {errors.general}
                        </div>
                    )}

                    <button
                        className="w-full bg-[#103B6D] hover:bg-[#0A2A4F] text-white font-semibold py-3.5 rounded-full shadow-[0_4px_14px_0_rgba(30,64,121,0.39)] mt-4 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Sign Up'}
                    </button>
                </form>

                <footer className="mt-8 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Already have an account?{' '}
                        <Link className="text-slate-900 hover:underline text-blue-900 font-bold" href="/login">Log In.</Link>
                    </p>
                </footer>
            </main>
        </div>
    );
}