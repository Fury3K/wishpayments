'use client';

import Link from 'next/link';
import { PiggyBank, Mail, Lock, Github, Command } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar showProfile={false} />

      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl font-bold text-center justify-center mb-2">Welcome Back!</h2>
                <p className="text-center text-base-content/70 mb-6">Login to track your financial goals.</p>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <label className="input-group">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-base-content/50" />
                                </div>
                                <input 
                                    type="email" 
                                    placeholder="hello@example.com" 
                                    className="input input-bordered w-full pl-10" 
                                />
                            </div>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <label className="input-group">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-base-content/50" />
                                </div>
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="input input-bordered w-full pl-10" 
                                />
                            </div>
                        </label>
                        <label className="label">
                            <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                        </label>
                    </div>

                    <button className="btn btn-primary w-full mt-4">
                        Log In
                    </button>
                </form>

                <div className="divider">OR</div>

                <div className="space-y-3">
                    <button className="btn btn-outline w-full gap-2">
                        <Command className="w-5 h-5" />
                        Continue with Google
                    </button>
                    <button className="btn btn-outline w-full gap-2">
                        <Github className="w-5 h-5" />
                        Continue with GitHub
                    </button>
                </div>

                <div className="text-center mt-6 text-sm">
                    Don't have an account?{' '}
                    <Link href="/register" className="link link-primary font-semibold">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
