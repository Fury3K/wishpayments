'use client';

import Link from 'next/link';
import { ArrowRight, PiggyBank, CheckCircle, TrendingUp, Shield, Zap, Github } from 'lucide-react';
import { Navbar } from './components/Navbar';

export default function Home() {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col relative overflow-hidden">
            {/* Background decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 mix-blend-multiply dark:mix-blend-normal dark:opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-multiply dark:mix-blend-normal dark:opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-base-100/40 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar showProfile={false} />

                {/* Hero Section */}
                <div className="flex-1 flex items-center justify-center px-4 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100/50 backdrop-blur-sm border border-base-content/10 text-sm font-medium text-primary mb-8 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Smart Financial Goal Tracking
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight text-base-content drop-shadow-sm">
                            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Wishes</span> <br />
                            & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Needs</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-base-content/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Stop dreaming and start saving. Prioritize your necessities, fund your wants, and watch your financial goals become reality.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/register" className="btn btn-lg btn-neutral border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 px-8 rounded-2xl">
                                Get Started Free <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/login" className="btn btn-lg btn-ghost hover:bg-base-100/50 text-base-content/80 px-8 rounded-2xl">
                                Log In
                            </Link>
                        </div>

                        <div className="mt-12 text-sm font-medium text-base-content/60 flex items-center justify-center gap-6">
                            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> No credit card required</span>
                            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Free forever plan</span>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-base-content">Simple, Powerful Features</h2>
                            <p className="text-lg text-base-content/80 max-w-2xl mx-auto">Everything you need to manage your savings goals effectively, wrapped in a beautiful interface.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="group p-8 rounded-3xl bg-base-100/60 backdrop-blur-xl border border-base-content/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Zap className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-base-content">Prioritize Needs</h3>
                                <p className="text-base-content/80 leading-relaxed">Clearly distinguish between absolute necessities and fun wants. Always know what to fund next.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group p-8 rounded-3xl bg-base-100/60 backdrop-blur-xl border border-base-content/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-base-content">Track Progress</h3>
                                <p className="text-base-content/80 leading-relaxed">Visual progress bars and quick-add buttons help you stay motivated as you save bit by bit.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group p-8 rounded-3xl bg-base-100/60 backdrop-blur-xl border border-base-content/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-base-content">Wallet Control</h3>
                                <p className="text-base-content/80 leading-relaxed">Manage your virtual wallet balance. Cash in, allocate funds, and get refunds if you change your mind.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Proof / Trust */}
                <div className="py-20 px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="rounded-3xl bg-neutral p-12 text-center text-neutral-content shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-base-100/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-base-100/5 rounded-full blur-3xl -ml-16 -mb-16"></div>

                            <h2 className="text-3xl font-bold mb-12 relative z-10">Trusted by Smart Savers</h2>

                            <div className="grid md:grid-cols-3 gap-8 relative z-10">
                                <div className="flex flex-col items-center">
                                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-2">₱1.2M+</div>
                                    <div className="text-neutral-content/70 font-medium">Money Saved</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">4,500+</div>
                                    <div className="text-neutral-content/70 font-medium">Active Goals</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">1,200+</div>
                                    <div className="text-neutral-content/70 font-medium">Happy Users</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-10 text-center text-base-content/60 text-sm">
                    <div className="flex justify-center gap-6 mb-6">
                        <a href="#" className="hover:text-base-content transition-colors">About us</a>
                        <a href="#" className="hover:text-base-content transition-colors">Contact</a>
                        <a href="#" className="hover:text-base-content transition-colors">Privacy Policy</a>
                    </div>
                    <div className="flex justify-center gap-4 mb-6">
                        <a href="#" className="p-2 rounded-full bg-base-100/50 hover:bg-base-100 hover:shadow-md transition-all text-base-content/80">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                    <p>Copyright © {new Date().getFullYear()} - WishPayments</p>
                </footer>
            </div>
        </div>
    );
}