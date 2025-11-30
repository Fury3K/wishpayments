import { useState } from 'react';

interface CashInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
}

export const CashInModal = ({ isOpen, onClose, onConfirm }: CashInModalProps) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;
        onConfirm(parseFloat(amount));
        setAmount('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Add Funds to Wallet</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Amount to Cash In (₱)</span>
                        </label>
                        <input 
                            type="number" 
                            placeholder="0.00" 
                            className="input input-bordered w-full" 
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            autoFocus
                            min="1"
                            required
                        />
                    </div>
                    
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-success text-white">Cash In</button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};
