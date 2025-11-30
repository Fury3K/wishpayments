import { ItemType } from '../types';

interface SummaryCardProps {
    activeTab: ItemType;
    totalSaved: number;
    totalCost: number;
    progress: number;
    count: number;
}

export const SummaryCard = ({ activeTab, totalSaved, totalCost, progress, count }: SummaryCardProps) => {
    const formatPHP = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
            <div className="card-body p-6">
                <h2 className="card-title text-sm opacity-90 uppercase tracking-wide">
                    {activeTab === 'need' ? 'Essentials Funding' : 'Wishlist Progress'}
                </h2>
                <div className="flex flex-col gap-1 my-2">
                    <span className="text-4xl font-bold tracking-tight">
                        {formatPHP(totalSaved)}
                    </span>
                    <span className="text-sm opacity-80">
                        of {formatPHP(totalCost)} target
                    </span>
                </div>
                <progress 
                    className="progress progress-warning w-full bg-white/20 h-3" 
                    value={progress} 
                    max="100">
                </progress>
                <div className="flex justify-between text-xs mt-1 font-medium">
                    <span>{count} Items</span>
                    <span>{progress.toFixed(1)}% Funded</span>
                </div>
            </div>
        </div>
    );
};
