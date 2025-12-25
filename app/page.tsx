'use client';

import Link from 'next/link';

// --- 1. LOGO & HEADER ICONS ---

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

// UPDATED: Matches the geometry of the main scale
const ScaleIconSmall = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#1B4F72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Base and Stand */}
        <path d="M12 4V20" />
        <path d="M8 20H16" />
        {/* Beam */}
        <path d="M4 7H20" />
        {/* Left Pan & Hanger */}
        <path d="M4 7L2 13H6L4 7Z" />
        <path d="M2 13C2 15.5 6 15.5 6 13" />
        {/* Right Pan & Hanger */}
        <path d="M20 7L18 13H22L20 7Z" />
        <path d="M18 13C18 15.5 22 15.5 22 13" />
    </g>
  </svg>
);

// --- 2. HERO SECTION ICONS ---

const NeedsIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2">
    {/* House */}
    <path d="M10 28 L28 12 L46 28 V52 H10 V28 Z" strokeLinejoin="round" />
    <rect x="18" y="32" width="8" height="8" />
    {/* Groceries Bag overlay */}
    <path d="M42 52 V36 C42 32 46 28 50 28 C54 28 58 32 58 36 V52 H42 Z" fill="#C5A66E" fillOpacity="0.2" />
    <path d="M50 34 V52" strokeOpacity="0.5"/>
  </svg>
);

const WantsIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2">
    {/* Suitcase */}
    <rect x="28" y="16" width="28" height="36" rx="2" />
    <path d="M36 16 V10 H48 V16" />
    <path d="M28 26 H56" />
    {/* Camera overlay */}
    <rect x="4" y="32" width="28" height="20" rx="2" fill="#103B6D" fillOpacity="0.3" />
    <circle cx="18" cy="42" r="5" />
    <rect x="22" y="28" width="6" height="4" />
  </svg>
);

const CentralScale = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Glassy Background Circle */}
    <circle cx="50" cy="50" r="48" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
    
    {/* The Scale Icon Group */}
    <g transform="translate(20, 20) scale(0.6)">
        <path d="M50 10 V90" stroke="#103B6D" strokeWidth="4" strokeLinecap="round"/>
        <path d="M30 90 H70" stroke="#103B6D" strokeWidth="4" strokeLinecap="round"/>
        <path d="M15 25 H85" stroke="#103B6D" strokeWidth="4" strokeLinecap="round"/>
        <path d="M15 25 L5 55 H25 L15 25 Z" stroke="#103B6D" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M5 55 Q15 70 25 55" stroke="#103B6D" strokeWidth="3" fill="white" fillOpacity="0.8"/>
        <path d="M85 25 L75 55 H95 L85 25 Z" stroke="#103B6D" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M75 55 Q85 70 95 55" stroke="#103B6D" strokeWidth="3" fill="white" fillOpacity="0.8"/>
        <circle cx="50" cy="25" r="4" fill="#103B6D"/>
    </g>
  </svg>
);

// --- 4. FEATURE ICONS ---

const JarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#103B6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8Z" />
    <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    <path d="M12 12v4" />
    <path d="M10 14h4" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#103B6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M9 16l2 2l4 -4" />
  </svg>
);

// UPDATED: A better "Stocks/Progress" line chart with arrow
const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#103B6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 20h18" /> {/* X-axis */}
    <path d="M3 16l5-5l4 4l7-8" /> {/* Trend line */}
    <path d="M15 7h4v4" /> {/* Arrow tip */}
    <path d="M7 20v-4" />
    <path d="M12 20v-8" />
    <path d="M17 20v-10" />
  </svg>
);


// --- MAIN COMPONENT ---

export default function Home() {
    return (
        <div className="bg-gray-100 text-slate-800 antialiased font-sans min-h-screen flex flex-col items-center">
            {/* Mobile Container Limit */}
            <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden min-h-screen relative flex flex-col">
                
                {/* Header */}
                <header className="flex justify-between items-center px-6 py-4 bg-white z-20 relative">
                    <div className="flex items-center">
                        <LogoSVG />
                    </div>
                    {/* Updated Small Scale Icon */}
                    <div className="w-8 h-8 flex items-center justify-center opacity-80">
                       <ScaleIconSmall />
                    </div>
                </header>

                {/* Hero Section with Diagonal Split */}
                <section className="relative w-full h-[580px] pb-20 overflow-hidden">
                    
                    {/* The Diagonal Background using Linear Gradient */}
                    <div className="absolute inset-0 z-0" 
                         style={{
                             background: 'linear-gradient(115deg, #C5A66E 0%, #C5A66E 50%, #103B6D 50.5%, #103B6D 100%)'
                         }}>
                    </div>

                    {/* Needs Content (Left/Top - Gold side) */}
                    <div className="absolute top-8 left-6 w-1/2 z-10 text-white">
                        <div className="mb-2 relative">
                            {/* Glow effect behind icon */}
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white opacity-20 blur-xl rounded-full"></div>
                            <NeedsIcon />
                        </div>
                        <h2 className="text-[22px] font-extrabold leading-none mb-1 opacity-90 tracking-wide">NEEDS:</h2>
                        <p className="text-xl font-medium leading-tight mb-1">Secure your<br/>foundation.</p>
                        <p className="text-sm font-light opacity-80">Essentials First.</p>
                    </div>

                    {/* Wants Content (Right/Middle - Blue side) */}
                    <div className="absolute top-[170px] right-4 w-1/2 z-10 text-white flex flex-col items-end text-right">
                        <div className="mb-2">
                            <WantsIcon />
                        </div>
                        <h2 className="text-[22px] font-extrabold leading-none mb-1 opacity-90 tracking-wide">WANTS:</h2>
                        <p className="text-xl font-medium leading-tight mb-1">Plan for your<br/>dreams.</p>
                        <p className="text-sm font-light opacity-80">Future Goals.</p>
                    </div>

                    {/* Center Scale & Beam */}
                    <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                        {/* Beam of light */}
                        <div className="absolute top-[40px] w-24 h-64 bg-gradient-to-b from-white via-transparent to-transparent opacity-20 blur-lg pointer-events-none"></div>
                        
                        {/* The Updated Icon Container */}
                        <div className="relative z-30 drop-shadow-2xl filter scale-110">
                            <CentralScale />
                        </div>

                        {/* Dot of light at bottom of scale */}
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_4px_rgba(255,255,255,0.9)] mt-2"></div>
                    </div>

                    {/* Tagline - UPDATED TEXT COLOR */}
                    <div className="absolute bottom-28 left-0 w-full text-center px-4 z-10">
                        <h1 className="text-[18px] text-white/95 leading-relaxed">
                            Achieve Financial Balance.<br />
                            <span className="text-white font-semibold">Prioritize Smartly.</span>
                        </h1>
                    </div>
                </section>

                {/* Floating Feature Card */}
                <div className="relative z-30 -mt-[80px] mx-5 mb-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-[24px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] p-6 flex justify-between items-start border border-gray-100">
                        <div className="flex flex-col items-center text-center w-1/3">
                            <div className="w-[56px] h-[56px] bg-[#FAF8F3] border border-[#C5A66E]/20 rounded-full flex items-center justify-center mb-3">
                                <JarIcon />
                            </div>
                            <span className="text-[11px] font-bold text-gray-700 leading-tight tracking-tight uppercase">Smart<br />Saving</span>
                        </div>
                        <div className="flex flex-col items-center text-center w-1/3">
                            <div className="w-[56px] h-[56px] bg-[#FAF8F3] border border-[#C5A66E]/20 rounded-full flex items-center justify-center mb-3">
                                <CalendarIcon />
                            </div>
                            <span className="text-[11px] font-bold text-gray-700 leading-tight tracking-tight uppercase">Goal<br />Tracking</span>
                        </div>
                        <div className="flex flex-col items-center text-center w-1/3">
                            <div className="w-[56px] h-[56px] bg-[#FAF8F3] border border-[#C5A66E]/20 rounded-full flex items-center justify-center mb-3">
                                {/* Updated Chart Icon */}
                                <ChartIcon />
                            </div>
                            <span className="text-[11px] font-bold text-gray-700 leading-tight tracking-tight uppercase">Progress<br />Insights</span>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <footer className="mt-auto pb-8 px-6 flex flex-col items-center w-full">
                    <div className="w-full flex gap-4 mb-6">
                        <Link href="/register" className="flex-1 bg-[#103B6D] hover:bg-[#0A2A4F] text-white font-bold py-4 px-4 rounded-full shadow-[0_4px_14px_rgba(16,59,109,0.4)] transition duration-200 flex items-center justify-center group text-sm">
                            Register Now
                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link href="/login" className="flex-1 bg-transparent border border-[#103B6D] text-[#103B6D] font-bold py-4 px-4 rounded-full hover:bg-gray-50 transition duration-200 text-center flex items-center justify-center text-sm">
                            Login
                        </Link>
                    </div>
                    <a className="text-xs text-gray-500 underline decoration-gray-300 hover:text-[#103B6D] mb-6" href="#">
                        Learn More About Our Features
                    </a>
                    <div className="text-[10px] text-gray-400">
                        © {new Date().getFullYear()} WishPay. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
}