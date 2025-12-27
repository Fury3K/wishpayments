'use client';

import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="bg-gray-100 text-slate-800 antialiased font-sans min-h-screen flex flex-col items-center">
      {/* Mobile Container Limit */}
      <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden min-h-screen relative flex flex-col">
        
        {/* Header */}
        <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-4 sticky top-0 z-10">
            <Link href="/" className="text-gray-500 hover:text-[#103B6D] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </Link>
            <h1 className="text-xl font-bold text-[#103B6D]">Terms of Service</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
            <div className="prose prose-sm prose-slate max-w-none">
                <p className="text-xs text-gray-500 mb-6">Last Updated: December 27, 2025</p>

                <section className="mb-6">
                    <h2 className="text-lg font-bold text-[#103B6D] mb-2">1. Acceptance of Terms</h2>
                    <p className="text-gray-600 leading-relaxed">
                        By accessing or using the WishPay application ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-bold text-[#103B6D] mb-2">2. Description of Service</h2>
                    <p className="text-gray-600 leading-relaxed">
                        WishPay is a financial goal tracking application designed to help users categorize their finances into "Needs" and "Wants." It allows users to track savings goals and visualize progress.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-2 font-medium bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        Important: WishPay is a tracking tool only. We are not a bank or financial institution. We do not hold, process, or transfer actual monetary funds. All "balances" and "transactions" within the app are virtual records for tracking purposes only.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-bold text-[#103B6D] mb-2">3. User Accounts</h2>
                    <p className="text-gray-600 leading-relaxed">
                        To use the Service, you must register for an account. You agree to provide accurate information and to keep your password secure. You are responsible for all activity that occurs under your account.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-bold text-[#103B6D] mb-2">4. Privacy & Data</h2>
                    <p className="text-gray-600 leading-relaxed">
                        We value your privacy. Your financial data is stored securely and is used solely for the purpose of providing the tracking service. We do not sell your personal data to third parties.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-bold text-[#103B6D] mb-2">5. Disclaimer of Warranties</h2>
                    <p className="text-gray-600 leading-relaxed">
                        The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service will be error-free or uninterrupted. You use the Service at your own risk.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-bold text-[#103B6D] mb-2">6. Limitation of Liability</h2>
                    <p className="text-gray-600 leading-relaxed">
                        WishPay shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Service, including but not limited to loss of data or financial planning errors.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-bold text-[#103B6D] mb-2">7. Contact Us</h2>
                    <p className="text-gray-600 leading-relaxed">
                        If you have any questions about these Terms, please contact us at wishpaymentscorp@gmail.com.
                    </p>
                </section>
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
