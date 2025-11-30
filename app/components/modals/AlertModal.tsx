interface AlertModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

export const AlertModal = ({ isOpen, message, onClose }: AlertModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle z-50">
            <div className="modal-box">
                <h3 className="font-bold text-lg text-error">Oops!</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <button className="btn" onClick={onClose}>Okay</button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};
