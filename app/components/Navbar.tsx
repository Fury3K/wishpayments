'use client';

import { useState, useEffect } from 'react';
import { PiggyBank, Sun, Moon, User, LogOut, Settings, History } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export const Navbar = ({ showProfile = true, onLogout }: { showProfile?: boolean, onLogout?: () => void }) => {
    const router = useRouter();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTheme = e.target.checked ? 'dim' : 'cupcake';
        setTheme(newTheme);
    };

    const handleLogout = () => {
        router.push('/');
    };

    // Prevent hydration mismatch
    if (!mounted) {
        // Render a simplified version or empty div to avoid layout shift, 
        // or just return null if acceptable. 
        // Returning a skeleton or non-interactive version is better.
        return (
             <div className="navbar bg-base-100/70 backdrop-blur-xl shadow-lg sticky top-4 z-50 rounded-2xl mx-4 sm:mx-auto max-w-7xl mt-4 border border-base-content/10">
                <div className="flex-1">
                     <a className="btn btn-ghost normal-case text-xl text-primary gap-2">
                        <PiggyBank className="w-5 h-5" /> WishPay
                    </a>
                </div>
             </div>
        );
    }

    return (
        <div className="navbar bg-base-100/70 backdrop-blur-xl shadow-lg sticky top-4 z-50 rounded-2xl mx-4 sm:mx-auto max-w-7xl mt-4 border border-base-content/10">
            <div className="flex-1">
                <Link href={showProfile ? "/dashboard" : "/"} className="btn btn-ghost normal-case text-xl text-primary gap-2">
                    <PiggyBank className="w-5 h-5" /> WishPay
                </Link>
            </div>
            <div className="flex-none gap-2">
                {/* Theme Toggle */}
                <label className="swap swap-rotate btn btn-ghost btn-circle text-base-content">
                    {/* this hidden checkbox controls the state */}
                    <input
                        type="checkbox"
                        checked={resolvedTheme === 'dim' || theme === 'dim'}
                        onChange={handleToggle}
                    />

                    {/* sun icon (shows when checked is false -> cupcake) */}
                    <Sun className="swap-off w-5 h-5" />

                    {/* moon icon (shows when checked is true -> dim) */}
                    <Moon className="swap-on w-5 h-5" />
                </label>

                {showProfile && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                            <div className="bg-neutral/20 text-neutral-content rounded-full w-8 h-8 flex items-center justify-center">
                                <span className="text-xs font-bold text-neutral">ME</span>
                            </div>
                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li>
                                <a className="justify-between">
                                    Update Profile
                                    <Settings className="w-4 h-4" />
                                </a>
                            </li>
                            <li>
                                <Link href="/history" className="justify-between">
                                    History
                                    <History className="w-4 h-4" />
                                </Link>
                            </li>
                            <li><a onClick={onLogout || handleLogout} className="text-error">Logout <LogOut className="w-4 h-4" /></a></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};