import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Item } from '../types';

interface ItemCardProps {
    item: Item;
    onDelete: (id: number) => void;
    onUpdateSaved: (id: number, amount: number) => void;
    onQuickAdd: (id: number, amount: number) => void;
}

export const ItemCard = ({ item, onDelete, onUpdateSaved, onQuickAdd }: ItemCardProps) => {
    const progress = item.price > 0 ? (item.saved / item.price) * 100 : 0;
    const remaining = item.price - item.saved;
    const isCompleted = progress >= 100;

    const [editMode, setEditMode] = useState(false);
    const [localSaved, setLocalSaved] = useState(item.saved.toString());

    const handleSave = () => {
        onUpdateSaved(item.id, parseFloat(localSaved));
        setEditMode(false);
    };

    const formatPHP = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className={`card bg-base-100 shadow-md border-l-4 ${isCompleted ? 'border-success' : item.priority === 'high' ? 'border-error' : 'border-primary'}`}>
            <div className="card-body p-4 sm:p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`font-bold text-lg ${isCompleted ? 'line-through opacity-50' : ''}`}>{item.name}</h3>
                        {item.type === 'need' && (
                             <div className="badge badge-ghost badge-sm mt-1 uppercase text-xs">{item.priority}</div>
                        )}
                    </div>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-xs btn-circle text-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                            <li><button onClick={() => onDelete(item.id)} className="text-error">Delete</button></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Saved: <span className="font-semibold text-base-content">{formatPHP(item.saved)}</span></span>
                        <span className="font-bold">{formatPHP(item.price)}</span>
                    </div>
                    <progress 
                        className={`progress w-full h-2 ${isCompleted ? 'progress-success' : 'progress-primary'}`} 
                        value={progress} 
                        max="100">
                    </progress>
                    <div className="text-xs text-right mt-1 text-gray-400">
                        {isCompleted ? 'Fully Funded!' : `${formatPHP(remaining)} to go`}
                    </div>
                </div>

                {/* Actions */}
                {!isCompleted && (
                    <div className="card-actions justify-end mt-2 pt-2 border-t border-base-200">
                        {editMode ? (
                            <div className="join w-full">
                                <input 
                                    className="input input-sm input-bordered join-item w-full" 
                                    type="number" 
                                    value={localSaved}
                                    onChange={(e) => setLocalSaved(e.target.value)}
                                />
                                <button className="btn btn-sm btn-success join-item" onClick={handleSave}>Save</button>
                                <button className="btn btn-sm btn-ghost join-item" onClick={() => setEditMode(false)}>✕</button>
                            </div>
                        ) : (
                            <div className="flex gap-2 w-full">
                                <button 
                                    className="btn btn-sm btn-outline flex-1 normal-case" 
                                    onClick={() => setEditMode(true)}
                                >
                                    Update Amount
                                </button>
                                <button 
                                    className="btn btn-sm btn-primary flex-none"
                                    onClick={() => onQuickAdd(item.id, 500)}
                                    title="Quick Add ₱500"
                                >
                                    + ₱500
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {isCompleted && (
                     <div className="mt-2 text-center p-2 bg-success/10 rounded-lg text-success text-sm font-bold flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Ready to Buy
                    </div>
                )}
            </div>
        </div>
    );
};
