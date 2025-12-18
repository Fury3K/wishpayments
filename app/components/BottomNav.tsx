'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, List, User } from 'lucide-react';

export function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)] rounded-t-3xl px-6 py-3 z-50">
            <div className="flex justify-between items-center">
                {/* Dashboard */}
                <Link href="/dashboard" className="flex flex-col items-center gap-1 min-w-[64px] group">
                    <div className={isActive('/dashboard') ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600 transition-colors"}>
                        <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold ${isActive('/dashboard') ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600 transition-colors"}`}>
                        Dashboard
                    </span>
                </Link>

                {/* Goals */}
                <Link href="/goals" className="flex flex-col items-center gap-1 min-w-[64px] group">
                    <div className={isActive('/goals') ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600 transition-colors"}>
                        <Target className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-medium ${isActive('/goals') ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600 transition-colors"}`}>
                        Goals
                    </span>
                </Link>

                {/* Activity / History */}
                <Link href="/history" className="flex flex-col items-center gap-1 min-w-[64px] group">
                    <div className={isActive('/history') ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600 transition-colors"}>
                        <List className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-medium ${isActive('/history') ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600 transition-colors"}`}>
                        Activity
                    </span>
                </Link>

                {/* Profile */}
                <Link href="/profile" className="flex flex-col items-center gap-1 min-w-[64px] group">
                    <div className={isActive('/profile') ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600 transition-colors"}>
                        <User className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-medium ${isActive('/profile') ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600 transition-colors"}`}>
                        Profile
                    </span>
                </Link>
            </div>
        </nav>
    );
}