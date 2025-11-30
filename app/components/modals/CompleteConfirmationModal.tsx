import { CheckCircle } from 'lucide-react';

interface CompleteConfirmationModalProps {
    isOpen: boolean;
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const CompleteConfirmationModal = ({ isOpen, itemName, onConfirm, onCancel }: CompleteConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box text-center">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Complete!</h3>
                <p className="py-4">Did you already buy <span className="font-bold">{itemName}</span>?</p>
                <div className="modal-action justify-center">
                    <button className="btn btn-ghost" onClick={onCancel}>No, not yet</button>
                    <button className="btn btn-success gap-2" onClick={onConfirm}>
                        Yes, I bought it!
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onCancel}></div>
        </div>
    );
};