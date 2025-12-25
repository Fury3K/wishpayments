'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface CashOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number, reason: string) => void;
    currentBalance: number;
}

export function CashOutModal({ isOpen, onClose, onConfirm, currentBalance }: CashOutModalProps) {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0 || val > currentBalance || !reason.trim()) return;
        onConfirm(val, reason);
        setAmount('');
        setReason('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                <div className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                        <span className="text-2xl">💸</span>
                    </div>
                    <h3 className="text-xl font-bold">Remove Funds</h3>
                    <p className="text-red-100 text-sm mt-1">Withdraw Funds</p>
                </div>

                <div className="p-6">
                    <div className="mb-4 text-center">
                         <p className="text-sm text-gray-500">Available Balance: <span className="font-semibold text-gray-700">₱{currentBalance.toLocaleString()}</span></p>
                    </div>

                    <div className="relative mb-4">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">₱</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-2xl font-bold text-gray-800 focus:outline-none focus:border-red-500 focus:ring-0 transition-all placeholder:text-gray-300"
                            autoFocus
                        />
                    </div>
                    
                    <div className="mb-6">
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason (e.g. Withdrawal)"
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-red-500 focus:ring-0 transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                         <button 
                            onClick={() => setAmount(Math.min(100, currentBalance).toString())}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
                         >
                            ₱100
                         </button>
                         <button 
                            onClick={() => setAmount(Math.min(500, currentBalance).toString())}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
                         >
                            ₱500
                         </button>
                         <button 
                            onClick={() => setAmount(currentBalance.toString())}
                            className="py-2 rounded-xl bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors"
                         >
                            Max
                         </button>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance || !reason.trim()}
                        className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        Confirm <Check className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}