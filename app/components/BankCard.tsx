'use client';

import { Plus, Minus, Settings } from 'lucide-react';

interface BankCardProps {
    name: string;
    balance: number;
    color: string;
    onCashIn: () => void;
    onCashOut: () => void;
    onEdit?: () => void;
}

export function BankCard({ name, balance, color, onCashIn, onCashOut, onEdit }: BankCardProps) {
    const getGradient = (colorId: string) => {
        switch (colorId) {
            case 'purple': return 'from-purple-600 to-indigo-600';
            case 'green': return 'from-emerald-600 to-teal-500';
            case 'orange': return 'from-orange-500 to-red-500';
            case 'black': return 'from-gray-800 to-gray-900';
            case 'blue':
            default: return 'from-[#1c3d9c] to-[#3b6ce3]';
        }
    };

    const getShadowColor = (colorId: string) => {
         switch (colorId) {
            case 'purple': return 'shadow-purple-500/30';
            case 'green': return 'shadow-emerald-500/30';
            case 'orange': return 'shadow-orange-500/30';
            case 'black': return 'shadow-gray-500/30';
            case 'blue':
            default: return 'shadow-blue-500/30';
        }
    }

    return (
        <div className={`rounded-3xl bg-gradient-to-br ${getGradient(color)} p-8 text-white relative overflow-hidden shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] min-w-full snap-center shrink-0`}>
            {onEdit && (
                <button 
                    onClick={onEdit}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm z-20"
                >
                    <Settings className="w-4 h-4 text-white" />
                </button>
            )}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                 <svg className="w-full h-full text-white fill-current" preserveAspectRatio="none" viewBox="0 0 375 220"><path d="M0,140 C80,140 100,80 180,80 S280,160 375,120 V220 H0 Z"></path></svg>
            </div>
            <div className="relative z-10 flex flex-col items-center">
                <span className="text-white/80 text-sm font-medium mb-1 tracking-wide">{name}</span>
                <h2 className="text-4xl font-bold tracking-tight mb-8">₱{balance.toLocaleString()}</h2>
                
                <div className="flex items-start justify-center gap-12 w-full">
                    <div className="flex flex-col items-center gap-2">
                        <button 
                            onClick={onCashIn}
                            className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 active:scale-95 transition-transform shadow-lg`}
                        >
                            <Plus className="text-white w-6 h-6" />
                        </button>
                        <span className="text-sm font-medium text-white/90">Cash In</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <button 
                            onClick={onCashOut}
                            className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 active:scale-95 transition-transform shadow-lg`}
                        >
                            <Minus className="text-white w-6 h-6" />
                        </button>
                        <span className="text-sm font-medium text-white/90">Remove</span>
                    </div>
                </div>
            </div>
        </div>
    );
}