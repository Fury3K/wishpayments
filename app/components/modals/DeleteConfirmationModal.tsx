interface DeleteConfirmationModalProps {
    isOpen: boolean;
    itemName: string;
    onBought: () => void;
    onRemove: () => void;
    onCancel: () => void;
}

export const DeleteConfirmationModal = ({
    isOpen,
    itemName,
    onBought,
    onRemove,
    onCancel
}: DeleteConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle z-50">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Remove {itemName}?</h3>
                <p className="py-4">Did you already buy this item?</p>
                <div className="modal-action flex-col gap-2 sm:flex-row">
                    <button className="btn btn-success text-white w-full sm:w-auto" onClick={onBought}>Yes, I bought it! 🎉</button>
                    <button className="btn btn-warning w-full sm:w-auto" onClick={onRemove}>No, just remove it</button>
                    <button className="btn btn-ghost w-full sm:w-auto" onClick={onCancel}>Cancel</button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onCancel}></div>
        </div>
    );
};
