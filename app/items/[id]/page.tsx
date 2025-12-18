'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle, Shield, Lock, Activity, Edit3 } from 'lucide-react';
import api from '@/lib/api';
import { Item } from '@/app/types';
import { toast } from 'react-hot-toast';
import { BottomNav } from '@/app/components/BottomNav';
import { ItemModal } from '@/app/components/AddItemModal';
import { AddFundsModal } from '@/app/components/modals/AddFundsModal';
import Link from 'next/link';

export default function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [item, setItem] = useState<Item | null>(null);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const itemResponse = await api.get(`/api/items/${id}`);
            setItem(itemResponse.data);
            const balanceResponse = await api.get('/api/user/balance');
            setBalance(balanceResponse.data.balance || 0);
        } catch (error: any) {
            toast.error('Failed to fetch item details.');
            router.push('/goals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSaveItem = async (itemData: any) => {
        if (!item) return;
        
        try {
            const updatedItemData = {
                ...item,
                name: itemData.name,
                price: parseFloat(itemData.price),
                priority: itemData.priority,
                saved: parseFloat(itemData.saved || item.saved)
            };
            
            const savedDiff = updatedItemData.saved - item.saved;

            const response = await api.put(`/api/items/${item.id}`, updatedItemData);
            setItem(response.data);

            if (savedDiff !== 0) {
                 const newBalance = balance - savedDiff;
                 const balanceResponse = await api.put('/api/user/balance', { balance: newBalance });
                 setBalance(balanceResponse.data.balance);
            }

            toast.success('Item details updated!');
            setIsEditModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update item.');
        }
    };

    const handleAddFunds = async (amount: number) => {
        if (!item) return;

        const newSaved = item.saved + amount;
        
        try {
            const updatedItemData = { ...item, saved: newSaved };
            const response = await api.put(`/api/items/${item.id}`, updatedItemData);
            setItem(response.data);

            const newBalance = balance - amount;
            const balanceResponse = await api.put('/api/user/balance', { balance: newBalance });
            setBalance(balanceResponse.data.balance);

            toast.success(`Added ₱${amount.toLocaleString()} to ${item.name}!`);
            setIsAddFundsModalOpen(false);
        } catch (error: any) {
             toast.error(error.response?.data?.message || 'Failed to add funds.');
        }
    };

    if (loading) {
         return <div className="min-h-screen flex justify-center items-center bg-gray-50"><span className="loading loading-spinner loading-lg text-blue-600"></span></div>;
    }

    if (!item) return null;

    const percentage = Math.min(100, Math.round((item.saved / item.price) * 100));
    
    // Conic Gradient Calculation
    const degree = (percentage / 100) * 360;
    const gradientStyle = {
        background: `conic-gradient(#0284c7 0deg ${degree}deg, #f1f5f9 ${degree}deg 360deg)`
    };

    return (
        <div className="bg-gray-50 text-slate-800 font-sans antialiased min-h-screen pb-24 relative flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-4 bg-white sticky top-0 z-20 shadow-sm">
                <Link href="/goals" className="w-10 h-10 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-full transition">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-bold text-slate-900">Item Details</h1>
                <div className="w-10"></div>
            </header>

            <main className="px-6 pt-8 pb-8 space-y-8 flex-1">
                {/* Chart Section */}
                <section className="flex flex-col items-center justify-center">
                    <div className="chart-container shadow-sm rounded-full w-[260px] h-[260px] relative flex items-center justify-center" style={gradientStyle}>
                        <div className="bg-white w-[85%] h-[85%] rounded-full flex flex-col items-center justify-center z-10 shadow-inner">
                            <span className="text-5xl font-bold text-blue-700 tracking-tight">{percentage}%</span>
                            <span className="font-bold text-black mt-2 text-lg text-center px-4 line-clamp-1">{item.name}</span>
                            <span className="text-gray-400 text-sm font-medium mt-1">₱{item.saved.toLocaleString()} of ₱{item.price.toLocaleString()}</span>
                        </div>
                    </div>
                </section>

                {/* Priority Level Section */}
                <section>
                    <h2 className="font-bold text-slate-900 mb-3 text-lg">Priority Level</h2>
                    <div className="flex flex-row gap-2 w-full">
                        <div className={`flex-1 rounded-xl py-3 px-1 text-center flex flex-col justify-center items-center transition-all ${item.priority === 'high' ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' : 'bg-gray-100 text-gray-400 opacity-50'}`}>
                            <span className="font-bold text-base leading-tight">High</span>
                            <span className={`text-xs font-medium ${item.priority === 'high' ? 'text-red-100' : ''}`}>(Critical)</span>
                        </div>
                        <div className={`flex-1 rounded-xl py-3 px-1 text-center flex flex-col justify-center items-center transition-all ${item.priority === 'medium' ? 'bg-orange-400 text-white shadow-lg shadow-orange-400/40' : 'bg-gray-100 text-gray-400 opacity-50'}`}>
                            <span className="font-bold text-base leading-tight">Medium</span>
                            <span className={`text-xs font-medium ${item.priority === 'medium' ? 'text-orange-100' : ''}`}>(Essential)</span>
                        </div>
                        <div className={`flex-1 rounded-xl py-3 px-1 text-center flex flex-col justify-center items-center transition-all ${item.priority === 'low' ? 'bg-green-500 text-white shadow-lg shadow-green-500/40' : 'bg-gray-100 text-gray-400 opacity-50'}`}>
                            <span className="font-bold text-base leading-tight">Low</span>
                            <span className={`text-xs font-medium ${item.priority === 'low' ? 'text-green-100' : ''}`}>(Flexible)</span>
                        </div>
                    </div>
                </section>

                {/* Safeguards Section */}
                <section>
                    <h2 className="font-bold text-slate-900 mt-2 mb-3 text-lg">Safeguards</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-blue-600 text-xl w-6 h-6" />
                            <div className="w-8 flex justify-center">
                                <Shield className="text-green-500 text-lg w-5 h-5" />
                            </div>
                            <span className="text-slate-700 font-medium text-base">Emergency Fund Check</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-blue-600 text-xl w-6 h-6" />
                            <div className="w-8 flex justify-center">
                                <Lock className="text-blue-500 text-lg w-5 h-5" />
                            </div>
                            <span className="text-slate-700 font-medium text-base">Bill Buffer Protected</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-blue-600 text-xl w-6 h-6" />
                                <div className="w-8 flex justify-center">
                                    <Activity className="text-blue-500 text-lg w-5 h-5" />
                                </div>
                                <span className="text-slate-700 font-medium text-base">Auto-Save Enabled</span>
                            </div>
                            <div className="w-12 h-7 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                                <div className="absolute right-1 top-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Action Buttons */}
                <section className="space-y-4 pt-4">
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="w-full border-2 border-blue-500 text-blue-600 bg-white rounded-xl py-3.5 font-bold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit3 className="w-5 h-5" /> Edit Details
                    </button>
                    <button 
                        onClick={() => setIsAddFundsModalOpen(true)}
                        className="w-full bg-blue-700 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.saved >= item.price}
                    >
                        {item.saved >= item.price ? 'Fully Funded' : 'Add Funds'}
                    </button>
                </section>
            </main>

            <BottomNav />

            {/* Modals */}
            <ItemModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveItem}
                activeTab={item.type}
                itemToEdit={item}
            />

            <AddFundsModal
                isOpen={isAddFundsModalOpen}
                onClose={() => setIsAddFundsModalOpen(false)}
                onConfirm={handleAddFunds}
                itemName={item.name}
                currentSaved={item.saved}
                price={item.price}
                walletBalance={balance}
            />
        </div>
    );
}