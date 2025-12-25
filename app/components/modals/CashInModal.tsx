'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface CashInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
}

export function CashInModal({ isOpen, onClose, onConfirm }: CashInModalProps) {
    const [amount, setAmount] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;
        onConfirm(val);
        setAmount('');
        onClose();
    };

    const handleAddAmount = (val: number) => {
        setAmount(prev => {
            const current = parseFloat(prev) || 0;
            return (current + val).toString();
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                        <span className="text-2xl">💵</span>
                    </div>
                    <h3 className="text-xl font-bold">Cash In</h3>
                    <p className="text-green-100 text-sm mt-1">Add funds to your wallet</p>
                </div>

                <div className="p-6">
                    <div className="relative mb-6">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">₱</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-2xl font-bold text-gray-800 focus:outline-none focus:border-green-500 focus:ring-0 transition-all placeholder:text-gray-300"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                         <button 
                            onClick={() => handleAddAmount(100)}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
                         >
                            +₱100
                         </button>
                         <button 
                            onClick={() => handleAddAmount(500)}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
                         >
                            +₱500
                         </button>
                         <button 
                            onClick={() => handleAddAmount(1000)}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
                         >
                            +₱1k
                         </button>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={!amount || parseFloat(amount) <= 0}
                        className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        Confirm <Check className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}