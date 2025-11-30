'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import api from '@/lib/api';
import { Item } from '../types';
import { ArrowLeft, History as HistoryIcon, Trash2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns'; // You might need to install date-fns or use native Intl

export default function HistoryPage() {
  const [archivedItems, setArchivedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/items?status=archived');
        setArchivedItems(response.data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  };

  return (
    <div className="max-w-md mx-auto md:max-w-3xl min-h-screen pb-20">
      <Navbar />
      
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2 mb-6">
            <Link href="/dashboard" className="btn btn-ghost btn-circle">
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <HistoryIcon className="w-6 h-6" /> History
            </h1>
        </div>

        {loading ? (
            <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        ) : archivedItems.length === 0 ? (
            <div className="text-center py-10 opacity-50">
                <p>No history found.</p>
                <p className="text-sm">Items you delete or buy will appear here.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {archivedItems.map((item) => (
                    <div key={item.id} className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg opacity-70 line-through">{item.name}</h3>
                                    <div className="text-xs text-base-content/60 mt-1 flex items-center gap-1">
                                        {item.saved >= item.price ? (
                                            <span className="text-success flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Bought</span>
                                        ) : (
                                            <span className="text-error flex items-center gap-1"><Trash2 className="w-3 h-3"/> Removed</span>
                                        )}
                                        <span>•</span>
                                        <span>{formatDate(item.dateArchived)}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-base-content/70">
                                        {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.price)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}