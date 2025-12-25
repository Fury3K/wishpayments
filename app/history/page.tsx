'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpDown, Coffee, ShoppingCart, CreditCard, Bus, Gift, Search, Filter, ChevronLeft, Wallet, ArrowDownLeft, ArrowUpRight, RefreshCw, Archive } from 'lucide-react';
import api from '@/lib/api';
import { Item, BankAccount } from '../types';
import { BottomNav } from '../components/BottomNav';
import Link from 'next/link';

interface Transaction {
    id: number;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'allocation' | 'reversal';
    description: string;
    bankId: number | null;
    itemId: number | null;
    date: string;
}

export default function HistoryPage() {
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'need' | 'want' | 'cash-flow'>('all');
    const [bankFilter, setBankFilter] = useState<string>('all');
    const [items, setItems] = useState<Item[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [banks, setBanks] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemsRes, banksRes, txRes] = await Promise.all([
                    api.get('/api/items?status=archived'),
                    api.get('/api/banks'),
                    api.get('/api/transactions')
                ]);
                setItems(itemsRes.data);
                setBanks(banksRes.data);
                setTransactions(txRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredItems = useMemo(() => {
        let res = items;
        // Filter by Type
        if (filter !== 'all' && filter !== 'cash-flow') {
            res = res.filter(item => item.type === filter);
        }
        // Filter by Bank Source
        if (bankFilter !== 'all') {
            if (bankFilter === 'wallet') {
                res = res.filter(item => !item.bankId);
            } else {
                res = res.filter(item => item.bankId === parseInt(bankFilter));
            }
        }
        return res;
    }, [items, filter, bankFilter]);

    const filteredTransactions = useMemo(() => {
        let res = transactions;
        if (bankFilter !== 'all') {
            if (bankFilter === 'wallet') {
                res = res.filter(tx => !tx.bankId);
            } else {
                res = res.filter(tx => tx.bankId === parseInt(bankFilter));
            }
        }
        return res;
    }, [transactions, bankFilter]);

    const totalSpending = useMemo(() => {
        const boughtItems = filteredItems.filter(i => i.saved >= i.price);
        return boughtItems.reduce((acc, curr) => acc + curr.price, 0);
    }, [filteredItems]);

    const needsPercentage = useMemo(() => {
        if (totalSpending === 0) return 0;
        const needsSpent = filteredItems
            .filter(i => i.type === 'need' && i.saved >= i.price)
            .reduce((acc, curr) => acc + curr.price, 0);
        return Math.round((needsSpent / totalSpending) * 100);
    }, [filteredItems, totalSpending]);

    const groupedData = useMemo(() => {
        const data = filter === 'cash-flow' ? filteredTransactions : filteredItems;
        const groups: { [key: string]: any[] } = {};
        
        data.forEach(item => {
            const dateStr = filter === 'cash-flow' ? (item as Transaction).date : (item as Item).dateArchived;
            if (!dateStr) return;
            const date = new Date(dateStr).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            
            const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterday = yesterdayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            let displayDate = date;
            if (date === today) displayDate = `Today, ${date.split(',')[0]}`;
            else if (date === yesterday) displayDate = `Yesterday, ${date.split(',')[0]}`;

            if (!groups[displayDate]) {
                groups[displayDate] = [];
            }
            groups[displayDate].push(item);
        });

        const sortedKeys = Object.keys(groups).sort((a, b) => {
             const dateA = new Date(a.replace('Today, ', '').replace('Yesterday, ', ''));
             const dateB = new Date(b.replace('Today, ', '').replace('Yesterday, ', ''));
             return dateB.getTime() - dateA.getTime();
        });

        return sortedKeys.reduce((obj, key) => {
            obj[key] = groups[key];
            return obj;
        }, {} as { [key: string]: any[] });

    }, [filteredItems, filteredTransactions, filter]);

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

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'deposit': return <ArrowDownLeft className="w-5 h-5 text-emerald-600" />;
            case 'withdrawal': return <ArrowUpRight className="w-5 h-5 text-red-600" />;
            case 'allocation': return <Archive className="w-5 h-5 text-blue-600" />;
            case 'reversal': return <RefreshCw className="w-5 h-5 text-orange-600" />;
            default: return <ArrowUpDown className="w-5 h-5 text-gray-600" />;
        }
    };

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center bg-slate-50"><span className="loading loading-spinner loading-lg text-blue-600"></span></div>;
    }

    return (
        <div className="bg-slate-50 text-[#1F2937] font-sans antialiased min-h-screen pb-24 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-slate-50 px-4 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="p-2 -ml-2 rounded-full active:bg-gray-200 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-slate-800" />
                </Link>
                <h1 className="text-xl font-bold text-slate-800">History</h1>
                <button className="p-2 -mr-2 rounded-full active:bg-gray-200 transition-colors">
                    <ArrowUpDown className="w-5 h-5 text-slate-800" />
                </button>
            </header>

            <main className="px-4 pb-24 w-full max-w-md mx-auto flex-1">
                {/* Type Filter Tabs */}
                <nav aria-label="Transaction Type Filters" className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-white p-1 rounded-full shadow-sm mb-4">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`flex-none px-6 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Purchase History
                    </button>
                    <button 
                        onClick={() => setFilter('need')}
                        className={`flex-none px-6 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'need' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Needs
                    </button>
                    <button 
                        onClick={() => setFilter('want')}
                        className={`flex-none px-6 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'want' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Wants
                    </button>
                    <button 
                        onClick={() => setFilter('cash-flow')}
                        className={`flex-none px-6 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'cash-flow' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Cash Flow
                    </button>
                </nav>

                {/* Bank Source Filter */}
                <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                     <button
                        onClick={() => setBankFilter('all')}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${bankFilter === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                    >
                        All Sources
                    </button>
                    <button
                        onClick={() => setBankFilter('wallet')}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 ${bankFilter === 'wallet' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                    >
                        <Wallet className="w-3 h-3" /> Wallet
                    </button>
                    {banks.map(bank => (
                        <button
                            key={bank.id}
                            onClick={() => setBankFilter(bank.id.toString())}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 ${bankFilter === bank.id.toString() ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${getBankColorClass(bank.id)}`}></span>
                            {bank.name}
                        </button>
                    ))}
                </div>

                {/* Summary Card (Hide for Cash Flow) */}
                {filter !== 'cash-flow' && (
                    <section className="bg-white rounded-3xl p-5 shadow-sm mb-6">
                        <div className="mb-3">
                            <p className="text-gray-900 font-semibold text-base mb-1">
                                Total Spending: <span className="font-bold">₱{totalSpending.toLocaleString()}</span>
                            </p>
                            <p className="text-gray-500 text-xs">
                                Needs: <span className="font-medium text-gray-700">{needsPercentage}%</span>
                                <span className="mx-1 text-gray-300">|</span>
                                Wants: <span className="font-medium text-gray-700">{100 - needsPercentage}%</span>
                            </p>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="relative w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full" style={{ width: `${needsPercentage}%` }}></div>
                        </div>
                    </section>
                )}

                {/* Grouped Data */}
                {Object.keys(groupedData).length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p>No {filter === 'cash-flow' ? 'transactions' : 'purchases'} found.</p>
                    </div>
                ) : (
                    Object.entries(groupedData).map(([date, group]) => (
                        <section key={date} className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 mb-3 ml-1">{date}</h2>
                            <div className="">
                                {group.map(item => {
                                    // Render Transaction
                                    if ('description' in item) {
                                        const tx = item as Transaction;
                                        const isPositive = tx.type === 'deposit' || tx.type === 'reversal';
                                        return (
                                            <article key={tx.id} className="flex items-center justify-between p-4 bg-white rounded-2xl mb-3 shadow-sm relative overflow-hidden">
                                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getBankColorClass(tx.bankId)}`}></div>
                                                <div className="flex items-center space-x-4 ml-2 flex-1 min-w-0">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === 'deposit' ? 'bg-emerald-100' : tx.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'}`}>
                                                        {getTransactionIcon(tx.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-gray-900 text-sm break-words">{tx.description}</h3>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-medium truncate">
                                                            {tx.bankId ? banks.find(b => b.id === tx.bankId)?.name || 'Unknown Bank' : 'WishPay Wallet'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0 ml-4">
                                                    <p className={`font-semibold text-sm mb-1 ${isPositive ? 'text-emerald-600' : 'text-gray-800'}`}>
                                                        {isPositive ? '+' : '-'}₱{tx.amount.toLocaleString()}
                                                    </p>
                                                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 uppercase">
                                                        {tx.type}
                                                    </span>
                                                </div>
                                            </article>
                                        );
                                    } 
                                    // Render Item (Purchase History)
                                    else {
                                        const i = item as Item;
                                        return (
                                            <article key={i.id} className="flex items-center justify-between p-4 bg-white rounded-2xl mb-3 shadow-sm relative overflow-hidden">
                                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getBankColorClass(i.bankId)}`}></div>
                                                <div className="flex items-center space-x-4 ml-2 flex-1 min-w-0">
                                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                        {i.type === 'need' ? (
                                                            <CreditCard className="text-slate-600 w-5 h-5" />
                                                        ) : (
                                                            <ShoppingCart className="text-slate-600 w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-gray-900 text-sm break-words">{i.name}</h3>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {new Date(i.dateArchived || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-medium truncate">
                                                            {i.bankId ? banks.find(b => b.id === i.bankId)?.name || 'Unknown Bank' : 'WishPay Wallet'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0 ml-4">
                                                    <p className="font-semibold text-red-600 text-sm mb-1">₱{i.price.toLocaleString()}</p>
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium 
                                                        ${i.type === 'need' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                                        {i.type === 'need' ? 'Need' : 'Want'}
                                                    </span>
                                                </div>
                                            </article>
                                        );
                                    }
                                })}
                            </div>
                        </section>
                    ))
                )}
            </main>

            <BottomNav />
        </div>
    );
}