import { useState, useEffect } from 'react';
import { ItemType, Priority } from '../types';

interface ItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: any) => void;
    activeTab: ItemType;
    itemToEdit?: Item | null;
}

import { Item } from '../types';

export const ItemModal = ({ isOpen, onClose, onSave, activeTab, itemToEdit }: ItemModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        saved: '0',
        priority: 'medium' as Priority
    });

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setFormData({
                    name: itemToEdit.name,
                    price: itemToEdit.price.toString(),
                    saved: itemToEdit.saved.toString(),
                    priority: itemToEdit.priority
                });
            } else {
                setFormData({
                    name: '',
                    price: '',
                    saved: '0',
                    priority: 'medium'
                });
            }
        }
    }, [isOpen, itemToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            type: activeTab,
            id: itemToEdit?.id // Pass ID if editing
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">
                    {itemToEdit ? 'Edit Item' : `Add New ${activeTab === 'need' ? 'Necessity' : 'Wish'}`}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">What is it?</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="e.g. Rent, iPhone 15" 
                            className="input input-bordered w-full" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
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
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                required
                            />
                        </div>
                        {/* Only show Saved input when adding new item, or make it readonly/separate action for clarity? 
                            For now, let's keep it editable but maybe we should rely on the main UI for updates. 
                            Actually, editing price might affect saved ratio, so let's allow editing 'saved' here too carefully or just disable it.
                            Let's keep it consistent with Add: allow editing.
                        */}
                        <div className="form-control w-1/2">
                            <label className="label">
                                <span className="label-text">Saved Already (₱)</span>
                            </label>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                className="input input-bordered w-full" 
                                value={formData.saved}
                                onChange={e => setFormData({...formData, saved: e.target.value})}
                                // If editing, maybe we shouldn't easily change saved amount here to avoid conflict with wallet? 
                                // Let's allow it but handle logic in parent.
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
                                value={formData.priority}
                                onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
                            >
                                <option value="high">🔥 High Priority</option>
                                <option value="medium">⚡ Medium Priority</option>
                                <option value="low">🌱 Low Priority</option>
                            </select>
                        </div>
                    )}
                    
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{itemToEdit ? 'Save Changes' : 'Add Item'}</button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};
