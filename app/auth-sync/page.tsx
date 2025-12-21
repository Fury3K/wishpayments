'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

function AuthSyncContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            toast.error(decodeURIComponent(error));
            router.push('/login');
            return;
        }

        if (token) {
            localStorage.setItem('token', token);
            toast.success('Successfully logged in!');
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }, [router, searchParams]);

    return (
        <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
            <p className="text-gray-500 font-medium">Finishing login...</p>
        </div>
    );
}

export default function AuthSyncPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Suspense fallback={<div className="flex flex-col items-center gap-4"><span className="loading loading-spinner loading-lg text-blue-600"></span></div>}>
                <AuthSyncContent />
            </Suspense>
        </div>
    );
}