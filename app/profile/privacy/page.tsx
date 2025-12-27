'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Ban, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { ConfirmationModal } from '@/app/components/modals/ConfirmationModal';

export default function PrivacyPage() {
    const router = useRouter();
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDisable = () => {
         // Placeholder for disable logic
         toast('This feature is coming soon!', {
             icon: '🚧',
         });
         setShowDisableModal(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await api.delete('/api/user/delete');
            localStorage.removeItem('token');
            toast.success('Account deleted successfully');
            router.push('/');
        } catch (error: any) {
             toast.error(error.response?.data?.message || 'Failed to delete account');
             setIsDeleting(false); // Only reset if failed
        }
    };

    return (
        <div className="bg-[#F3F4F6] font-sans text-[#1A1B2D] antialiased min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] relative flex flex-col">
            {/* Header */}
            <header className="flex items-center gap-4 px-6 py-6 sticky top-0 bg-[#F3F4F6] z-10">
                <Link href="/profile" className="p-2 -ml-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold text-[#1A1B2D]">Privacy & Data</h1>
            </header>

            <main className="px-6 flex-1 space-y-6">
                
                {/* Info Text */}
                <p className="text-gray-500 text-sm leading-relaxed">
                    Manage your account status and data privacy. Please note that some actions are irreversible.
                </p>

                {/* Disable Account Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0 text-yellow-600">
                            <Ban className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1A1B2D]">Disable Account</h3>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                Temporarily deactivate your account. Your data will be preserved, but you won't appear in searches or receive notifications.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowDisableModal(true)}
                        className="w-full py-3 rounded-xl bg-yellow-50 text-yellow-700 font-bold text-sm hover:bg-yellow-100 transition-colors"
                    >
                        Disable Account
                    </button>
                </div>

                {/* Delete Account Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-600">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1A1B2D]">Delete Account</h3>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                Permanently remove your account and all associated data (Goals, Transactions, Bank Accounts). <span className="font-bold text-red-500">This cannot be undone.</span>
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-500/20 transition-colors"
                    >
                        Delete Permanently
                    </button>
                </div>

                {/* Public Instructions Link */}
                <div className="flex justify-center pt-4">
                    <Link href="/account-deletion" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
                        View Public Data Deletion Instructions <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>

            </main>

            {/* Modals */}
            <ConfirmationModal
                isOpen={showDisableModal}
                title="Disable Account?"
                message="Are you sure you want to disable your account? You can reactivate it anytime by logging in."
                onConfirm={handleDisable}
                onCancel={() => setShowDisableModal(false)}
                confirmText="Disable Account"
                variant="primary" // Keeping it neutral/primary as it's reversible
            />

             <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Account Permanently?"
                message="This action is irreversible. All your data including goals, history, and bank accounts will be permanently erased. Are you absolutely sure?"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
                confirmText={isDeleting ? "Deleting..." : "Yes, Delete Everything"}
                variant="danger"
            />
        </div>
    );
}
