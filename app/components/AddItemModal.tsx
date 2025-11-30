import { useState, useEffect } from 'react';
import { ItemType, Priority } from '../types';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (item: any) => void;
    activeTab: ItemType;
}

export const AddItemModal = ({ isOpen, onClose, onAdd, activeTab }: AddItemModalProps) => {
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        saved: '0',
        priority: 'medium' as Priority
    });

    useEffect(() => {
        if (isOpen) {
            setNewItem({
                name: '',
                price: '',
                saved: '0',
                priority: 'medium'
            });
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...newItem,
            type: activeTab
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Add New {activeTab === 'need' ? 'Necessity' : 'Wish'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">What is it?</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="e.g. Rent, iPhone 15" 
                            className="input input-bordered w-full" 
                            value={newItem.name}
                            onChange={e => setNewItem({...newItem, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="form-control w-1/2">
                            <label className="label">
                                <span className="label-text">Total Price (₱)</span>
                            </label>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                className="input input-bordered w-full" 
                                value={newItem.price}
                                onChange={e => setNewItem({...newItem, price: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-control w-1/2">
                            <label className="label">
                                <span className="label-text">Saved Already (₱)</span>
                            </label>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                className="input input-bordered w-full" 
                                value={newItem.saved}
                                onChange={e => setNewItem({...newItem, saved: e.target.value})}
                            />
                        </div>
                    </div>

                    {activeTab === 'need' && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Priority</span>
                            </label>
                            <select 
                                className="select select-bordered"
                                value={newItem.priority}
                                onChange={e => setNewItem({...newItem, priority: e.target.value as Priority})}
                            >
                                <option value="high">🔥 High Priority</option>
                                <option value="medium">⚡ Medium Priority</option>
                                <option value="low">🌱 Low Priority</option>
                            </select>
                        </div>
                    )}
                    
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Item</button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};
