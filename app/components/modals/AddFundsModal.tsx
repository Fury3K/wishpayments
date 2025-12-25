'use client';

import { useState, useEffect } from 'react';
import { X, Check, Wallet, CreditCard } from 'lucide-react';
import { BankAccount } from '@/app/types';

interface AddFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number, bankId: number | null) => void;
    itemName: string;
    currentSaved: number;
    price: number;
    walletBalance: number;
    banks: BankAccount[];
    defaultBankId?: number | null;
}

export function AddFundsModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    itemName, 
    currentSaved, 
    price, 
    walletBalance, 
    banks, 
    defaultBankId 
}: AddFundsModalProps) {
    const [amount, setAmount] = useState('');
    const [sourceAccountId, setSourceAccountId] = useState<string>('wallet');
    
    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setSourceAccountId(defaultBankId ? defaultBankId.toString() : 'wallet');
        }
    }, [isOpen, defaultBankId]);

    const remaining = price - currentSaved;

    const getSelectedBalance = () => {
        if (sourceAccountId === 'wallet') return walletBalance;
        const bank = banks.find(b => b.id.toString() === sourceAccountId);
        return bank?.balance || 0;
    };

    const currentBalance = getSelectedBalance();

    if (!isOpen) return null;

    const handleConfirm = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;
        
        const bankId = sourceAccountId === 'wallet' ? null : parseInt(sourceAccountId);
        onConfirm(val, bankId);
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
                         <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                            {sourceAccountId === 'wallet' ? 'WishPay Wallet' : (banks.find(b => b.id.toString() === sourceAccountId)?.name || 'Bank Account')}
                         </p>
                         <p className="text-sm text-gray-500 mb-1">Source Balance: <span className="font-semibold text-gray-700">₱{currentBalance.toLocaleString()}</span></p>
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

                    {/* Source Selector */}
                    <div className="mb-6 space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">From Account</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                {sourceAccountId === 'wallet' ? <Wallet className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                            </div>
                            <select
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 font-medium focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                value={sourceAccountId}
                                onChange={e => setSourceAccountId(e.target.value)}
                            >
                                <option value="wallet">WishPay Wallet</option>
                                {banks.map(bank => (
                                    <option key={bank.id} value={bank.id}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                         <button 
                            disabled={(parseFloat(amount) || 0) + 100 > currentBalance || (parseFloat(amount) || 0) >= remaining}
                            onClick={() => {
                                const current = parseFloat(amount) || 0;
                                setAmount(Math.min(current + 100, remaining).toString());
                            }}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            +₱100
                         </button>
                         <button 
                            disabled={(parseFloat(amount) || 0) + 500 > currentBalance || (parseFloat(amount) || 0) >= remaining}
                            onClick={() => {
                                const current = parseFloat(amount) || 0;
                                setAmount(Math.min(current + 500, remaining).toString());
                            }}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            +₱500
                         </button>
                         <button 
                            disabled={(parseFloat(amount) || 0) + 1000 > currentBalance || (parseFloat(amount) || 0) >= remaining}
                            onClick={() => {
                                const current = parseFloat(amount) || 0;
                                setAmount(Math.min(current + 1000, remaining).toString());
                            }}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            +₱1k
                         </button>
                         <button 
                            disabled={(parseFloat(amount) || 0) >= Math.min(remaining, currentBalance)}
                            onClick={() => setAmount(Math.min(remaining, currentBalance).toString())}
                            className="py-2 rounded-xl bg-blue-50 text-blue-600 font-medium text-sm hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            Max
                         </button>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance}
                        className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        Confirm Transfer <Check className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}