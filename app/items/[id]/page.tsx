'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Edit3, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { Item, BankAccount } from '@/app/types';
import { toast } from 'react-hot-toast';
import { BottomNav } from '@/app/components/BottomNav';
import { ItemModal } from '@/app/components/AddItemModal';
import { AddFundsModal } from '@/app/components/modals/AddFundsModal';
import { DeductFundsModal } from '@/app/components/modals/DeductFundsModal';
import { CompleteConfirmationModal } from '@/app/components/modals/CompleteConfirmationModal';
import Link from 'next/link';

export default function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [item, setItem] = useState<Item | null>(null);
    const [balance, setBalance] = useState(0);
    const [isWalletHidden, setIsWalletHidden] = useState(false);
    const [banks, setBanks] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
    const [isDeductFundsModalOpen, setIsDeductFundsModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [itemResponse, balanceResponse, banksResponse] = await Promise.all([
                api.get(`/api/items/${id}`),
                api.get('/api/user/balance'),
                api.get('/api/banks')
            ]);
            setItem(itemResponse.data);
            setBalance(balanceResponse.data.balance || 0);
            setIsWalletHidden(balanceResponse.data.isWalletHidden || false);
            setBanks(banksResponse.data || []);
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
                saved: parseFloat(itemData.saved || item.saved),
                bankId: itemData.bankId
            };
            
            const savedDiff = updatedItemData.saved - item.saved;
            const bankId = itemData.bankId;

            // Check balance of source account
            let currentSourceBalance = 0;
            if (!bankId) {
                currentSourceBalance = balance;
            } else {
                const bank = banks.find(b => b.id === bankId);
                currentSourceBalance = bank?.balance || 0;
            }

            if (savedDiff > currentSourceBalance) {
                toast.error("Insufficient funds in selected account!");
                return;
            }

            // Prepare transaction object if funds changed
            let transactionPayload = {};
            if (savedDiff !== 0) {
                transactionPayload = {
                    transaction: {
                        amount: Math.abs(savedDiff),
                        type: savedDiff > 0 ? 'allocation' : 'reversal',
                        description: savedDiff > 0 ? `Added funds to ${item.name}` : `Removed funds from ${item.name}`,
                        bankId: bankId,
                        itemId: item.id
                    }
                };
            }

            const response = await api.put(`/api/items/${item.id}`, { ...updatedItemData, ...transactionPayload });
            setItem(response.data);

            if (savedDiff !== 0) {
                if (!bankId) {
                    const newBalance = balance - savedDiff;
                    const balanceResponse = await api.put('/api/user/balance', { balance: newBalance });
                    setBalance(balanceResponse.data.balance);
                } else {
                    const bank = banks.find(b => b.id === bankId);
                    if (bank) {
                        const newBankBalance = bank.balance - savedDiff;
                        await api.put(`/api/banks/${bank.id}`, { ...bank, balance: newBankBalance });
                        setBanks(prev => prev.map(b => b.id === bank.id ? { ...b, balance: newBankBalance } : b));
                    }
                }
            }

            toast.success('Item details updated!');
            setIsEditModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update item.');
        }
    };

    const handleAddFunds = async (amount: number, selectedBankId: number | null) => {
        if (!item) return;

        const newSaved = item.saved + amount;
        
        try {
            const updatedItemData = { ...item, saved: newSaved };
            
            // Send transaction details with item update
            const response = await api.put(`/api/items/${item.id}`, { 
                ...updatedItemData,
                transaction: {
                    amount: amount,
                    type: 'allocation',
                    description: `Added funds to ${item.name}`,
                    bankId: selectedBankId,
                    itemId: item.id
                }
            });
            
            const updatedItem = response.data;
            setItem(updatedItem);

            if (!selectedBankId) {
                const newBalance = balance - amount;
                const balanceResponse = await api.put('/api/user/balance', { balance: newBalance });
                setBalance(balanceResponse.data.balance);
            } else {
                const bank = banks.find(b => b.id === selectedBankId);
                if (bank) {
                    const newBankBalance = bank.balance - amount;
                    await api.put(`/api/banks/${bank.id}`, { ...bank, balance: newBankBalance });
                    setBanks(prev => prev.map(b => b.id === bank.id ? { ...b, balance: newBankBalance } : b));
                }
            }

            toast.success(`Added ₱${amount.toLocaleString()} to ${item.name}!`);
            setIsAddFundsModalOpen(false);

            // Check if fully funded and trigger prompt
            if (updatedItem.saved >= updatedItem.price) {
                setIsCompleteModalOpen(true);
            }
        } catch (error: any) {
             toast.error(error.response?.data?.message || 'Failed to add funds.');
        }
    };

    const handleDeductFunds = async (amount: number) => {
        if (!item) return;

        const newSaved = item.saved - amount;
        if (newSaved < 0) return; // Should be prevented by modal but safe check

        try {
            const updatedItemData = { ...item, saved: newSaved };

            const response = await api.put(`/api/items/${item.id}`, {
                ...updatedItemData,
                transaction: {
                    amount: amount,
                    type: 'reversal',
                    description: `Removed funds from ${item.name}`,
                    bankId: item.bankId,
                    itemId: item.id
                }
            });

            const updatedItem = response.data;
            setItem(updatedItem);

            // Add funds back to source
            if (!item.bankId) {
                const newBalance = balance + amount;
                const balanceResponse = await api.put('/api/user/balance', { balance: newBalance });
                setBalance(balanceResponse.data.balance);
            } else {
                const bank = banks.find(b => b.id === item.bankId);
                if (bank) {
                    const newBankBalance = bank.balance + amount;
                    await api.put(`/api/banks/${bank.id}`, { ...bank, balance: newBankBalance });
                    setBanks(prev => prev.map(b => b.id === bank.id ? { ...b, balance: newBankBalance } : b));
                }
            }

            toast.success(`Returned ₱${amount.toLocaleString()} to source!`);
            setIsDeductFundsModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to deduct funds.');
        }
    };

    const handleComplete = async () => {
        if (!item) return;
        try {
            await api.delete(`/api/items/${item.id}`);
            toast.success('Goal completed and archived!');
            router.push('/history');
        } catch (error: any) {
            toast.error('Failed to complete goal.');
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
        <div className="bg-gray-50 text-slate-800 font-sans antialiased min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] relative flex flex-col">
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

                {/* Bank Info */}
                <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-medium">Funding Source</span>
                        <span className="text-sm font-bold text-slate-900">
                            {item.bankId ? banks.find(b => b.id === item.bankId)?.name || 'Unknown Bank' : 'WishPay Wallet'}
                        </span>
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

                {/* Action Buttons */}
                <section className="space-y-4 pt-4">
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="w-full border-2 border-blue-500 text-blue-600 bg-white rounded-xl py-3.5 font-bold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit3 className="w-5 h-5" /> Edit Details
                    </button>
                    {item.saved >= item.price ? (
                        <button 
                            onClick={() => setIsCompleteModalOpen(true)}
                            className="w-full bg-emerald-500 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-6 h-6" /> Archive Goal
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsAddFundsModalOpen(true)}
                            className="w-full bg-blue-700 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:bg-blue-800 transition-colors"
                        >
                            Add Funds
                        </button>
                    )}
                    {item.saved > 0 && !item.isArchived && (
                        <button 
                            onClick={() => setIsDeductFundsModalOpen(true)}
                            className="w-full text-slate-500 hover:text-red-600 font-semibold py-3 hover:bg-red-50 rounded-xl transition-all"
                        >
                            Deduct Funds
                        </button>
                    )}
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
                banks={banks}
                walletBalance={balance}
                isWalletHidden={isWalletHidden}
            />

            <AddFundsModal
                isOpen={isAddFundsModalOpen}
                onClose={() => setIsAddFundsModalOpen(false)}
                onConfirm={handleAddFunds}
                itemName={item.name}
                currentSaved={item.saved}
                price={item.price}
                walletBalance={balance}
                banks={banks}
                defaultBankId={item.bankId}
            />

            <DeductFundsModal
                isOpen={isDeductFundsModalOpen}
                onClose={() => setIsDeductFundsModalOpen(false)}
                onConfirm={handleDeductFunds}
                itemName={item.name}
                currentSaved={item.saved}
                fundingSourceName={item.bankId ? banks.find(b => b.id === item.bankId)?.name || 'Unknown Bank' : 'WishPay Wallet'}
            />

            <CompleteConfirmationModal 
                isOpen={isCompleteModalOpen}
                itemName={item.name}
                onConfirm={handleComplete}
                onCancel={() => setIsCompleteModalOpen(false)}
            />
        </div>
    );
}