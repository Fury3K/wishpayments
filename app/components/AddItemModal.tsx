'use client';

import { useState, useEffect } from 'react';
import { Item, ItemType, Priority, BankAccount } from '../types';
import { X, Check, Tag, DollarSign, Flame, Zap, Leaf, Wallet, CreditCard } from 'lucide-react';

interface ItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: any) => void;
    activeTab: ItemType;
    itemToEdit?: Item | null;
    banks: BankAccount[];
    walletBalance: number;
    isWalletHidden?: boolean;
}

export const ItemModal = ({ isOpen, onClose, onSave, activeTab, itemToEdit, banks, walletBalance, isWalletHidden = false }: ItemModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        saved: '0',
        priority: 'medium' as Priority,
        sourceAccountId: 'wallet'
    });

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setFormData({
                    name: itemToEdit.name,
                    price: itemToEdit.price.toString(),
                    saved: itemToEdit.saved.toString(),
                    priority: itemToEdit.priority,
                    sourceAccountId: itemToEdit.bankId ? itemToEdit.bankId.toString() : (isWalletHidden ? (banks[0]?.id.toString() || '') : 'wallet')
                });
            } else {
                setFormData({
                    name: '',
                    price: '',
                    saved: '0',
                    priority: 'medium',
                    sourceAccountId: isWalletHidden ? (banks[0]?.id.toString() || '') : 'wallet'
                });
            }
        }
    }, [isOpen, itemToEdit, isWalletHidden, banks]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            type: activeTab,
            id: itemToEdit?.id,
            bankId: formData.sourceAccountId === 'wallet' ? null : parseInt(formData.sourceAccountId)
        });
    };

    if (!isOpen) return null;

    const getSelectedBalance = () => {
        if (formData.sourceAccountId === 'wallet') return walletBalance;
        const bank = banks.find(b => b.id.toString() === formData.sourceAccountId);
        return bank?.balance || 0;
    };

    const currentBalance = getSelectedBalance();
    const initialDeposit = parseFloat(formData.saved || '0');
    const isInsufficient = initialDeposit > currentBalance;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 ring-1 ring-black/5">
                
                {/* Header Section */}
                <div className={`p-8 pb-10 text-white text-center relative overflow-hidden
                    ${activeTab === 'need' ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-pink-500 to-rose-600'}`}
                >
                    {/* Decorative Background Circles */}
                    <div className="absolute top-[-50%] left-[-20%] w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>

                    <button 
                        onClick={onClose} 
                        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm group z-50"
                    >
                        <X className="w-5 h-5 text-white/90 group-hover:text-white" />
                    </button>

                    <h3 className="text-2xl font-bold tracking-tight relative z-10">
                        {itemToEdit ? 'Edit Goal' : `New ${activeTab === 'need' ? 'Necessity' : 'Wish'}`}
                    </h3>
                    <p className="text-white/80 text-sm mt-2 font-medium relative z-10">
                        {itemToEdit ? 'Update your financial target' : 'What are you saving for today?'}
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6 -mt-6 bg-white rounded-t-[2rem] relative z-20">
                    
                    {/* Item Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Goal Name</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <Tag className="w-5 h-5" />
                            </div>
                            <input 
                                type="text" 
                                placeholder={activeTab === 'need' ? "e.g. Rent, Groceries" : "e.g. New Phone, Vacation"}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    {/* Price & Savings Grid */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Target Amount</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <span className="font-bold text-lg">₱</span>
                                </div>
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    className="w-full pl-10 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400" 
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Initial Deposit</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                                    <span className="font-bold text-lg">₱</span>
                                </div>
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    className={`w-full pl-10 pr-4 py-4 bg-gray-50/50 border rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-4 transition-all placeholder:text-gray-400 ${
                                        isInsufficient 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10 text-red-600' 
                                        : 'border-gray-200 focus:border-green-500 focus:ring-green-500/10'
                                    }`} 
                                    value={formData.saved}
                                    onChange={e => setFormData({...formData, saved: e.target.value})}
                                />
                            </div>
                            {isInsufficient && (
                                <p className="text-xs text-red-500 font-bold ml-1 mt-1">Insufficient funds</p>
                            )}
                        </div>
                    </div>

                     {/* Source Account Selector */}
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Funding Source</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                {formData.sourceAccountId === 'wallet' ? <Wallet className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                            </div>
                            <select
                                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                                value={formData.sourceAccountId}
                                onChange={e => setFormData({ ...formData, sourceAccountId: e.target.value })}
                            >
                                {!isWalletHidden && (
                                    <option value="wallet">WishPay Wallet (₱{(walletBalance || 0).toLocaleString()})</option>
                                )}
                                {banks.map(bank => (
                                    <option key={bank.id} value={bank.id}>
                                        {bank.name} (₱{(bank.balance || 0).toLocaleString()})
                                    </option>
                                ))}
                            </select>
                            {/* Custom Arrow */}
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Priority Selector (Only for Needs) */}
                    {activeTab === 'need' && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Priority Level</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, priority: 'high' })}
                                    className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 ${
                                        formData.priority === 'high' 
                                            ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' 
                                            : 'bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:bg-red-50/50'
                                    }`}
                                >
                                    <Flame className={`w-6 h-6 ${formData.priority === 'high' ? 'fill-current' : ''}`} />
                                    <span className="text-xs font-bold">High</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, priority: 'medium' })}
                                    className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 ${
                                        formData.priority === 'medium' 
                                            ? 'bg-purple-50 border-purple-500 text-purple-600 shadow-sm' 
                                            : 'bg-white border-gray-100 text-gray-400 hover:border-purple-200 hover:bg-purple-50/50'
                                    }`}
                                >
                                    <Zap className={`w-6 h-6 ${formData.priority === 'medium' ? 'fill-current' : ''}`} />
                                    <span className="text-xs font-bold">Medium</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, priority: 'low' })}
                                    className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 ${
                                        formData.priority === 'low' 
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm' 
                                            : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200 hover:bg-emerald-50/50'
                                    }`}
                                >
                                    <Leaf className={`w-6 h-6 ${formData.priority === 'low' ? 'fill-current' : ''}`} />
                                    <span className="text-xs font-bold">Low</span>
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isInsufficient}
                        className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                        ${activeTab === 'need' 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                            : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'}`}
                    >
                        {itemToEdit ? 'Save Changes' : 'Create Goal'} <Check className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};