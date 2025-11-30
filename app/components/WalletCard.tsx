import { useState } from 'react';
import { Wallet } from 'lucide-react';

interface WalletCardProps {
    balance: number;
    onCashIn: () => void;
    onCashOut: () => void;
}

export const WalletCard = ({ balance, onCashIn, onCashOut }: WalletCardProps) => {
    return (
        <div className="card bg-primary text-primary-content shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-sm opacity-90 uppercase tracking-wider">My Wallet</h2>
                <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">
                        {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(balance)}
                    </span>
                </div>
                <div className="card-actions justify-end mt-4">
                    <button className="btn btn-secondary flex-1" onClick={onCashIn}>+ Cash In</button>
                    <button className="btn btn-outline btn-secondary bg-base-100/20 border-0 text-white hover:bg-base-100/30 flex-1" onClick={onCashOut}>- Remove</button>
                </div>
            </div>
        </div>
    );
};
