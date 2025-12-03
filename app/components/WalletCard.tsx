import { useState } from 'react';
import { Wallet } from 'lucide-react';

interface WalletCardProps {
    balance: number;
    onCashIn: () => void;
    onCashOut: () => void;
}

export const WalletCard = ({ balance, onCashIn, onCashOut }: WalletCardProps) => {
    return (
        <div className="card bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-2xl overflow-hidden relative border border-white/10">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>

            <div className="card-body relative z-10 p-6 sm:p-8">
                <div className="flex items-center gap-2 opacity-80 mb-1">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Wallet className="w-4 h-4" />
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-widest">My Wallet</h2>
                </div>

                <div className="mt-2 mb-6">
                    <span className="text-5xl sm:text-6xl font-black tracking-tighter drop-shadow-sm">
                        {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(balance)}
                    </span>
                </div>

                <div className="flex gap-3 mt-auto">
                    <button
                        className="btn border-none bg-white/20 hover:bg-white/30 text-white flex-1 backdrop-blur-md shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        onClick={onCashIn}
                    >
                        + Cash In
                    </button>
                    <button
                        className="btn border-none bg-black/20 hover:bg-black/30 text-white flex-1 backdrop-blur-md shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        onClick={onCashOut}
                    >
                        - Remove
                    </button>
                </div>
            </div>
        </div>
    );
};
