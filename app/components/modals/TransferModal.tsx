'use client';

import { useState, useEffect } from 'react';
import { X, Check, ArrowRightLeft, Wallet, CreditCard, ArrowRight } from 'lucide-react';
import { BankAccount } from '@/app/types';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (sourceId: string, destId: string, amount: number) => void;
    walletBalance: number;
    banks: BankAccount[];
    isWalletHidden?: boolean;
}

export function TransferModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    walletBalance, 
    banks,
    isWalletHidden = false
}: TransferModalProps) {
    const [amount, setAmount] = useState('');
    const [sourceId, setSourceId] = useState<string>('wallet');
    const [destId, setDestId] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            if (isWalletHidden) {
                // If wallet is hidden, default to first bank
                if (banks.length > 0) {
                    setSourceId(banks[0].id.toString());
                    // Set dest to second bank if available, else empty
                    setDestId(banks.length > 1 ? banks[1].id.toString() : '');
                } else {
                     setSourceId('');
                     setDestId('');
                }
            } else {
                setSourceId('wallet');
                // Default dest to first bank if available, else empty
                setDestId(banks.length > 0 ? banks[0].id.toString() : '');
            }
        }
    }, [isOpen, banks, isWalletHidden]);

    if (!isOpen) return null;

    const getBalance = (id: string) => {
        if (id === 'wallet') return walletBalance;
        return banks.find(b => b.id.toString() === id)?.balance || 0;
    };

    const sourceBalance = getBalance(sourceId);

    const handleConfirm = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;
        if (sourceId === destId) return;
        
        onConfirm(sourceId, destId, val);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                        <ArrowRightLeft className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Transfer Funds</h3>
                    <p className="text-indigo-100 text-sm mt-1">Move money between accounts</p>
                </div>

                <div className="p-6">
                    <div className="mb-4 text-center">
                         <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
                            {sourceId === 'wallet' ? 'WishPay Wallet' : (banks.find(b => b.id.toString() === sourceId)?.name || 'Bank Account')}
                         </p>
                         <p className="text-sm text-gray-500 mb-1">Available: <span className="font-semibold text-gray-700">₱{sourceBalance.toLocaleString()}</span></p>
                    </div>

                    <div className="relative mb-6">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">₱</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-2xl font-bold text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-0 transition-all placeholder:text-gray-300"
                            autoFocus
                        />
                    </div>

                    {/* Source Selector */}
                    <div className="mb-4 space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">From Account</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                {sourceId === 'wallet' ? <Wallet className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                            </div>
                            <select
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 font-medium focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                value={sourceId}
                                onChange={e => {
                                    setSourceId(e.target.value);
                                    if (e.target.value === destId) {
                                        // Pick a new destination that isn't the source
                                        if (e.target.value === 'wallet') {
                                             setDestId(banks[0]?.id.toString() || '');
                                        } else {
                                            if (!isWalletHidden) {
                                                setDestId('wallet');
                                            } else {
                                                const nextBank = banks.find(b => b.id.toString() !== e.target.value);
                                                setDestId(nextBank ? nextBank.id.toString() : '');
                                            }
                                        }
                                    }
                                }}
                            >
                                {!isWalletHidden && <option value="wallet">WishPay Wallet</option>}
                                {banks.map(bank => (
                                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                                ))}
                            </select>
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Destination Selector */}
                    <div className="mb-6 space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">To Account</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                {destId === 'wallet' ? <Wallet className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                            </div>
                            <select
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 font-medium focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                value={destId}
                                onChange={e => setDestId(e.target.value)}
                            >
                                {!isWalletHidden && <option value="wallet" disabled={sourceId === 'wallet'}>WishPay Wallet</option>}
                                {banks.map(bank => (
                                    <option key={bank.id} value={bank.id} disabled={sourceId === bank.id.toString()}>{bank.name}</option>
                                ))}
                            </select>
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                         <button 
                            disabled={(parseFloat(amount) || 0) + 100 > sourceBalance}
                            onClick={() => {
                                const current = parseFloat(amount) || 0;
                                setAmount(Math.min(current + 100, sourceBalance).toString());
                            }}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            +₱100
                         </button>
                         <button 
                            disabled={(parseFloat(amount) || 0) + 500 > sourceBalance}
                            onClick={() => {
                                const current = parseFloat(amount) || 0;
                                setAmount(Math.min(current + 500, sourceBalance).toString());
                            }}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            +₱500
                         </button>
                         <button 
                            disabled={(parseFloat(amount) || 0) + 1000 > sourceBalance}
                            onClick={() => {
                                const current = parseFloat(amount) || 0;
                                setAmount(Math.min(current + 1000, sourceBalance).toString());
                            }}
                            className="py-2 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            +₱1k
                         </button>
                         <button 
                            disabled={(parseFloat(amount) || 0) >= sourceBalance}
                            onClick={() => setAmount(sourceBalance.toString())}
                            className="py-2 rounded-xl bg-indigo-50 text-indigo-600 font-medium text-sm hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            Max
                         </button>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > sourceBalance || !destId}
                        className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        Confirm Transfer <Check className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}