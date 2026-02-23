import React, { useState } from 'react';
import Modal from './Modal';
import './SecretCodeModal.css';

const SecretCodeModal = ({ isOpen, onClose, onConfirm, title, actionLabel }) => {
    const [secretCode, setSecretCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(secretCode);
        setSecretCode('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title || "Verification Required"}
            subtitle="Please enter your secret code to continue 🔒"
        >
            <form onSubmit={handleSubmit} className="secret-code-form">
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Enter secret code"
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                        required
                        autoFocus
                        className="aesthetic-input"
                    />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={!secretCode}>
                        {actionLabel || "Confirm"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SecretCodeModal;
