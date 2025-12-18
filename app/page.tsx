'use client';

import Link from 'next/link';

export default function Home() {
    return (
        <div className="bg-gray-50 text-slate-800 antialiased font-poppins min-h-screen flex flex-col items-center">
            <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden min-h-screen relative flex flex-col">
                <header className="flex justify-between items-center px-6 py-5 bg-white z-20 relative">
                    <div className="flex items-center text-2xl font-bold tracking-tight">
                        <span style={{ color: '#103B6D', fontWeight: 'bold' }}>Wish</span>
                        <span style={{ color: '#C5A059', fontWeight: 'bold' }}>Pay</span>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center">
                        <img 
                            alt="Legal Scale" 
                            className="object-contain opacity-80" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV2ZN6UChZu_exSSlcn-brqAZaDMitiYLZl_66sTteWmXsjfqgaD29EilAu7736mhSpj_0HRQsRtwAyH65wN7bxLiFKWm2PIHT71olw1SSCP2rc5TIWa4nJnRx6DR_526oaJtm9qnB5ERVWIydNk65C4YyE6LiiP1WDaPxSACJZUqmHF3NRCOIxK33uKqzLYfRRdBECm-NoDNYry0QHYH4vmIvKDYdOUI_C_M17bGmPSjbs8mKFVoOr0ohT12sRu-IJPQO6ZZkjizo" 
                            style={{ width: '24px' }} 
                        />
                    </div>
                </header>

                <section className="hero-split-bg w-full h-[580px] relative text-white pb-20">
                    <div className="absolute top-12 left-0 w-1/2 z-10 pl-[20px] pr-4">
                        <div className="mb-3">
                            <div className="glass-icon w-[60px] h-[60px] rounded-2xl flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-[32px] text-white drop-shadow-sm">shopping_bag</span>
                            </div>
                        </div>
                        <h2 className="text-[20px] font-bold mb-1 text-white drop-shadow-sm opacity-95">NEEDS:</h2>
                        <p className="text-lg leading-tight font-medium mb-1 drop-shadow-sm">Secure your foundation.</p>
                        <p className="text-sm font-light opacity-80">Essentials First.</p>
                    </div>

                    <div className="absolute top-[180px] right-0 w-1/2 z-10 pr-[20px] pl-4 flex flex-col items-end text-right">
                        <div className="mb-3">
                            <div className="glass-icon w-[60px] h-[60px] rounded-2xl flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-[32px] text-white drop-shadow-sm">flight</span>
                            </div>
                        </div>
                        <h2 className="text-[20px] font-bold mb-1 text-white drop-shadow-sm opacity-95">WANTS:</h2>
                        <p className="text-lg leading-tight font-medium mb-1 drop-shadow-sm">Plan for your dreams.</p>
                        <p className="text-sm font-light opacity-80">Future Goals.</p>
                    </div>

                    <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                        <div className="glass-circle w-28 h-28 rounded-full flex items-center justify-center relative z-20">
                            <img 
                                alt="Balance Scale" 
                                className="w-[50px] h-[50px] object-contain opacity-80" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV2ZN6UChZu_exSSlcn-brqAZaDMitiYLZl_66sTteWmXsjfqgaD29EilAu7736mhSpj_0HRQsRtwAyH65wN7bxLiFKWm2PIHT71olw1SSCP2rc5TIWa4nJnRx6DR_526oaJtm9qnB5ERVWIydNk65C4YyE6LiiP1WDaPxSACJZUqmHF3NRCOIxK33uKqzLYfRRdBECm-NoDNYry0QHYH4vmIvKDYdOUI_C_M17bGmPSjbs8mKFVoOr0ohT12sRu-IJPQO6ZZkjizo" 
                            />
                        </div>
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_4px_rgba(255,255,255,0.8)] absolute top-[160px]"></div>
                    </div>

                    <div className="absolute bottom-24 left-0 w-full text-center px-4 z-10">
                        <h1 className="text-[18px] font-medium text-white drop-shadow-md text-center mt-5">
                            Achieve Financial Balance.<br />
                            <span className="text-white/90 font-normal">Prioritize Smartly.</span>
                        </h1>
                    </div>
                </section>

                <div className="relative z-30 -mt-[40px] mx-4 mb-8">
                    <div className="bg-white rounded-[20px] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-6 flex justify-between items-start">
                        <div className="flex flex-col items-center text-center w-1/3 px-1">
                            <div className="w-[60px] h-[60px] bg-[#F5F5F5] rounded-full flex items-center justify-center mb-2">
                                <img 
                                    alt="Smart Saving" 
                                    className="w-[30px] h-[30px] object-contain opacity-80" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnqJy0ffnvIdPV5IWAO4HBH7EoOPC_1ndm4SouZpM7jh8IHsPQhFhFAubDcDiNrSlzMFZm36y7yKOAXi9YL42J5jqKypwHOG-TB1OxWNgRlxw5H_4Qz2mRbDLsemT7E1TroWdJyKYk4d88ux4_WttmM7pxReWhwZ3Givcp30JwyoD6Gsa5zS-o54WGX2vSCuffk1be6U6xn2BTwwzI40OoV_POQFJlWcTYa9kSCH-a1e84tyt7e-phw65EdnyRQWhSMUR3XB9uteAQ" 
                                />
                            </div>
                            <span className="text-xs font-semibold text-gray-800 leading-tight">Smart<br />Saving</span>
                        </div>
                        <div className="flex flex-col items-center text-center w-1/3 px-1">
                            <div className="w-[60px] h-[60px] bg-[#F5F5F5] rounded-full flex items-center justify-center mb-2">
                                <img 
                                    alt="Goal Tracking" 
                                    className="w-[30px] h-[30px] object-contain opacity-80" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLRa8ar0XfWNxHD35RavfEDUkjGW8mTyvxL5t9ddcAI7l7HuD1TtgHQH06F3FHkhJF0wRRoQIV1-tuu7fgUPU5qGcxD1ScmSAc93A8mdqRFFbGujrKESI49LWy_nubEBpHuLfl7jAyYgmbvvTXjhaoBh150ZK8JFmSLWSMROR2BFQKZk3j0y2KFBcYtDG72O7Y64xNaD8YeiFAookHRPqCqqGVAWc8hL-VTJxRYjkJsDer6JIMiShbtkdY1u6tG3OaeR4yJ2nuz_A5" 
                                />
                            </div>
                            <span className="text-xs font-semibold text-gray-800 leading-tight">Goal<br />Tracking</span>
                        </div>
                        <div className="flex flex-col items-center text-center w-1/3 px-1">
                            <div className="w-[60px] h-[60px] bg-[#F5F5F5] rounded-full flex items-center justify-center mb-2">
                                <img 
                                    alt="Progress Insights" 
                                    className="w-[30px] h-[30px] object-contain opacity-80" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-ubInrOTRzo-TinL7RAJApiBPq8xuNLGRNFqme4ZqCyiPMwrIzB1x5Dr_X0RnDcki2IMxLNZT3NnoiBXphZ7BknqroiyRxOf32ZAb_PoDa7JfQ23vsrlIJb9hAuF331ODUPJkh90OLfASDwPwhEBi2OtMrGXSFlKrH7XRb0ZdP9gxqN8HJ065mGKySPqgDzFW8p0-NPwmthkR1oR4qWsmFVFRIPxkJPQQriuRWZxwM1W5gArtJGSu_nMtV_sKa1F4Wie37P7lCWBf" 
                                />
                            </div>
                            <span className="text-xs font-semibold text-gray-800 leading-tight">Progress<br />Insights</span>
                        </div>
                    </div>
                </div>

                <footer className="mt-auto pb-8 px-6 flex flex-col items-center w-full">
                    <div className="w-full flex gap-4 mb-6">
                        <Link href="/register" className="flex-1 bg-[#103B6D] hover:bg-[#0A2A4F] text-white font-medium py-3.5 px-4 rounded-full shadow-lg transition duration-200 flex items-center justify-center group">
                            Register Now
                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link href="/login" className="flex-1 bg-white border border-[#103B6D] text-[#103B6D] font-medium py-3.5 px-4 rounded-full hover:bg-gray-50 transition duration-200 text-center flex items-center justify-center">
                            Login
                        </Link>
                    </div>
                    <a className="text-sm text-gray-600 underline decoration-gray-400 hover:text-[#103B6D] mb-8" href="#">
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