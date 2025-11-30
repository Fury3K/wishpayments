import { useState } from 'react';
import { Wallet } from 'lucide-react';

interface WalletCardProps {
    balance: number;
    onCashIn: () => void;
}

export const WalletCard = ({ balance, onCashIn }: WalletCardProps) => {
    const formatPHP = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="stats shadow w-full bg-base-100 border border-base-200">
            <div className="stat">
                <div className="stat-figure text-secondary">
                    <Wallet className="w-8 h-8 stroke-current" />
                </div>
                <div className="stat-title">Your Wallet</div>
                <div className="stat-value text-primary text-2xl md:text-3xl">{formatPHP(balance)}</div>
                <div className="stat-actions">
                    <button className="btn btn-sm btn-success text-white" onClick={onCashIn}>+ Add Funds</button>
                </div>
            </div>
        </div>
    );
};
