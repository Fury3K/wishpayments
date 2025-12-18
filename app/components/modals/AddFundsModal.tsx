'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface AddFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
    itemName: string;
    currentSaved: number;
    price: number;
    walletBalance: number;
}

export function AddFundsModal({ isOpen, onClose, onConfirm, itemName, currentSaved, price, walletBalance }: AddFundsModalProps) {
    const [amount, setAmount] = useState('');
    const remaining = price - currentSaved;

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
                <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                        <span className="text-2xl">💰</span>
                    </div>
                    <h3 className="text-xl font-bold">Add Funds</h3>
                    <p className="text-blue-100 text-sm mt-1">To {itemName}</p>
                </div>

                <div className="p-6">
                    <div className="mb-4 text-center">
                         <p className="text-sm text-gray-500 mb-1">Wallet Balance: <span className="font-semibold text-gray-700">₱{walletBalance.toLocaleString()}</span></p>
                         <p className="text-sm text-gray-500">Remaining Goal: <span className="font-semibold text-gray-700">₱{remaining.toLocaleString()}</span></p>
                    </div>

                    <div className="relative mb-6">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">₱</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-2xl font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-300"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                         <button 
                            onClick={() => setAmount(Math.min(100, remaining).toString())}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
                         >
                            +₱100
                         </button>
                         <button 
                            onClick={() => setAmount(Math.min(500, remaining).toString())}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
                         >
                            +₱500
                         </button>
                         <button 
                            onClick={() => setAmount(Math.min(1000, remaining).toString())}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
                         >
                            +₱1k
                         </button>
                         <button 
                            onClick={() => setAmount(Math.min(remaining, walletBalance).toString())}
                            className="py-2 rounded-xl bg-blue-50 text-blue-600 font-medium text-sm hover:bg-blue-100 transition-colors"
                         >
                            Max
                         </button>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance}
                        className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        Confirm Transfer <Check className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}