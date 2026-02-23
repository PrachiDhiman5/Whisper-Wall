import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, subtitle, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <div className="modal-header">
                    <h2>{title}</h2>
                    {subtitle && <p className="modal-subtitle">{subtitle}</p>}
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
