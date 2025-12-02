'use client';

import Link from 'next/link';
import { ArrowRight, PiggyBank, CheckCircle, TrendingUp, Shield, Zap, Github } from 'lucide-react';
import { Navbar } from './components/Navbar';

export default function Home() {
    return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            <Navbar showProfile={false} />

            {/* Hero Section */}
            <div className="hero min-h-[80vh] bg-base-200 relative overflow-hidden">
                {/* Abstract Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] bg-secondary rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-accent rounded-full blur-3xl"></div>
                </div>

                <div className="hero-content text-center z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
                            Master Your <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Wishes</span> & <span className="text-secondary">Needs</span>
                        </h1>
                        <p className="py-6 text-xl md:text-2xl text-base-content/80 max-w-2xl mx-auto mb-8">
                            Stop dreaming and start saving. Prioritize your necessities, fund your wants, and watch your financial goals become reality with WishPayments.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register" className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-primary/50 transition-all hover:scale-105">
                                Get Started Free <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/login" className="btn btn-outline btn-lg">
                                Log In
                            </Link>
                        </div>
                        <div className="mt-12 text-sm text-base-content/60">
                            No credit card required • Free forever plan available
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 px-4 bg-base-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Simple, Powerful Features</h2>
                        <p className="text-lg text-base-content/70">Everything you need to manage your savings goals effectively.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-300">
                            <div className="card-body items-center text-center">
                                <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                                    <Zap className="w-8 h-8" />
                                </div>
                                <h3 className="card-title text-xl mb-2">Prioritize Needs</h3>
                                <p>Clearly distinguish between absolute necessities and fun wants. Always know what to fund next.</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-300">
                            <div className="card-body items-center text-center">
                                <div className="p-4 rounded-full bg-secondary/10 text-secondary mb-4">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <h3 className="card-title text-xl mb-2">Track Progress</h3>
                                <p>Visual progress bars and quick-add buttons help you stay motivated as you save bit by bit.</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-300">
                            <div className="card-body items-center text-center">
                                <div className="p-4 rounded-full bg-accent/10 text-accent mb-4">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <h3 className="card-title text-xl mb-2">Wallet Control</h3>
                                <p>Manage your virtual wallet balance. Cash in, allocate funds, and get refunds if you change your mind.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Proof / Trust */}
            <div className="bg-base-200 py-16">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold mb-8">Why Use WishPayments?</h2>
                    <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 text-base-content w-full">
                        <div className="stat place-items-center">
                            <div className="stat-title">Money Saved</div>
                            <div className="stat-value text-primary">₱1.2M+</div>
                            <div className="stat-desc">By our community</div>
                        </div>

                        <div className="stat place-items-center">
                            <div className="stat-title">Active Goals</div>
                            <div className="stat-value text-secondary">4,500+</div>
                            <div className="stat-desc">Needs & Wants</div>
                        </div>

                        <div className="stat place-items-center">
                            <div className="stat-title">Users</div>
                            <div className="stat-value text-accent">1,200</div>
                            <div className="stat-desc">↗︎ 90 (14%)</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
                <div className="grid grid-flow-col gap-4">
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Privacy Policy</a>
                </div>
                <div>
                    <div className="grid grid-flow-col gap-4">
                        <a className="btn btn-ghost btn-sm btn-circle"><Github className="w-5 h-5" /></a>
                    </div>
                </div>
                <div>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved by WishPayments</p>
                </div>
            </footer>
        </div>
    );
}