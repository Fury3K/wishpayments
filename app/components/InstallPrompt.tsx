'use client';

import { useState, useEffect } from 'react';
import { MoreHorizontal, Share, PlusSquare, X } from 'lucide-react';

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS26OrNewer, setIsIOS26OrNewer] = useState(false);

    useEffect(() => {
        // Advanced iOS detection (including iPadOS 13+ requesting desktop site)
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = 
            /iphone|ipad|ipod/.test(userAgent) || 
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        // Detect iOS Version
        const match = userAgent.match(/os (\d+)_/);
        const version = match ? parseInt(match[1], 10) : 0;
        
        // Also check for specific marker if user agent spoofing isn't enough (future proofing/testing)
        // or if explicitly >= 26
        const isNewer = version >= 26;

        // Modern standalone detection
        const isStandaloneMode = 
            ('standalone' in window.navigator && (window.navigator as any).standalone) ||
            window.matchMedia('(display-mode: standalone)').matches;
        
        // Check if user has already dismissed the prompt
        const hasDismissed = localStorage.getItem('installPromptDismissed');

        setIsIOS(isIosDevice);
        setIsStandalone(isStandaloneMode);
        setIsIOS26OrNewer(isNewer);

        // Show prompt only on iOS, not in standalone mode, and not dismissed
        if (isIosDevice && !isStandaloneMode && !hasDismissed) {
            // Small delay to not annoy user immediately on load
            const timer = setTimeout(() => setShowPrompt(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('installPromptDismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl p-4 animate-in slide-in-from-bottom-10 fade-in duration-500 ring-1 ring-black/5">
            <button 
                onClick={handleDismiss} 
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Dismiss install prompt"
            >
                <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-4 pr-6">
                <div className="bg-white rounded-xl p-0.5 shadow-sm shrink-0 border border-gray-100">
                    <img src="/icon.png" alt="WishPay Icon" className="w-11 h-11 rounded-[10px]" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Install WishPay</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Add to Home Screen for the best experience.
                    </p>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2 flex-wrap">
                    <span>Tap</span>
                    {isIOS26OrNewer ? (
                        <MoreHorizontal className="w-5 h-5 text-gray-700 bg-gray-100 rounded-full p-0.5" />
                    ) : (
                        <Share className="w-4 h-4 text-[#007AFF]" />
                    )}
                    <span>then</span>
                    <span className="flex items-center gap-1 text-gray-900 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                        Add to Home Screen <PlusSquare className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
            {/* Triangle pointer for Safari's bottom bar */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-b border-r border-white/20 shadow-sm hidden sm:block"></div>
        </div>
    );
}