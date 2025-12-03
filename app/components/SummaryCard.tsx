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
        <div className="card bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl overflow-hidden relative border border-white/10 h-full">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 -mt-10 -ml-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

            <div className="card-body relative z-10 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-4">
                        {activeTab === 'need' ? 'Essentials Funding' : 'Wishlist Progress'}
                    </h2>

                    <div className="flex flex-col gap-1 mb-6">
                        <span className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
                            {formatPHP(totalSaved)}
                        </span>
                        <span className="text-sm font-medium opacity-70">
                            of {formatPHP(totalCost)} target
                        </span>
                    </div>
                </div>

                <div>
                    <div className="relative h-4 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-xs mt-3 font-semibold tracking-wide opacity-90">
                        <span className="bg-black/10 px-2 py-1 rounded-md backdrop-blur-sm">{count} Items</span>
                        <span className="bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm">{progress.toFixed(1)}% Funded</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
