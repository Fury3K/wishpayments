'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, UserCircle, Plus, ArrowRightLeft } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Item } from '../types';
import { BottomNav } from '../components/BottomNav';
import { CashInModal } from '../components/modals/CashInModal';
import { CashOutModal } from '../components/modals/CashOutModal';
import { AddBankModal } from '../components/modals/AddBankModal';
import { EditBankModal } from '../components/modals/EditBankModal';
import { TransferModal } from '../components/modals/TransferModal';
import { BankCard } from '../components/BankCard';

interface BankAccount {
    id: number;
    name: string;
    balance: number;
    color: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [items, setItems] = useState<Item[]>([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<{ name: string; email: string; profilePicture?: string } | null>(null);
    
    // Carousel State
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    
    // Modals
    const [isCashInModalOpen, setIsCashInModalOpen] = useState(false);
    const [isCashOutModalOpen, setIsCashOutModalOpen] = useState(false);
    const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
    const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    
    // State to track active operations
    const [activeAccountId, setActiveAccountId] = useState<string | number>('wallet');
    const [bankToEdit, setBankToEdit] = useState<BankAccount | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [itemsRes, balanceRes, banksRes, profileRes] = await Promise.all([
                api.get('/api/items'),
                api.get('/api/user/balance'),
                api.get('/api/banks'),
                api.get('/api/user/profile')
            ]);
            
            setItems(itemsRes.data);
            setWalletBalance(balanceRes.data.balance || 0);
            setBankAccounts(banksRes.data);
            setUserProfile(profileRes.data);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                router.push('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to fetch data.');
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            // Calculate active index based on scroll position and container width
            // Adding a small buffer (clientWidth / 2) to switch active state when card is halfway through
            const index = Math.round(scrollLeft / clientWidth);
            setActiveCardIndex(index);
        }
    };

    const essentialsProgress = useMemo(() => {
        const needs = items.filter(i => i.type === 'need');
        const totalCost = needs.reduce((acc, curr) => acc + (curr.price || 0), 0);
        const totalSaved = needs.reduce((acc, curr) => acc + (curr.saved || 0), 0);
        const percentage = totalCost > 0 ? (totalSaved / totalCost) * 100 : 0;
        return { totalCost, totalSaved, percentage };
    }, [items]);

    const handleAddBank = async (bankData: any) => {
        try {
            const response = await api.post('/api/banks', bankData);
            setBankAccounts([...bankAccounts, response.data]);
            toast.success('Bank account added!');
            setIsAddBankModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add bank.');
        }
    };

    const handleUpdateBank = async (id: number, bankData: any) => {
        try {
            const response = await api.put(`/api/banks/${id}`, bankData);
            setBankAccounts(prev => prev.map(b => b.id === id ? response.data : b));
            toast.success('Bank account updated!');
            setIsEditBankModalOpen(false);
            setBankToEdit(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update bank.');
        }
    };

    const handleDeleteBank = async (id: number) => {
        try {
            await api.delete(`/api/banks/${id}`);
            setBankAccounts(prev => prev.filter(b => b.id !== id));
            toast.success('Bank account removed!');
            setIsEditBankModalOpen(false);
            setBankToEdit(null);
            // Reset to first card if deleted
            if (activeCardIndex >= bankAccounts.length) { // bankAccounts.length because we just removed one, so length-1 is max index
                 setActiveCardIndex(Math.max(0, activeCardIndex - 1));
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete bank.');
        }
    };

    const handleCashIn = async (amount: number) => {
        if (activeAccountId === 'wallet') {
            try {
                const newBalance = walletBalance + amount;
                await api.put('/api/user/balance', { 
                    balance: newBalance,
                    transaction: {
                        amount,
                        type: 'deposit',
                        description: 'Cashed in to WishPay Wallet'
                    }
                });
                setWalletBalance(newBalance);
                toast.success(`Cashed in ₱${amount.toLocaleString()} to Wallet!`);
                setIsCashInModalOpen(false);
            } catch (error: any) {
                toast.error('Failed to update wallet.');
            }
        } else {
             const bank = bankAccounts.find(b => b.id === activeAccountId);
             if (bank) {
                 try {
                     const newBalance = bank.balance + amount;
                     await api.put(`/api/banks/${bank.id}`, { 
                         ...bank, 
                         balance: newBalance,
                         transaction: {
                             amount,
                             type: 'deposit',
                             description: `Cashed in to ${bank.name}`
                         }
                     });
                     setBankAccounts(prev => prev.map(b => b.id === activeAccountId ? { ...b, balance: newBalance } : b));
                     toast.success(`Cashed in ₱${amount.toLocaleString()}!`);
                     setIsCashInModalOpen(false);
                 } catch (error: any) {
                     toast.error('Failed to update bank balance.');
                 }
             }
        }
    };

    const handleCashOut = async (amount: number) => {
        if (activeAccountId === 'wallet') {
            try {
                const newBalance = walletBalance - amount;
                if (newBalance < 0) {
                    toast.error('Insufficient balance');
                    return;
                }
                await api.put('/api/user/balance', { 
                    balance: newBalance,
                    transaction: {
                        amount,
                        type: 'withdrawal',
                        description: 'Removed funds from WishPay Wallet'
                    }
                });
                setWalletBalance(newBalance);
                toast.success(`Removed ₱${amount.toLocaleString()} from Wallet!`);
                setIsCashOutModalOpen(false);
            } catch (error: any) {
                 toast.error('Failed to update wallet.');
            }
        } else {
            const bank = bankAccounts.find(b => b.id === activeAccountId);
            if (bank) {
                if (bank.balance < amount) {
                    toast.error('Insufficient balance');
                    return;
                }
                try {
                     const newBalance = bank.balance - amount;
                     await api.put(`/api/banks/${bank.id}`, { 
                         ...bank, 
                         balance: newBalance,
                         transaction: {
                             amount,
                             type: 'withdrawal',
                             description: `Removed funds from ${bank.name}`
                         }
                     });
                     setBankAccounts(prev => prev.map(b => b.id === activeAccountId ? { ...b, balance: newBalance } : b));
                     toast.success(`Removed ₱${amount.toLocaleString()}!`);
                     setIsCashOutModalOpen(false);
                 } catch (error: any) {
                     toast.error('Failed to update bank balance.');
                 }
            }
        }
    };

    const handleTransfer = async (sourceId: string, destId: string, amount: number) => {
        try {
            await api.post('/api/transfer', { sourceId, destinationId: destId, amount });
            toast.success(`Transferred ₱${amount.toLocaleString()}!`);
            fetchData(); // Refresh data to update balances
            setIsTransferModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Transfer failed.');
        }
    };

    const openCashIn = (id: string | number) => {
        setActiveAccountId(id);
        setIsCashInModalOpen(true);
    };

    const openCashOut = (id: string | number) => {
        setActiveAccountId(id);
        setIsCashOutModalOpen(true);
    };
    
    const openEditBank = (bank: BankAccount) => {
        setBankToEdit(bank);
        setIsEditBankModalOpen(true);
    };

    const currentActiveBalance = activeAccountId === 'wallet' 
        ? walletBalance 
        : bankAccounts.find(b => b.id === activeAccountId)?.balance || 0;

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center bg-[#F3F4F6]"><span className="loading loading-spinner loading-lg text-blue-600"></span></div>;
    }

    return (
        <div className="bg-[#F3F4F6] font-sans text-[#1A1B2D] antialiased min-h-screen pb-24 relative">
            <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-[#F3F4F6] z-10">
                <h1 className="text-xl font-bold text-[#1A1B2D]">WishPay Wallet</h1>
                <button className="w-10 h-10 rounded-full border-gray-200 flex items-center justify-center overflow-hidden">
                    {userProfile?.profilePicture ? (
                        <img src={userProfile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle className="w-8 h-8 text-gray-400" />
                    )}
                </button>
            </header>

            <main className="space-y-6 overflow-hidden">
                {/* Swipeable Bank Cards Section */}
                <section className="relative w-full">
                    <div 
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory px-6 pb-6 gap-4 no-scrollbar items-start"
                    >
                        {/* Main Wallet Card */}
                        <div className="min-w-full snap-center shrink-0">
                            <BankCard 
                                name="WishPay Wallet"
                                balance={walletBalance}
                                color="blue"
                                onCashIn={() => openCashIn('wallet')}
                                onCashOut={() => openCashOut('wallet')}
                            />
                        </div>

                        {/* Additional Bank Cards */}
                        {bankAccounts.map((bank) => (
                            <div key={bank.id} className="min-w-full snap-center shrink-0">
                                <BankCard 
                                    name={bank.name}
                                    balance={bank.balance}
                                    color={bank.color}
                                    onCashIn={() => openCashIn(bank.id)}
                                    onCashOut={() => openCashOut(bank.id)}
                                    onEdit={() => openEditBank(bank)}
                                />
                            </div>
                        ))}
                    </div>
                    
                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-1.5 -mt-2 mb-4">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeCardIndex === 0 ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}></div>
                        {bankAccounts.map((b, idx) => (
                            <div 
                                key={b.id} 
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeCardIndex === idx + 1 ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}
                            ></div>
                        ))}
                    </div>
                </section>

                <div className="px-6 space-y-6">
                    {/* Essentials Funding Card */}
                    <section className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-[#1A1B2D]">Essentials Funding</h3>
                            <button className="text-gray-400 hover:text-gray-600">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full overflow-hidden mb-3 h-3">
                            <div 
                                className="h-full bg-gradient-to-r from-[#22d3ee] to-[#0d9488] rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(essentialsProgress.percentage, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-[#8A94A6] font-medium tracking-wide">
                            <span className="text-gray-600">{Math.round(essentialsProgress.percentage)}% Funded</span> - ₱{essentialsProgress.totalSaved.toLocaleString()} of ₱{essentialsProgress.totalCost.toLocaleString()} goal
                        </p>
                    </section>

                    {/* Bank Accounts List */}
                    <section className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center justify-between mb-5 mt-2">
                             <h3 className="font-bold text-lg text-[#1A1B2D]">Bank Accounts</h3>
                             <div className="flex items-center">
                                 <button 
                                    onClick={() => setIsTransferModalOpen(true)}
                                    className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors mr-2"
                                 >
                                    <ArrowRightLeft className="w-4 h-4" /> Transfer
                                </button>
                                 <button 
                                    onClick={() => setIsAddBankModalOpen(true)}
                                    className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                 >
                                    <Plus className="w-4 h-4" /> Add Bank
                                </button>
                             </div>
                        </div>
                        <ul className="space-y-6">
                             {/* WishPay Wallet */}
                            <li className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                    <span className="text-base font-medium text-gray-700">WishPay Wallet</span>
                                </div>
                                <span className="text-base font-extrabold text-[#1A1B2D]">₱{walletBalance.toLocaleString()}</span>
                            </li>
                            {/* Dynamically Added Banks */}
                            {bankAccounts.map((bank) => {
                                const getIndicatorClass = (color: string) => {
                                    switch (color) {
                                        case 'purple': return 'bg-purple-600 shadow-purple-500/50';
                                        case 'green': return 'bg-emerald-500 shadow-emerald-500/50';
                                        case 'orange': return 'bg-orange-500 shadow-orange-500/50';
                                        case 'red': return 'bg-red-600 shadow-red-500/50';
                                        case 'pink': return 'bg-pink-500 shadow-pink-500/50';
                                        case 'cyan': return 'bg-cyan-500 shadow-cyan-500/50';
                                        case 'yellow': return 'bg-yellow-400 shadow-yellow-500/50';
                                        case 'black': return 'bg-gray-800 shadow-gray-500/50';
                                        case 'blue': default: return 'bg-blue-600 shadow-blue-500/50';
                                    }
                                };

                                return (
                                    <li key={bank.id} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors" onClick={() => openEditBank(bank)}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)] ${getIndicatorClass(bank.color)}`}></div>
                                            <span className="text-base font-medium text-gray-700">{bank.name}</span>
                                        </div>
                                        <span className="text-base font-extrabold text-[#1A1B2D]">₱{bank.balance.toLocaleString()}</span>
                                    </li>
                                );
                            })}
                            {bankAccounts.length === 0 && (
                                <li className="text-center text-gray-400 py-2 text-sm">No additional banks added yet.</li>
                            )}
                        </ul>
                    </section>
                </div>
            </main>

            <BottomNav />

            {/* Modals */}
            <CashInModal 
                isOpen={isCashInModalOpen} 
                onClose={() => setIsCashInModalOpen(false)} 
                onConfirm={handleCashIn} 
            />
            <CashOutModal 
                isOpen={isCashOutModalOpen} 
                onClose={() => setIsCashOutModalOpen(false)} 
                onConfirm={handleCashOut}
                currentBalance={currentActiveBalance}
            />
            <AddBankModal
                isOpen={isAddBankModalOpen}
                onClose={() => setIsAddBankModalOpen(false)}
                onSave={handleAddBank}
            />
            <EditBankModal
                isOpen={isEditBankModalOpen}
                onClose={() => setIsEditBankModalOpen(false)}
                onSave={handleUpdateBank}
                onDelete={handleDeleteBank}
                bankToEdit={bankToEdit}
            />
            <TransferModal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                onConfirm={handleTransfer}
                walletBalance={walletBalance}
                banks={bankAccounts}
            />
        </div>
    );
}