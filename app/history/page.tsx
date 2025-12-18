'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpDown, Coffee, ShoppingCart, CreditCard, Bus, Gift, Search, Filter, ChevronLeft } from 'lucide-react';
import api from '@/lib/api';
import { Item } from '../types';
import { BottomNav } from '../components/BottomNav';
import Link from 'next/link';

export default function HistoryPage() {
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'need' | 'want'>('all');
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/api/items?status=archived');
                setItems(response.data);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const filteredItems = useMemo(() => {
        if (filter === 'all') return items;
        return items.filter(item => item.type === filter);
    }, [items, filter]);

    const totalSpending = useMemo(() => {
        // Only count items where saved >= price (Bought)
        const boughtItems = items.filter(i => i.saved >= i.price);
        return boughtItems.reduce((acc, curr) => acc + curr.price, 0);
    }, [items]);

    const needsPercentage = useMemo(() => {
        if (totalSpending === 0) return 0;
        const needsSpent = items
            .filter(i => i.type === 'need' && i.saved >= i.price)
            .reduce((acc, curr) => acc + curr.price, 0);
        return Math.round((needsSpent / totalSpending) * 100);
    }, [items, totalSpending]);

    const groupedItems = useMemo(() => {
        const groups: { [key: string]: Item[] } = {};
        
        filteredItems.forEach(item => {
            if (!item.dateArchived) return;
            const date = new Date(item.dateArchived).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric' // Added year to ensure correct grouping across years
            });
            
            // Format to "Today" or "Yesterday" if applicable
            const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterday = yesterdayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            let displayDate = date;
            if (date === today) displayDate = `Today, ${date.split(',')[0]}`; // approximate formatting
            else if (date === yesterday) displayDate = `Yesterday, ${date.split(',')[0]}`;

            if (!groups[displayDate]) {
                groups[displayDate] = [];
            }
            groups[displayDate].push(item);
        });

        // Sort groups by date (descending) is tricky with strings, but the API usually returns sorted or we can sort keys.
        // For simplicity, we'll rely on object key order (not guaranteed) or sort keys manually.
        const sortedKeys = Object.keys(groups).sort((a, b) => {
             // Basic date parsing for sorting
             const dateA = new Date(a.replace('Today, ', '').replace('Yesterday, ', ''));
             const dateB = new Date(b.replace('Today, ', '').replace('Yesterday, ', ''));
             return dateB.getTime() - dateA.getTime();
        });

        return sortedKeys.reduce((obj, key) => {
            obj[key] = groups[key];
            return obj;
        }, {} as { [key: string]: Item[] });

    }, [filteredItems]);

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
                <h1 className="text-xl font-bold text-slate-800">Transaction History</h1>
                <button className="p-2 -mr-2 rounded-full active:bg-gray-200 transition-colors">
                    <ArrowUpDown className="w-5 h-5 text-slate-800" />
                </button>
            </header>

            <main className="px-4 pb-24 w-full max-w-md mx-auto flex-1">
                {/* Filter Tabs */}
                <nav aria-label="Transaction Filters" className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-white p-1 rounded-full shadow-sm mb-6">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`flex-none px-6 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        All
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
                </nav>

                {/* Summary Card */}
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

                {/* Grouped Transactions */}
                {Object.keys(groupedItems).length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p>No transactions found.</p>
                    </div>
                ) : (
                    Object.entries(groupedItems).map(([date, group]) => (
                        <section key={date} className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 mb-3 ml-1">{date}</h2>
                            <div className="">
                                {group.map(item => (
                                    <article key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl mb-3 shadow-sm">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                {item.type === 'need' ? (
                                                    <CreditCard className="text-slate-600 w-5 h-5" />
                                                ) : (
                                                    <ShoppingCart className="text-slate-600 w-5 h-5" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {new Date(item.dateArchived || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-red-600 text-sm mb-1">₱{item.price.toLocaleString()}</p>
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium 
                                                ${item.type === 'need' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                                {item.type === 'need' ? 'Need' : 'Want'}
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </main>

            <BottomNav />
        </div>
    );
}