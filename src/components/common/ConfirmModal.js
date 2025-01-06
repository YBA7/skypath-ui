import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Onay</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="cancel-button">
                        İptal
                    </button>
                    <button onClick={onConfirm} className="confirm-button">
                        Evet, Sil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal; 