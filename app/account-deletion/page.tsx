'use client';

import Link from 'next/link';

export default function AccountDeletionInstructions() {
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
            <h1 className="text-xl font-bold text-[#103B6D]">Data Deletion</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
            <div className="prose prose-sm prose-slate max-w-none">
                
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-[#103B6D] mb-4">How to Delete Your Data</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        At WishPay, we respect your privacy and your right to control your data. If you wish to delete your account and all associated data, please follow these steps within our application:
                    </p>

                    <ol className="list-decimal pl-5 space-y-3 text-gray-700 font-medium marker:text-[#103B6D] marker:font-bold">
                        <li>
                            <span className="block mb-1">Log In</span>
                            <span className="text-sm font-normal text-gray-500">Access your account at <Link href="/login" className="text-blue-600 underline">wishpay.com/login</Link>.</span>
                        </li>
                        <li>
                            <span className="block mb-1">Go to Profile</span>
                            <span className="text-sm font-normal text-gray-500">Tap on the Profile icon in the bottom navigation bar.</span>
                        </li>
                        <li>
                            <span className="block mb-1">Access Privacy Settings</span>
                            <span className="text-sm font-normal text-gray-500">Scroll down and select the <strong>"Privacy & Data"</strong> option.</span>
                        </li>
                        <li>
                            <span className="block mb-1">Delete Account</span>
                            <span className="text-sm font-normal text-gray-500">Click the <strong>"Delete Account"</strong> button and confirm your choice.</span>
                        </li>
                    </ol>
                </section>

                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8">
                    <h3 className="text-red-800 font-bold mb-2 flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        Important Note
                    </h3>
                    <p className="text-sm text-red-700 leading-relaxed">
                        Deleting your account is <strong>permanent</strong>. All your savings goals, transaction history, and wallet information will be immediately erased from our servers and cannot be recovered.
                    </p>
                </div>

                <section className="mb-6">
                    <h2 className="text-lg font-bold text-[#103B6D] mb-2">Can't access your account?</h2>
                    <p className="text-gray-600 leading-relaxed">
                        If you are unable to log in to perform these steps, or if you logged in via Facebook/Google and want to request data deletion externally, please contact our support team:
                    </p>
                    <a href="mailto:wishpaymentscorp@gmail.com" className="block mt-3 text-blue-600 font-medium hover:underline">
                        wishpaymentscorp@gmail.com
                    </a>
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
