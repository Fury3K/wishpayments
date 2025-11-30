import { useState, useEffect } from 'react';

interface CashOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
    currentBalance: number;
}

export const CashOutModal = ({ isOpen, onClose, onConfirm, currentBalance }: CashOutModalProps) => {
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (isOpen) setAmount('');
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(amount);
        if (val > 0 && val <= currentBalance) {
            onConfirm(val);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Remove Funds</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Amount to remove (₱)</span>
                        </label>
                        <input 
                            type="number" 
                            placeholder="0.00" 
                            className="input input-bordered w-full" 
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            max={currentBalance}
                            min="0.01"
                            step="0.01"
                            autoFocus
                            required
                        />
                        <label className="label">
                            <span className="label-text-alt text-error">{parseFloat(amount) > currentBalance ? "Insufficient balance" : ""}</span>
                        </label>
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button 
                            type="submit" 
                            className="btn btn-error"
                            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance}
                        >
                            Remove
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};