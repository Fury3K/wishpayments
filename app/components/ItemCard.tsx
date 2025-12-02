import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Item } from '../types';

interface ItemCardProps {
    item: Item;
    onDelete: (id: number) => void;
    onUpdateSaved: (id: number, amount: number) => void;
    onQuickAdd: (id: number, amount: number) => void;
    onEdit: (item: Item) => void;
    onComplete: (item: Item) => void;
}

export const ItemCard = ({ item, onDelete, onUpdateSaved, onQuickAdd, onEdit, onComplete }: ItemCardProps) => {
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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-rose-500 bg-rose-50 border-rose-200';
            case 'medium': return 'text-amber-500 bg-amber-50 border-amber-200';
            case 'low': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
            default: return 'text-gray-500 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className={`card bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group ${isCompleted ? 'opacity-90' : ''}`}>
            <div className="card-body p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-bold text-lg truncate ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {item.name}
                            </h3>
                            {item.type === 'need' && (
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(item.priority)}`}>
                                    {item.priority}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                            Added {new Date(item.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    </div>

                    <div className="dropdown dropdown-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <label tabIndex={0} className="btn btn-ghost btn-xs btn-circle text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-xl w-32 border border-gray-100 text-sm">
                            <li><button onClick={() => onEdit(item)} className="hover:bg-gray-50 rounded-lg">Edit</button></li>
                            <li><button onClick={() => onDelete(item.id)} className="text-rose-500 hover:bg-rose-50 rounded-lg">Delete</button></li>
                        </ul>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Saved</span>
                            <span className="text-xl font-bold text-gray-800">{formatPHP(item.saved)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Target</span>
                            <span className="text-sm font-semibold text-gray-600">{formatPHP(item.price)}</span>
                        </div>
                    </div>

                    <div className="relative h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'}`}
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        ></div>
                    </div>

                    <div className="text-xs text-right font-medium text-gray-400">
                        {isCompleted ? (
                            <span className="text-emerald-600 flex items-center justify-end gap-1">
                                <CheckCircle className="w-3 h-3" /> Fully Funded
                            </span>
                        ) : (
                            <span>{formatPHP(remaining)} to go</span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {!isCompleted && (
                    <div className="mt-5 pt-4 border-t border-gray-50">
                        {editMode ? (
                            <div className="join w-full shadow-sm">
                                <input
                                    className="input input-sm input-bordered join-item w-full focus:outline-none focus:border-violet-500"
                                    type="number"
                                    min="0"
                                    value={localSaved}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (parseFloat(val) < 0) return;
                                        setLocalSaved(val);
                                    }}
                                />
                                <button className="btn btn-sm btn-primary join-item text-white border-none bg-violet-600 hover:bg-violet-700" onClick={handleSave}>Save</button>
                                <button className="btn btn-sm btn-ghost join-item" onClick={() => setEditMode(false)}>✕</button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-4 gap-2">
                                    {[100, 200, 500, 1000].map((amount) => (
                                        <button
                                            key={amount}
                                            className="btn btn-xs h-8 bg-violet-50 hover:bg-violet-100 text-violet-700 border-none rounded-lg font-semibold transition-colors"
                                            onClick={() => onQuickAdd(item.id, amount)}
                                            title={`Add ₱${amount}`}
                                        >
                                            +{amount >= 1000 ? `${amount / 1000}k` : amount}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className="btn btn-sm btn-ghost w-full text-gray-500 hover:text-violet-600 hover:bg-violet-50 normal-case font-medium"
                                    onClick={() => setEditMode(true)}
                                >
                                    Update Custom Amount
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {isCompleted && (
                    <button
                        className="btn btn-success w-full mt-4 gap-2 font-bold text-white border-none shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5 transition-all"
                        onClick={() => onComplete(item)}
                    >
                        <CheckCircle className="w-5 h-5" /> Complete Goal
                    </button>
                )}
            </div>
        </div>
    );
};
