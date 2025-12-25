'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, ChevronLeft, UserCircle, Search, Flame, Zap, Leaf } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Item, ItemType, BankAccount } from '../types';
import { BottomNav } from '../components/BottomNav';
import { ItemModal } from '../components/AddItemModal';

export default function GoalsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ItemType>('need');
    const [items, setItems] = useState<Item[]>([]);
    const [banks, setBanks] = useState<BankAccount[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [balance, setBalance] = useState(0);
    const [isWalletHidden, setIsWalletHidden] = useState(false);
    const [userProfile, setUserProfile] = useState<{ profilePicture?: string } | null>(null);

    const fetchItems = useCallback(async () => {
        setLoadingItems(true);
        try {
            const [itemsResponse, userBalanceResponse, profileResponse, banksResponse] = await Promise.all([
                api.get('/api/items'),
                api.get('/api/user/balance'),
                api.get('/api/user/profile'),
                api.get('/api/banks')
            ]);
            setItems(itemsResponse.data);
            setBalance(userBalanceResponse.data.balance || 0);
            setIsWalletHidden(userBalanceResponse.data.isWalletHidden || false);
            setUserProfile(profileResponse.data);
            setBanks(banksResponse.data);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                router.push('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to fetch data.');
            }
        } finally {
            setLoadingItems(false);
        }
    }, [router]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleSaveItem = async (itemData: any) => {
        const price = parseFloat(itemData.price);
        let savedAmount = parseFloat(itemData.saved || '0');
        const bankId = itemData.bankId; // null (Wallet) or number (Bank ID)

        // Determine current balance of the selected source
        let currentSourceBalance = 0;
        if (!bankId) {
             currentSourceBalance = balance;
        } else {
             const bank = banks.find(b => b.id === bankId);
             currentSourceBalance = bank?.balance || 0;
        }

        if (savedAmount > currentSourceBalance) {
             toast.error("Not enough money in selected account for initial deposit!");
             return;
        }

        try {
            const newItemData = {
                name: itemData.name,
                price: price,
                saved: savedAmount,
                type: itemData.type,
                priority: itemData.priority,
                bankId: bankId 
            };
            const itemResponse = await api.post('/api/items', newItemData);
            const createdItem: Item = itemResponse.data;

            setItems(prev => [createdItem, ...prev]);

            if (savedAmount > 0) {
                if (!bankId) {
                    // Deduct from Wallet
                    const updatedBalanceResponse = await api.put('/api/user/balance', { balance: balance - savedAmount });
                    setBalance(updatedBalanceResponse.data.balance);
                } else {
                    // Deduct from Bank
                    const bank = banks.find(b => b.id === bankId);
                    if (bank) {
                        const newBankBalance = bank.balance - savedAmount;
                        await api.put(`/api/banks/${bank.id}`, { ...bank, balance: newBankBalance });
                        
                        // Update local banks state to reflect the deduction immediately
                        setBanks(prev => prev.map(b => b.id === bank.id ? { ...b, balance: newBankBalance } : b));
                    }
                }
            }
            toast.success('Item added successfully!');
            setIsItemModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add item.');
        }
    };

    const getBankColorClass = (bankId: number | null | undefined) => {
        if (!bankId) return 'bg-blue-500'; // Wallet default
        const bank = banks.find(b => b.id === bankId);
        if (!bank) return 'bg-gray-400';
        switch (bank.color) {
            case 'purple': return 'bg-purple-500';
            case 'green': return 'bg-emerald-500';
            case 'orange': return 'bg-orange-500';
            case 'red': return 'bg-red-500';
            case 'pink': return 'bg-pink-500';
            case 'cyan': return 'bg-cyan-500';
            case 'yellow': return 'bg-yellow-400';
            case 'black': return 'bg-gray-800';
            case 'blue': default: return 'bg-blue-500';
        }
    };

    if (loadingItems) {
        return <div className="min-h-screen flex justify-center items-center bg-[#F3F4F6]"><span className="loading loading-spinner loading-lg text-blue-600"></span></div>;
    }

    return (
        <div className="bg-[#F3F4F6] font-sans text-[#1A1B2D] antialiased min-h-screen pb-24 relative">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-[#F3F4F6] z-10">
                <Link href="/dashboard" className="p-2 -ml-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold text-[#1A1B2D]">Your Goals</h1>
                <button className="w-10 h-10 rounded-full border-gray-200 flex items-center justify-center overflow-hidden">
                    {userProfile?.profilePicture ? (
                        <img src={userProfile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle className="w-8 h-8 text-gray-400" />
                    )}
                </button>
            </header>

            <main className="px-6 space-y-6">
                {/* Search / Filter Placeholder */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search goals..." 
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                    />
                </div>

                {/* Items List Container */}
                <section className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] min-h-[400px]">
                    {/* Toggle Tabs */}
                    <div className="bg-gray-100 p-1.5 rounded-full flex items-center mb-6">
                        <button 
                            onClick={() => setActiveTab('need')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === 'need' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            Needs
                        </button>
                        <button 
                            onClick={() => setActiveTab('want')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === 'want' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            Wants
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-5 mt-2">
                        <h3 className="font-bold text-lg text-[#1A1B2D]">
                            {activeTab === 'need' ? 'Necessary Items' : 'Wishlist Items'}
                        </h3>
                        <button 
                            onClick={() => setIsItemModalOpen(true)}
                            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>

                    <ul className="space-y-4">
                        {items.filter(i => i.type === activeTab).map((item) => (
                            <li key={item.id} className="block w-full">
                                <Link 
                                    href={`/items/${item.id}`} 
                                    className="flex items-center justify-between p-4 -mx-3 rounded-2xl hover:bg-gray-50 transition-all duration-200 group cursor-pointer w-full border border-transparent hover:border-gray-100 hover:shadow-sm relative overflow-hidden"
                                >
                                    {/* Bank Color Indicator Strip */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getBankColorClass(item.bankId)}`}></div>
                                    
                                    <div className="flex items-center gap-4 ml-2 flex-1 min-w-0">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 transition-transform group-hover:scale-105
                                            ${item.priority === 'high' ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30' : 
                                              item.priority === 'medium' ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30' : 
                                              'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-400/30'}`}
                                        >
                                            {item.priority === 'high' && <Flame className="w-6 h-6 fill-white/20" />}
                                            {item.priority === 'medium' && <Zap className="w-6 h-6 fill-white/20" />}
                                            {item.priority === 'low' && <Leaf className="w-6 h-6 fill-white/20" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="block text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 break-words">{item.name}</span>
                                            <div className="w-full max-w-[140px] h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        (item.saved / item.price) >= 1 ? 'bg-green-500' : 'bg-blue-500'
                                                    }`} 
                                                    style={{ width: `${Math.min((item.saved / item.price) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 flex flex-col items-end">
                                        <div className="flex items-center gap-1.5">
                                            <span className="block text-lg font-extrabold text-[#1A1B2D]">₱{item.saved.toLocaleString()}</span>
                                        </div>
                                        <span className="text-xs font-medium text-gray-400">of ₱{item.price.toLocaleString()}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                        {items.filter(i => i.type === activeTab).length === 0 && (
                            <li className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                    <Search className="w-6 h-6 opacity-30" />
                                </div>
                                <p className="text-sm font-medium">No {activeTab}s found.</p>
                                <p className="text-xs opacity-70 mt-1">Tap 'Add New' to create one.</p>
                            </li>
                        )}
                    </ul>
                </section>
            </main>

            <BottomNav />

            {/* Modals */}
            <ItemModal
                isOpen={isItemModalOpen}
                onClose={() => setIsItemModalOpen(false)}
                onSave={handleSaveItem}
                activeTab={activeTab}
                itemToEdit={null}
                banks={banks}
                walletBalance={balance}
                isWalletHidden={isWalletHidden}
            />
        </div>
    );
}