'use client';

import Link from 'next/link';

// --- LOGO & HEADER ICONS (Reused from Landing Page) ---

const LogoSVG = () => (
  <svg width="140" height="40" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10, 15)">
      <path d="M5,0 L12,28 L20,6 L28,28 L35,0 L42,0 L31,34 L20,12 L9,34 L-2,0 Z" fill="#1B4F72"/>
      <path d="M12,28 C12,28 10,10 25,-4 L28,2 C18,10 17,24 17,24 Z" fill="#C4A46D"/>
    </g>
    <text x="55" y="44" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="36" fill="#1B4F72">ish</text>
    <text x="108" y="44" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="36" fill="#C4A46D">Pay</text>
  </svg>
);

const ScaleIconSmall = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#1B4F72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4V20" />
        <path d="M8 20H16" />
        <path d="M4 7H20" />
        <path d="M4 7L2 13H6L4 7Z" />
        <path d="M2 13C2 15.5 6 15.5 6 13" />
        <path d="M20 7L18 13H22L20 7Z" />
        <path d="M18 13C18 15.5 22 15.5 22 13" />
    </g>
  </svg>
);

const LostIcon = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Glassy Background Circle */}
    <circle cx="50" cy="50" r="48" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="1.5" strokeOpacity="0.4"/>
    
    {/* Tilted/Broken Scale */}
    <g transform="translate(50, 50) rotate(-15) translate(-50, -50) scale(0.6)">
        <path d="M50 10 V90" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
        <path d="M30 90 H70" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
        
        {/* Tilted Beam */}
        <g transform="rotate(20, 50, 25)">
            <path d="M15 25 H85" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
            {/* Left Pan (High) */}
            <path d="M15 25 L5 55 H25 L15 25 Z" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M5 55 Q15 70 25 55" stroke="#FFFFFF" strokeWidth="3" fill="white" fillOpacity="0.2"/>
            
            {/* Right Pan (Low) */}
            <path d="M85 25 L75 55 H95 L85 25 Z" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M75 55 Q85 70 95 55" stroke="#FFFFFF" strokeWidth="3" fill="white" fillOpacity="0.2"/>
        </g>
        
        <circle cx="50" cy="25" r="4" fill="#FFFFFF"/>
    </g>
    
    {/* Question Mark */}
    <text x="65" y="45" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="40" fill="#C5A66E" stroke="white" strokeWidth="1">?</text>
  </svg>
);

export default function NotFound() {
    return (
        <div className="bg-gray-100 text-slate-800 antialiased font-sans min-h-screen flex flex-col items-center justify-center">
            {/* Mobile Container Limit */}
            <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden min-h-screen relative flex flex-col">
                
                {/* Header */}
                <header className="flex justify-between items-center px-6 py-4 bg-white z-20 relative">
                    <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                        <LogoSVG />
                    </Link>
                    <div className="w-8 h-8 flex items-center justify-center opacity-80">
                       <ScaleIconSmall />
                    </div>
                </header>

                {/* Main Content with Diagonal Split Background */}
                <main className="relative w-full flex-1 flex flex-col items-center justify-center overflow-hidden">
                    
                    {/* Diagonal Background */}
                    <div className="absolute inset-0 z-0" 
                         style={{
                             background: 'linear-gradient(115deg, #C5A66E 0%, #C5A66E 50%, #103B6D 50.5%, #103B6D 100%)'
                         }}>
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col items-center text-center px-6 w-full mt-[-60px]">
                        
                        {/* 404 Text - Split Color */}
                        <div className="flex items-center justify-center font-extrabold text-[120px] leading-none tracking-tighter mix-blend-overlay opacity-50 select-none">
                            <span className="text-white mr-2">4</span>
                            <span className="text-white">0</span>
                            <span className="text-white ml-2">4</span>
                        </div>

                        {/* Icon */}
                        <div className="mb-8 mt-[-40px]">
                            <LostIcon />
                        </div>

                        {/* Text Content */}
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl w-full">
                            <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
                            <p className="text-white/90 text-lg mb-6 leading-relaxed">
                                Oops! It seems you've lost your balance. This page doesn't exist.
                            </p>
                            
                            <Link 
                                href="/dashboard" 
                                className="w-full bg-white text-[#103B6D] font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-gray-50 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                Back to Dashboard
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </Link>
                            
                            <div className="mt-4">
                                <Link href="/" className="text-white/70 text-sm hover:text-white underline decoration-white/30 hover:decoration-white transition-colors">
                                    Go to Landing Page
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white py-6 px-6 text-center border-t border-gray-100 z-20">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} WishPay. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
}