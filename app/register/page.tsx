'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Command, Github } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/register', { name, email, password });
            if (response.status === 201) {
                toast.success('Registration successful! Please log in.');
                router.push('/login');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Background decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-100/60 rounded-full blur-3xl -mr-20 -mt-20 mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100/60 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar showProfile={false} />

                <div className="flex-1 flex flex-col justify-center items-center p-4">
                    <div className="card w-full max-w-md bg-white/70 backdrop-blur-xl shadow-2xl border border-white/40 overflow-hidden">
                        <div className="card-body p-8">
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-violet-600">
                                    <User className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
                                <p className="text-slate-500 mt-1">Start tracking your financial goals today.</p>
                            </div>

                            <form className="space-y-4" onSubmit={handleRegister}>
                                {error && (
                                    <div className="alert alert-error bg-rose-50 text-rose-600 border-rose-100 text-sm py-2 rounded-xl flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text font-medium text-slate-600">Full Name</span>
                                    </label>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="input input-bordered w-full pl-10 bg-white/50 border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all rounded-xl"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text font-medium text-slate-600">Email</span>
                                    </label>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="hello@example.com"
                                            className="input input-bordered w-full pl-10 bg-white/50 border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all rounded-xl"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text font-medium text-slate-600">Password</span>
                                    </label>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="input input-bordered w-full pl-10 bg-white/50 border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all rounded-xl"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary w-full mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none text-white shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 transition-all rounded-xl h-12 text-base"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? <span className="loading loading-spinner"></span> : 'Sign Up'}
                                </button>
                            </form>

                            <div className="divider text-slate-400 text-xs my-6">OR</div>

                            <div className="space-y-3">
                                <button className="btn btn-outline w-full gap-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 font-medium rounded-xl h-11 normal-case">
                                    <Command className="w-5 h-5" />
                                    Continue with Google
                                </button>
                                <button className="btn btn-outline w-full gap-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 font-medium rounded-xl h-11 normal-case">
                                    <Github className="w-5 h-5" />
                                    Continue with GitHub
                                </button>
                            </div>

                            <div className="text-center mt-8 text-sm text-slate-500">
                                Already have an account?{' '}
                                <Link href="/login" className="link link-primary font-bold text-violet-600 no-underline hover:underline">
                                    Log in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}