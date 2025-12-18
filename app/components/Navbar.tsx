'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, User, LogOut, Settings, History } from 'lucide-react';
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
        localStorage.removeItem('token');
        router.push('/');
    };

    if (!mounted) {
        return (
            <header className="flex justify-between items-center px-6 py-5 bg-white z-20 relative">
                <div className="flex items-center text-2xl font-bold tracking-tight">
                    <span style={{ color: '#103B6D', fontWeight: 'bold' }}>Wish</span>
                    <span style={{ color: '#C5A059', fontWeight: 'bold' }}>Pay</span>
                </div>
            </header>
        );
    }

    return (
        <header className="flex justify-between items-center px-6 py-5 bg-white z-20 relative border-b border-gray-100 shadow-sm">
            <div className="flex items-center text-2xl font-bold tracking-tight">
                <Link href={showProfile ? "/dashboard" : "/"} className="flex items-center">
                    <span style={{ color: '#103B6D', fontWeight: 'bold' }}>Wish</span>
                    <span style={{ color: '#C5A059', fontWeight: 'bold' }}>Pay</span>
                </Link>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <label className="swap swap-rotate btn btn-ghost btn-xs btn-circle text-slate-600">
                    <input
                        type="checkbox"
                        checked={resolvedTheme === 'dim' || theme === 'dim'}
                        onChange={handleToggle}
                    />
                    <Sun className="swap-off w-4 h-4" />
                    <Moon className="swap-on w-4 h-4" />
                </label>

                {showProfile && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden hover:bg-gray-200 transition-colors">
                            <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <ul tabIndex={0} className="mt-3 z-[100] p-2 shadow-xl menu menu-sm dropdown-content bg-white rounded-2xl w-52 border border-gray-100">
                            <li>
                                <Link href="/profile" className="flex items-center justify-between py-2.5">
                                    Profile Settings
                                    <Settings className="w-4 h-4" />
                                </Link>
                            </li>
                            <li>
                                <Link href="/history" className="flex items-center justify-between py-2.5">
                                    Transaction History
                                    <History className="w-4 h-4" />
                                </Link>
                            </li>
                            <div className="divider my-1 opacity-50"></div>
                            <li>
                                <a onClick={onLogout || handleLogout} className="text-red-600 flex items-center justify-between py-2.5 hover:bg-red-50">
                                    Logout 
                                    <LogOut className="w-4 h-4" />
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};