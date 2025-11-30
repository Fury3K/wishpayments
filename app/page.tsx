'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Zap, Heart } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SummaryCard } from './components/SummaryCard';
import { ItemCard } from './components/ItemCard';
import { AddItemModal } from './components/AddItemModal';
import { Item, ItemType } from './types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ItemType>('need');
  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wishpay_items');
    if (saved) {
      setItems(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage when items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('wishpay_items', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const stats = useMemo(() => {
    const currentList = items.filter(i => i.type === activeTab);
    const totalCost = currentList.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const totalSaved = currentList.reduce((acc, curr) => acc + (curr.saved || 0), 0);
    const progress = totalCost > 0 ? (totalSaved / totalCost) * 100 : 0;
    const count = currentList.length;
    return { totalCost, totalSaved, progress, count };
  }, [items, activeTab]);

  const handleAddItem = (newItem: any) => {
    const item: Item = {
      id: Date.now(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      saved: parseFloat(newItem.saved || '0'),
      type: newItem.type,
      priority: newItem.priority,
      dateAdded: new Date().toISOString()
    };
    setItems(prev => [item, ...prev]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateSaved = (id: number, amount: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, saved: amount };
      }
      return item;
    }));
  };

  const handleQuickAdd = (id: number, amountToAdd: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newSaved = Math.min(item.saved + amountToAdd, item.price);
        return { ...item, saved: newSaved };
      }
      return item;
    }));
  };

  if (!isLoaded) {
      return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <div className="max-w-md mx-auto md:max-w-3xl min-h-screen pb-20">
      <Navbar />
      
      <div className="p-4 space-y-6">
        <SummaryCard 
            activeTab={activeTab}
            {...stats}
        />

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-base-100 p-1">
            <a 
                className={`tab tab-lg flex-1 gap-2 transition-all ${activeTab === 'need' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('need')}
            >
                <Zap className="w-4 h-4" /> Needs
            </a>
            <a 
                className={`tab tab-lg flex-1 gap-2 transition-all ${activeTab === 'want' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('want')}
            >
                <Heart className="w-4 h-4" /> Wants
            </a>
        </div>

        {/* List Items */}
        <div className="space-y-4">
            {items.filter(i => i.type === activeTab).length === 0 ? (
                <div className="text-center py-10 opacity-50">
                    <p>No items in this list yet.</p>
                    <p className="text-sm">Tap + to add something!</p>
                </div>
            ) : (
                items
                .filter(i => i.type === activeTab)
                .map(item => (
                    <ItemCard 
                        key={item.id} 
                        item={item} 
                        onDelete={handleDelete}
                        onUpdateSaved={handleUpdateSaved}
                        onQuickAdd={handleQuickAdd}
                    />
                ))
            )}
        </div>
      </div>

      {/* FAB */}
      <button 
          className="btn btn-circle btn-primary btn-lg fixed bottom-6 right-6 shadow-2xl z-40 transform hover:scale-110 transition-transform"
          onClick={() => setIsModalOpen(true)}
      >
          <Plus className="w-6 h-6" />
      </button>

      <AddItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
        activeTab={activeTab}
      />
    </div>
  );
}