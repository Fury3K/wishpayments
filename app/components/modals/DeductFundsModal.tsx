'use client';

import { useState, useEffect } from 'react';
import { X, Check, Wallet, CreditCard } from 'lucide-react';
import { BankAccount } from '@/app/types';

interface DeductFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
    itemName: string;
    currentSaved: number;
    fundingSourceName: string;
}

export function DeductFundsModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    itemName, 
    currentSaved,
    fundingSourceName
}: DeductFundsModalProps) {
    const [amount, setAmount] = useState('');
    
    useEffect(() => {
        if (isOpen) {
            setAmount('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;
        onConfirm(val);
        setAmount('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                        <span className="text-2xl">💸</span>
                    </div>
                    <h3 className="text-xl font-bold">Deduct Funds</h3>
                    <p className="text-slate-300 text-sm mt-1">From {itemName}</p>
                </div>

                <div className="p-6">
                    <div className="mb-4 text-center">
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                            Returning to {fundingSourceName}
                         </p>
                         <p className="text-sm text-gray-500">Available to Deduct: <span className="font-semibold text-gray-700">₱{currentSaved.toLocaleString()}</span></p>
                    </div>

                    <div className="relative mb-6">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">₱</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-2xl font-bold text-gray-800 focus:outline-none focus:border-slate-500 focus:ring-0 transition-all placeholder:text-gray-300"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                         <button 
                            disabled={(parseFloat(amount) || 0) + 100 > currentSaved}
                            onClick={() => {
                                const current = parseFloat(amount) || 0;
                                setAmount(Math.min(current + 100, currentSaved).toString());
                            }}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            +₱100
                         </button>
                         <button 
                            disabled={(parseFloat(amount) || 0) + 500 > currentSaved}
                            onClick={() => {
                                const current = parseFloat(amount) || 0;
                                setAmount(Math.min(current + 500, currentSaved).toString());
                            }}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            +₱500
                         </button>
                         <button 
                            disabled={(parseFloat(amount) || 0) + 1000 > currentSaved}
                            onClick={() => {
                                const current = parseFloat(amount) || 0;
                                setAmount(Math.min(current + 1000, currentSaved).toString());
                            }}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            +₱1k
                         </button>
                         <button 
                            disabled={(parseFloat(amount) || 0) >= currentSaved}
                            onClick={() => setAmount(currentSaved.toString())}
                            className="py-2 rounded-xl bg-slate-100 text-slate-600 font-medium text-sm hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            Max
                         </button>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentSaved}
                        className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        Confirm Deduction <Check className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}