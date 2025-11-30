import { PiggyBank } from 'lucide-react';

export const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl text-primary gap-2">
                <PiggyBank className="w-5 h-5" /> WishPay
            </a>
        </div>
        <div className="flex-none">
            <button className="btn btn-square btn-ghost">
                <div className="avatar placeholder">
                    <div className="bg-neutral/20 text-neutral-content rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-xs font-bold text-neutral">ME</span>
                    </div>
                </div> 
            </button>
        </div>
    </div>
  );
};
