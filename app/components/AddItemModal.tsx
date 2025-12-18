'use client';

import { useState, useEffect } from 'react';
import { Item, ItemType, Priority } from '../types';
import { X, Check, Tag, DollarSign, Bookmark } from 'lucide-react';

interface ItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: any) => void;
    activeTab: ItemType;
    itemToEdit?: Item | null;
}

export const ItemModal = ({ isOpen, onClose, onSave, activeTab, itemToEdit }: ItemModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        saved: '0',
        priority: 'medium' as Priority
    });

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setFormData({
                    name: itemToEdit.name,
                    price: itemToEdit.price.toString(),
                    saved: itemToEdit.saved.toString(),
                    priority: itemToEdit.priority
                });
            } else {
                setFormData({
                    name: '',
                    price: '',
                    saved: '0',
                    priority: 'medium'
                });
            }
        }
    }, [isOpen, itemToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            type: activeTab,
            id: itemToEdit?.id
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-bold">
                        {itemToEdit ? 'Edit Goal' : `Add New ${activeTab === 'need' ? 'Necessity' : 'Wish'}`}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                        {itemToEdit ? 'Update your goal details' : 'What are you saving for?'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">Item Name</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Tag className="w-5 h-5" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="e.g. Rent, New Phone" 
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-400" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Total Price</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <span className="font-bold text-lg">₱</span>
                                </div>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-400" 
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Initial Savings</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <span className="font-bold text-lg">₱</span>
                                </div>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-400" 
                                    value={formData.saved}
                                    onChange={e => setFormData({...formData, saved: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {activeTab === 'need' && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Priority Level</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Bookmark className="w-5 h-5" />
                                </div>
                                <select 
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-all appearance-none"
                                    value={formData.priority}
                                    onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
                                >
                                    <option value="high">🔥 High Priority</option>
                                    <option value="medium">⚡ Medium Priority</option>
                                    <option value="low">🌱 Low Priority</option>
                                </select>
                            </div>
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        {itemToEdit ? 'Save Changes' : 'Create Goal'} <Check className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};