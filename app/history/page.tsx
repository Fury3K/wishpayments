'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import api from '@/lib/api';
import { Item } from '../types';
import { ArrowLeft, History as HistoryIcon, Trash2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-100/60 rounded-full blur-3xl -mr-20 -mt-20 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-100/60 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="max-w-4xl mx-auto w-full p-6 pb-20">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="btn btn-circle btn-ghost bg-white/50 hover:bg-white border border-white/20 shadow-sm">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <HistoryIcon className="w-8 h-8 text-violet-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">History</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Track your past purchases and removed items</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-violet-500"></span>
            </div>
          ) : archivedItems.length === 0 ? (
            <div className="text-center py-20 opacity-60 bg-white/40 backdrop-blur-md rounded-3xl border border-white/40">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <HistoryIcon className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium text-slate-600">No history found.</p>
              <p className="text-sm text-slate-500">Items you delete or buy will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {archivedItems.map((item) => (
                <div key={item.id} className="group card bg-white/60 backdrop-blur-xl shadow-sm hover:shadow-md border border-white/40 transition-all duration-300">
                  <div className="card-body p-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg text-slate-700 line-through decoration-slate-400/50 decoration-2">{item.name}</h3>
                          {item.saved >= item.price ? (
                            <span className="badge badge-success badge-sm gap-1 text-white border-none shadow-sm bg-emerald-500">
                              <CheckCircle className="w-3 h-3" /> Bought
                            </span>
                          ) : (
                            <span className="badge badge-error badge-sm gap-1 text-white border-none shadow-sm bg-rose-500">
                              <Trash2 className="w-3 h-3" /> Removed
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">
                            {formatDate(item.dateArchived)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Original Price</div>
                        <div className="font-black text-xl text-slate-700">
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
    </div>
  );
}