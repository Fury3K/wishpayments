'use client';

import { useState } from 'react';
import { X, Check, Building2, Palette } from 'lucide-react';

interface AddBankModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (bank: any) => void;
}

export function AddBankModal({ isOpen, onClose, onSave }: AddBankModalProps) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('blue');
    const [balance, setBalance] = useState('');

    const colors = [
        { id: 'blue', value: 'from-[#1c3d9c] to-[#3b6ce3]', label: 'Ocean' },
        { id: 'purple', value: 'from-purple-600 to-indigo-600', label: 'Royal' },
        { id: 'green', value: 'from-emerald-600 to-teal-500', label: 'Forest' },
        { id: 'orange', value: 'from-orange-500 to-red-500', label: 'Sunset' },
        { id: 'black', value: 'from-gray-800 to-gray-900', label: 'Midnight' },
    ];

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, color, balance });
        setName('');
        setBalance('');
        setColor('blue');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                <div className="p-6 bg-gradient-to-br from-indigo-600 to-blue-600 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Add Bank Account</h3>
                    <p className="text-indigo-100 text-sm mt-1">Link a new account to track</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">Bank Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Chase Checking"
                            className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-0 transition-all placeholder:text-gray-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                         <label className="text-sm font-medium text-gray-700 ml-1">Initial Balance</label>
                         <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-0 transition-all placeholder:text-gray-400"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-2">
                            <Palette className="w-4 h-4" /> Card Color
                        </label>
                        <div className="flex gap-2 justify-between">
                            {colors.map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setColor(c.id)}
                                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.value} transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 ${color === c.id ? 'ring-indigo-500 scale-110' : 'ring-transparent'}`}
                                    aria-label={c.label}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        Add Account <Check className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}