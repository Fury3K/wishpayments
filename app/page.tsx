'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Zap, Heart } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SummaryCard } from './components/SummaryCard';
import { WalletCard } from './components/WalletCard';
import { ItemCard } from './components/ItemCard';
import { AddItemModal } from './components/AddItemModal';
import { CashInModal } from './components/modals/CashInModal';
import { ConfirmationModal } from './components/modals/ConfirmationModal';
import { DeleteConfirmationModal } from './components/modals/DeleteConfirmationModal';
import { AlertModal } from './components/modals/AlertModal';
import { Item, ItemType } from './types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ItemType>('need');
  const [items, setItems] = useState<Item[]>([]);
  const [balance, setBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCashInModalOpen, setIsCashInModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null as Item | null,
  });

  // Alert Modal State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    message: '',
  });

  const showAlert = (message: string) => {
    setAlertModal({ isOpen: true, message });
  };

  // Load from local storage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('wishpay_items');
    const savedBalance = localStorage.getItem('wishpay_balance');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    if (savedBalance) {
        setBalance(parseFloat(savedBalance));
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage when items or balance change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('wishpay_items', JSON.stringify(items));
      localStorage.setItem('wishpay_balance', balance.toString());
    }
  }, [items, balance, isLoaded]);

  const stats = useMemo(() => {
    const currentList = items.filter(i => i.type === activeTab);
    const totalCost = currentList.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const totalSaved = currentList.reduce((acc, curr) => acc + (curr.saved || 0), 0);
    const progress = totalCost > 0 ? (totalSaved / totalCost) * 100 : 0;
    const count = currentList.length;
    return { totalCost, totalSaved, progress, count };
  }, [items, activeTab]);

  const handleCashIn = (amount: number) => {
      setBalance(prev => prev + amount);
  };

  const handleAddItem = (newItem: any) => {
    // Cap initial saved amount to price
    const price = parseFloat(newItem.price);
    let initialSaved = parseFloat(newItem.saved || '0');

    if (initialSaved > price) {
        initialSaved = price;
    }

    if (initialSaved > balance) {
        showAlert("Not enough money in wallet for initial deposit!");
        return;
    }

    if (initialSaved > 0) {
        setBalance(prev => prev - initialSaved);
    }

    const item: Item = {
      id: Date.now(),
      name: newItem.name,
      price: price,
      saved: initialSaved,
      type: newItem.type,
      priority: newItem.priority,
      dateAdded: new Date().toISOString()
    };
    setItems(prev => [item, ...prev]);
    setIsModalOpen(false);
  };

  const initiateDelete = (id: number) => {
    const itemToDelete = items.find(i => i.id === id);
    if (!itemToDelete) return;
    setDeleteModal({ isOpen: true, item: itemToDelete });
  };

  const handleConfirmBought = () => {
      if (deleteModal.item) {
          setItems(prev => prev.filter(item => item.id !== deleteModal.item?.id));
          setDeleteModal({ isOpen: false, item: null });
      }
  };

  const handleConfirmRemove = () => {
    if (!deleteModal.item) return;

    const itemToDelete = deleteModal.item;

    const performRemove = () => {
         if (itemToDelete.saved > 0) {
            setBalance(prev => prev + itemToDelete.saved);
        }
        setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
        setDeleteModal({ isOpen: false, item: null });
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    if (itemToDelete.saved > 0) {
        // Close the first modal to show the second one clearly
        setDeleteModal({ isOpen: false, item: null });
        
        setConfirmModal({
            isOpen: true,
            title: 'Refund Confirmation',
            message: `PHP ${itemToDelete.saved.toLocaleString()} will be sent back to your wallet, are you sure you want to remove this?`,
            onConfirm: performRemove
        });
    } else {
        performRemove();
    }
  };

  const handleUpdateSaved = (id: number, rawAmount: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    // Cap at price
    let newAmount = rawAmount;
    if (newAmount > item.price) {
        newAmount = item.price;
    }

    const currentSaved = item.saved;
    const difference = newAmount - currentSaved;

    const updateState = () => {
        if (difference > 0) {
             setBalance(prev => prev - difference);
        } else {
             // Refund
             setBalance(prev => prev + Math.abs(difference));
        }
        
        setItems(prev => prev.map(i => {
            if (i.id === id) {
                return { ...i, saved: newAmount };
            }
            return i;
        }));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    if (difference > 0) {
        // Adding money
        if (difference > balance) {
            showAlert("Not enough money in wallet!");
            return;
        }

        // Check for High Priority Needs if adding to a Want
        if (item.type === 'want') {
            const hasUnfundedHighPriorityNeed = items.some(i => 
                i.type === 'need' && 
                i.priority === 'high' && 
                i.saved < i.price
            );

            if (hasUnfundedHighPriorityNeed) {
                setConfirmModal({
                    isOpen: true,
                    title: 'Priority Warning',
                    message: "You have a High Priority Need that hasn't reached its funding yet. Are you sure you want to fund this Want first?",
                    onConfirm: updateState
                });
                return;
            }
        }

        updateState();
    } else if (difference < 0) {
        // Removing money (Refund)
        setConfirmModal({
            isOpen: true,
            title: 'Refund Confirmation',
            message: `You are taking money away from this goal. Php ${Math.abs(difference).toLocaleString()} will be sent back to your wallet. Are you sure?`,
            onConfirm: updateState
        });
    }
  };

  const handleQuickAdd = (id: number, amountToAdd: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    if (amountToAdd > balance) {
        showAlert("Not enough money in wallet!");
        return;
    }

    // Calculate new saved amount, capped at price
    let newSaved = item.saved + amountToAdd;
    if (newSaved > item.price) {
        newSaved = item.price;
    }

    const actualAdded = newSaved - item.saved;

    if (actualAdded > 0) {
        setBalance(prev => prev - actualAdded);
        setItems(prev => prev.map(i => {
            if (i.id === id) {
                return { ...i, saved: newSaved };
            }
            return i;
        }));
    } else {
        // already full
        showAlert("This item is already fully funded!");
    }
  };

  if (!isLoaded) {
      return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <div className="max-w-md mx-auto md:max-w-3xl min-h-screen pb-20">
      <Navbar />
      
      <div className="p-4 space-y-6">
        <WalletCard 
            balance={balance}
            onCashIn={() => setIsCashInModalOpen(true)}
        />

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
                        onDelete={initiateDelete}
                        onUpdateSaved={handleUpdateSaved}
                        onQuickAdd={handleQuickAdd}
                    />
                ))
            )}
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 left-0 right-0 z-40 pointer-events-none flex justify-center">
          <div className="w-full max-w-md md:max-w-3xl relative">
              <button 
                  className="btn btn-circle btn-primary btn-lg absolute bottom-0 right-6 shadow-2xl transform hover:scale-110 transition-transform pointer-events-auto"
                  onClick={() => setIsModalOpen(true)}
              >
                  <Plus className="w-6 h-6" />
              </button>
          </div>
      </div>

      <AddItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
        activeTab={activeTab}
      />

      <CashInModal 
        isOpen={isCashInModalOpen}
        onClose={() => setIsCashInModalOpen(false)}
        onConfirm={handleCashIn}
      />

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.item?.name || ''}
        onBought={handleConfirmBought}
        onRemove={handleConfirmRemove}
        onCancel={() => setDeleteModal({ isOpen: false, item: null })}
      />

      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <AlertModal 
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
      />
    </div>
  );
}