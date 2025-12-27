'use client';

import Link from 'next/link';
import { 
  Scale, 
  CreditCard, 
  Target, 
  AlertCircle, 
  LayoutDashboard,
  Wallet,
  ArrowRight
} from 'lucide-react';

export default function Features() {
  return (
    <div className="bg-gray-100 text-slate-800 antialiased font-sans min-h-screen flex flex-col items-center">
      {/* Mobile Container Limit */}
      <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden min-h-screen relative flex flex-col">
        
        {/* Header */}
        <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-4 sticky top-0 z-20">
            <Link href="/" className="text-gray-500 hover:text-[#103B6D] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </Link>
            <h1 className="text-xl font-bold text-[#103B6D]">Key Features</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-8">
            
            {/* Intro Section */}
            <section className="px-6 py-8 bg-[#FAF8F3]">
                <h2 className="text-2xl font-bold text-[#103B6D] mb-3 leading-tight">
                    More Than Just<br/>Budgeting.
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                    WishPay isn't just about tracking expenses. It's about finding the perfect balance between your daily necessities and your lifelong dreams.
                </p>
            </section>

            <div className="px-6 -mt-4 space-y-6">

                {/* Feature 1: Smart Categorization */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-[#103B6D]">
                        <Scale size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Smart Categorization</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Distinctly separate your <strong>Needs</strong> (Essentials) from your <strong>Wants</strong> (Wishes). Never accidentally spend rent money on a new gadget.
                        </p>
                    </div>
                </div>

                {/* Feature 2: Flexible Funding */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0 text-[#C5A66E]">
                        <Wallet size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Flexible Funding</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Link goals to your main <strong>Wallet</strong> or specific <strong>Bank Accounts</strong>. Money is deducted from the correct source automatically.
                        </p>
                    </div>
                </div>

                {/* Feature 3: Multi-Bank Colors */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                        <CreditCard size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Multi-Bank Colors</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Customize up to 9 different bank accounts with unique color codes. Visual strips on every transaction show exactly where the money came from.
                        </p>
                    </div>
                </div>

                 {/* Feature 4: Priority System */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500">
                        <AlertCircle size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Priority Safeguards</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Mark essentials as <strong>High Priority</strong>. Our system warns you if you try to fund "Wants" while high-priority "Needs" are still neglected.
                        </p>
                    </div>
                </div>

                {/* Feature 5: Goal Tracking */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                        <Target size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Visual Progress</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Watch your goals grow with beautiful progress bars. See exactly how close you are to that vacation or new car.
                        </p>
                    </div>
                </div>

            </div>

             {/* CTA Section */}
             <div className="px-6 py-10 text-center">
                <h3 className="text-lg font-bold text-[#103B6D] mb-4">Ready to take control?</h3>
                <Link href="/register" className="w-full bg-[#103B6D] hover:bg-[#0A2A4F] text-white font-bold py-4 px-4 rounded-full shadow-xl transition duration-200 flex items-center justify-center group text-sm">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>

        </main>

        {/* Footer */}
        <footer className="px-6 py-6 bg-gray-50 text-center border-t border-gray-100">
             <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} WishPay. All rights reserved.
            </p>
        </footer>

      </div>
    </div>
  );
}
