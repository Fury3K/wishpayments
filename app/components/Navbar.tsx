'use client';

import { useState, useEffect } from 'react';
import { PiggyBank, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export const Navbar = ({ showProfile = true }: { showProfile?: boolean }) => {
  const [theme, setTheme] = useState('cupcake');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('wishpay_theme');
    if (saved) {
      setTheme(saved);
      // Apply theme immediately on mount
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.checked ? 'dim' : 'cupcake';
    setTheme(newTheme);
    localStorage.setItem('wishpay_theme', newTheme);
    // Explicitly set it to ensure sync, though theme-controller does it too
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Prevent hydration mismatch by rendering a placeholder or consistent state until mounted
  // However, for a navbar icon, it's usually fine to just render. 
  // To be safe with icons switching, we can use the 'mounted' check.

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        <div className="flex-1">
            <Link href="/" className="btn btn-ghost normal-case text-xl text-primary gap-2">
                <PiggyBank className="w-5 h-5" /> WishPay
            </Link>
        </div>
        <div className="flex-none gap-2">
            {/* Theme Toggle */}
            <label className="swap swap-rotate btn btn-ghost btn-circle text-base-content">
                {/* this hidden checkbox controls the state */}
                <input 
                    type="checkbox" 
                    className="theme-controller" 
                    value="dim" 
                    checked={theme === 'dim'}
                    onChange={handleToggle}
                />
                
                {/* sun icon */}
                <Sun className="swap-off w-5 h-5" />
                
                {/* moon icon */}
                <Moon className="swap-on w-5 h-5" />
            </label>

            {showProfile && (
                <button className="btn btn-square btn-ghost">
                    <div className="avatar placeholder">
                        <div className="bg-neutral/20 text-neutral-content rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-xs font-bold text-neutral">ME</span>
                        </div>
                    </div> 
                </button>
            )}
        </div>
    </div>
  );
};
