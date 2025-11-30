interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmationModal = ({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel"
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle z-50">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <button className="btn" onClick={onCancel}>{cancelText}</button>
                    <button className="btn btn-primary" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onCancel}></div>
        </div>
    );
};
