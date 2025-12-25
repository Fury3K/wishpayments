'use client';

import { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Detects if device is on iOS 
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        
        // Detects if device is in standalone mode
        const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
        
        // Check if user has already dismissed the prompt
        const hasDismissed = localStorage.getItem('installPromptDismissed');

        setIsIOS(isIosDevice);
        setIsStandalone(isInStandaloneMode);

        if (isIosDevice && !isInStandaloneMode && !hasDismissed) {
            setShowPrompt(true);
        }
    }, []);

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('installPromptDismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 bg-white/90 backdrop-blur-md border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl p-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <button 
                onClick={handleDismiss} 
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
            >
                <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-4 pr-6">
                <div className="bg-gray-100 rounded-xl p-2 shrink-0">
                    <img src="/icon.png" alt="App Icon" className="w-10 h-10 rounded-lg shadow-sm" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Install WishPay</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Install this application on your home screen for quick and easy access.
                    </p>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                    Just tap <Share className="w-4 h-4 text-blue-500" /> then <span className="font-semibold text-gray-700">"Add to Home Screen"</span> <PlusSquare className="w-4 h-4 text-gray-600" />
                </span>
            </div>
            {/* Triangle pointer pointing down to the share button area on generic iOS Safari UI usually at bottom */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-200 hidden sm:block"></div>
        </div>
    );
}