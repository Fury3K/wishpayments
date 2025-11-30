'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Zap, Heart } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SummaryCard } from '../components/SummaryCard';
import { WalletCard } from '../components/WalletCard';
import { ItemCard } from '../components/ItemCard';
import { ItemModal } from '../components/AddItemModal';
import { CashOutModal } from '../components/modals/CashOutModal';
import { CashInModal } from '../components/modals/CashInModal';
import { ConfirmationModal } from '../components/modals/ConfirmationModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { CompleteConfirmationModal } from '../components/modals/CompleteConfirmationModal';
import { AlertModal } from '../components/modals/AlertModal';
import { Item, ItemType } from '../types';
import { useRouter } from 'next/navigation';
import api from '@/lib/api'; // Custom axios instance
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ItemType>('need');
  const [items, setItems] = useState<Item[]>([]);
  const [balance, setBalance] = useState(0);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // desc = High to Low
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [isCashInModalOpen, setIsCashInModalOpen] = useState(false);
  const [isCashOutModalOpen, setIsCashOutModalOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true); // New state for loading items

  const handleLogout = () => {
    localStorage.removeItem('token'); // Assuming JWT token is stored here
    localStorage.removeItem('wishpay_items'); // Clear local storage items (no longer needed after backend)
    localStorage.removeItem('wishpay_balance'); // Clear local storage balance (no longer needed after backend)
    router.push('/');
  };

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

  // Complete Confirmation Modal State
  const [completeModal, setCompleteModal] = useState({
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

  // --- Fetch items from API on mount ---
  const fetchItems = useCallback(async () => {
    setLoadingItems(true);
    try {
      const itemsResponse = await api.get('/api/items');
      setItems(itemsResponse.data);

      const userBalanceResponse = await api.get('/api/user/balance'); 
      setBalance(userBalanceResponse.data.balance || 0);

    } catch (error: any) {
      if (error.response && error.response.status === 401) {
          router.push('/login'); // Redirect to login if unauthorized
      } else {
          toast.error(error.response?.data?.message || 'Failed to fetch items or balance.');
          console.error('Failed to fetch items or balance:', error);
      }
    } finally {
      setLoadingItems(false);
    }
  }, [router]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  // --- End Fetch items ---

  // Removed localStorage useEffects

  const stats = useMemo(() => {
    const currentList = items.filter(i => i.type === activeTab);
    const totalCost = currentList.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const totalSaved = currentList.reduce((acc, curr) => acc + (curr.saved || 0), 0);
    const progress = totalCost > 0 ? (totalSaved / totalCost) * 100 : 0;
    const count = currentList.length;
    return { totalCost, totalSaved, progress, count };
  }, [items, activeTab]);

  const handleCashIn = async (amount: number) => {
      try {
          const newBalance = balance + amount;
          const response = await api.put('/api/user/balance', { balance: newBalance });
          setBalance(response.data.balance);
          toast.success(`Cashed in ₱${amount.toLocaleString()} successfully!`);
      } catch (error: any) {
          console.error('Error cashing in:', error);
          toast.error(error.response?.data?.message || 'Failed to cash in.');
      }
  };

  const handleCashOut = async (amount: number) => {
      try {
          const newBalance = balance - amount;
          if (newBalance < 0) {
              toast.error('Insufficient balance');
              return;
          }
          const response = await api.put('/api/user/balance', { balance: newBalance });
          setBalance(response.data.balance);
          toast.success(`Removed ₱${amount.toLocaleString()} successfully!`);
      } catch (error: any) {
          console.error('Error removing funds:', error);
          toast.error(error.response?.data?.message || 'Failed to remove funds.');
      }
  };

  const handleSaveItem = async (itemData: any) => {
      const price = parseFloat(itemData.price);
      let savedAmount = parseFloat(itemData.saved || '0');

      if (savedAmount > price) {
          savedAmount = price;
      }

      if (itemData.id) {
          // Edit Mode
          const existingItem = items.find(i => i.id === itemData.id);
          if (!existingItem) {
              toast.error('Item to edit not found.');
              return;
          }

          const savedDiff = savedAmount - existingItem.saved;

          try {
              // Update item via API
              const updatedItemData = {
                  name: itemData.name,
                  price: price,
                  saved: savedAmount,
                  type: itemData.type,
                  priority: itemData.priority,
              };
              const itemResponse = await api.put(`/api/items/${itemData.id}`, updatedItemData);
              const updatedItem: Item = itemResponse.data;

              // Update local items state
              setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));

              // Adjust balance via API if saved amount changed
              if (savedDiff !== 0) {
                  const newBalance = balance - savedDiff;
                  if (savedDiff > 0 && newBalance < 0) { // Check if we have enough balance to increase saved
                       showAlert("Not enough money in wallet to increase saved amount!");
                       // Revert to original balance if this is a problem
                       // Optionally, fetch user balance again or only allow positive savedDiff if balance permits
                       return;
                  }
                  const updatedBalanceResponse = await api.put('/api/user/balance', { balance: newBalance });
                  setBalance(updatedBalanceResponse.data.balance);
              }
              toast.success('Item updated successfully!');

          } catch (error: any) {
              console.error('Error updating item:', error);
              toast.error(error.response?.data?.message || 'Failed to update item.');
          }

      } else {
          // Add Mode
          if (savedAmount > balance) {
            showAlert("Not enough money in wallet for initial deposit!");
            return;
          }

          try {
              const newItemData = {
                  name: itemData.name,
                  price: price,
                  saved: savedAmount,
                  type: itemData.type,
                  priority: itemData.priority,
              };
              const itemResponse = await api.post('/api/items', newItemData);
              const createdItem: Item = itemResponse.data;

              // Update local state with the newly created item
              setItems(prev => [createdItem, ...prev]);

              // Deduct saved amount from user's balance via API
              if (savedAmount > 0) {
                const updatedBalanceResponse = await api.put('/api/user/balance', { balance: balance - savedAmount });
                setBalance(updatedBalanceResponse.data.balance);
              }
              toast.success('Item added successfully!');

          } catch (error: any) {
              console.error('Error adding item:', error);
              toast.error(error.response?.data?.message || 'Failed to add item.');
          }
      }
      
      setIsModalOpen(false);
      setItemToEdit(null);
  };

  const handleEditItem = async (item: Item) => {
      setItemToEdit(item);
      setIsModalOpen(true);
  };

  const initiateDelete = async (id: number) => {
    const itemToDelete = items.find(i => i.id === id);
    if (!itemToDelete) return;
    setDeleteModal({ isOpen: true, item: itemToDelete });
  };

  const initiateComplete = (item: Item) => {
      setCompleteModal({ isOpen: true, item });
  };

  const handleConfirmComplete = async () => {
      if (completeModal.item) {
          try {
              await api.delete(`/api/items/${completeModal.item.id}`);
              setItems(prev => prev.filter(item => item.id !== completeModal.item?.id));
              setCompleteModal({ isOpen: false, item: null });
              toast.success(`${completeModal.item.name} bought and archived!`);
          } catch (error: any) {
              console.error('Error completing item:', error);
              toast.error(error.response?.data?.message || 'Failed to complete item.');
          }
      }
  };

  const handleConfirmBought = async () => {
      if (deleteModal.item) {
          try {
              await api.delete(`/api/items/${deleteModal.item.id}`);
              setItems(prev => prev.filter(item => item.id !== deleteModal.item?.id));
              setDeleteModal({ isOpen: false, item: null });
              toast.success(`${deleteModal.item.name} marked as bought!`);
          } catch (error: any) {
              console.error('Error marking item as bought:', error);
              toast.error(error.response?.data?.message || 'Failed to mark item as bought.');
          }
      }
  };

  const handleConfirmRemove = async () => {
    if (!deleteModal.item) return;

    const itemToDelete = deleteModal.item;

    const performRemove = async () => {
         try {
            if (itemToDelete.saved > 0) {
                const updatedBalanceResponse = await api.put('/api/user/balance', { balance: balance + itemToDelete.saved });
                setBalance(updatedBalanceResponse.data.balance);
            }
            await api.delete(`/api/items/${itemToDelete.id}`);
            setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
            setDeleteModal({ isOpen: false, item: null });
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            toast.success(`${itemToDelete.name} removed successfully!`);
         } catch (error: any) {
             console.error('Error removing item:', error);
             toast.error(error.response?.data?.message || 'Failed to remove item.');
         }
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

  const handleUpdateSaved = async (id: number, rawAmount: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    // Cap at price
    let newAmount = rawAmount;
    if (newAmount > item.price) {
        newAmount = item.price;
    }

    const currentSaved = item.saved;
    const difference = newAmount - currentSaved;

    const updateState = async () => {
        try {
            // 1. Update item's saved amount via API
            const itemUpdateResponse = await api.put(`/api/items/${id}`, { ...item, saved: newAmount, price: item.price }); // Send full item data, price needed for validation
            const updatedItem: Item = itemUpdateResponse.data;

            // 2. Adjust user's balance via API if necessary
            if (difference !== 0) {
                const newBalance = balance - difference;
                const balanceUpdateResponse = await api.put('/api/user/balance', { balance: newBalance });
                setBalance(balanceUpdateResponse.data.balance);
            }
            
            // 3. Update local items state
            setItems(prev => prev.map(i => {
                if (i.id === id) {
                    return updatedItem;
                }
                return i;
            }));
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            toast.success('Item saved amount updated!');

        } catch (error: any) {
            console.error('Error updating saved amount:', error);
            toast.error(error.response?.data?.message || 'Failed to update saved amount.');
        }
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

  const handleQuickAdd = async (id: number, amountToAdd: number) => {
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

    if (actualAdded <= 0) {
        showAlert("This item is already fully funded!");
        return;
    }

    const performQuickAdd = async () => {
        try {
            // Update item's saved amount via API
            const itemUpdateResponse = await api.put(`/api/items/${id}`, { ...item, saved: newSaved, price: item.price }); // Send full item data, price needed for validation
            const updatedItem: Item = itemUpdateResponse.data;

            // Adjust user's balance via API
            const balanceUpdateResponse = await api.put('/api/user/balance', { balance: balance - actualAdded });
            setBalance(balanceUpdateResponse.data.balance);
            
            // Update local items state
            setItems(prev => prev.map(i => {
                if (i.id === id) {
                    return updatedItem;
                }
                return i;
            }));
            setConfirmModal(prev => ({ ...prev, isOpen: false })); // Close confirmation modal if it was open
            toast.success(`₱${actualAdded.toLocaleString()} added to ${item.name}!`);

        } catch (error: any) {
            console.error('Error quick adding amount:', error);
            toast.error(error.response?.data?.message || 'Failed to quick add amount.');
        }
    };

    // Check for High Priority Needs if quick-adding to a Want
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
                onConfirm: performQuickAdd
            });
            return;
        }
    }
    
    // If no warning needed or not a want item, proceed directly
    performQuickAdd();
  };

  if (loadingItems) {
      return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <div className="max-w-md mx-auto md:max-w-3xl min-h-screen pb-20">
      <Navbar onLogout={handleLogout} />
      
      <div className="p-4 space-y-6">
        <WalletCard 
            balance={balance}
            onCashIn={() => setIsCashInModalOpen(true)}
            onCashOut={() => setIsCashOutModalOpen(true)}
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
            {activeTab === 'need' && (
                <div className="flex justify-end px-2">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-sm btn-ghost gap-2 normal-case">
                            Sort by Priority: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a onClick={() => setSortOrder('desc')} className={sortOrder === 'desc' ? 'active' : ''}>High to Low</a></li>
                            <li><a onClick={() => setSortOrder('asc')} className={sortOrder === 'asc' ? 'active' : ''}>Low to High</a></li>
                        </ul>
                    </div>
                </div>
            )}

            {items.filter(i => i.type === activeTab).length === 0 ? (
                <div className="text-center py-10 opacity-50">
                    <p>No items in this list yet.</p>
                    <p className="text-sm">Tap + to add something!</p>
                </div>
            ) : (
                items
                .filter(i => i.type === activeTab)
                .sort((a, b) => {
                    if (activeTab === 'want') {
                        // For 'want' tab, sort by ID (newest first)
                        return b.id - a.id;
                    }
                    // For 'need' tab, apply priority sorting
                    const priorityWeight = { high: 3, medium: 2, low: 1 };
                    const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
                    return sortOrder === 'desc' ? diff : -diff;
                })
                .map(item => (
                    <ItemCard 
                        key={item.id} 
                        item={item} 
                        onDelete={initiateDelete}
                        onUpdateSaved={handleUpdateSaved}
                        onQuickAdd={handleQuickAdd}
                        onEdit={handleEditItem}
                        onComplete={initiateComplete}
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
                  onClick={() => {
                      setItemToEdit(null);
                      setIsModalOpen(true);
                  }}
              >
                  <Plus className="w-6 h-6" />
              </button>
          </div>
      </div>

      <ItemModal 
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setItemToEdit(null);
        }}
        onSave={handleSaveItem}
        activeTab={activeTab}
        itemToEdit={itemToEdit}
      />

      <CashInModal 
        isOpen={isCashInModalOpen}
        onClose={() => setIsCashInModalOpen(false)}
        onConfirm={handleCashIn}
      />

      <CashOutModal 
        isOpen={isCashOutModalOpen}
        onClose={() => setIsCashOutModalOpen(false)}
        onConfirm={handleCashOut}
        currentBalance={balance}
      />

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.item?.name || ''}
        onBought={handleConfirmBought}
        onRemove={handleConfirmRemove}
        onCancel={() => setDeleteModal({ isOpen: false, item: null })}
      />

      <CompleteConfirmationModal
        isOpen={completeModal.isOpen}
        itemName={completeModal.item?.name || ''}
        onConfirm={handleConfirmComplete}
        onCancel={() => setCompleteModal({ isOpen: false, item: null })}
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