'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PiggyBank, Mail, Lock, Github, Command } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log('Sending login request for:', email);

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
        <div className="min-h-screen bg-base-200 flex flex-col relative overflow-hidden">
            {/* Background decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 mix-blend-multiply dark:mix-blend-normal dark:opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-multiply dark:mix-blend-normal dark:opacity-20"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar showProfile={false} />

                <div className="flex-1 flex flex-col justify-center items-center p-4">
                    <div className="card w-full max-w-md bg-base-100/70 backdrop-blur-xl shadow-2xl border border-base-content/10 overflow-hidden">
                        <div className="card-body p-8">
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                                    <PiggyBank className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-base-content">Welcome Back!</h2>
                                <p className="text-base-content/60 mt-1">Login to track your financial goals.</p>
                            </div>

                            <form className="space-y-4" onSubmit={handleLogin}>
                                {error && (
                                    <div className="alert alert-error bg-error/10 text-error border-error/20 text-sm py-2 rounded-xl flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text font-medium text-base-content/80">Email</span>
                                    </label>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-base-content/40" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="hello@example.com"
                                            className="input input-bordered w-full pl-10 bg-base-100/50 border-base-content/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text font-medium text-base-content/80">Password</span>
                                    </label>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-base-content/40" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="input input-bordered w-full pl-10 bg-base-100/50 border-base-content/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <label className="label">
                                        <a href="#" className="label-text-alt link link-hover text-primary font-medium">Forgot password?</a>
                                    </label>
                                </div>

                                <button
                                    className="btn btn-primary w-full mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all rounded-xl h-12 text-base"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? <span className="loading loading-spinner"></span> : 'Log In'}
                                </button>
                            </form>

                            <div className="divider text-base-content/40 text-xs my-6">OR</div>

                            <div className="space-y-3">
                                <button className="btn btn-outline w-full gap-2 border-base-content/20 hover:bg-base-100 hover:border-base-content/30 text-base-content/80 font-medium rounded-xl h-11 normal-case">
                                    <Command className="w-5 h-5" />
                                    Continue with Google
                                </button>
                                <button className="btn btn-outline w-full gap-2 border-base-content/20 hover:bg-base-100 hover:border-base-content/30 text-base-content/80 font-medium rounded-xl h-11 normal-case">
                                    <Github className="w-5 h-5" />
                                    Continue with GitHub
                                </button>
                            </div>

                            <div className="text-center mt-8 text-sm text-base-content/60">
                                Don't have an account?{' '}
                                <Link href="/register" className="link link-primary font-bold text-primary no-underline hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}