import React, { useState, useEffect } from 'react';
import { createConfession, updateConfession } from '../services/api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import './ConfessionSheet.css';

const categories = ['Funny', 'Sad', 'Happy', 'Angry', 'Secret', 'Crush'];

const ConfessionSheet = ({ isOpen, onClose, onRefresh, editMode = false, editData = null }) => {
    const [text, setText] = useState('');
    const [category, setCategory] = useState('Secret');
    const [secretCode, setSecretCode] = useState('');
    const [isDraft, setIsDraft] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (editMode && editData) {
            setText(editData.text || '');
            setCategory(editData.category || 'Secret');
            setIsDraft(editData.isDraft || false);
            setSecretCode(''); // Always ask for code, don't pre-fill it for security
        } else if (!isOpen) {
            // Reset when closing or not in edit mode
            setText('');
            setCategory('Secret');
            setSecretCode('');
            setIsDraft(false);
        }
    }, [editMode, editData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text || !secretCode) return addToast("Please enter a whisper and your secret code.", "error");

        setIsSubmitting(true);
        try {
            if (editMode && editData) {
                await updateConfession(editData._id, { text, category, secretCode, isDraft });
                addToast("Whisper updated successfully!", "success");
            } else {
                await createConfession({ text, category, secretCode, isDraft });
                addToast(isDraft ? "Whisper saved as draft." : "Your whisper has been shared!", "success");
            }

            if (onRefresh) onRefresh();
            onClose();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Action failed. Please check your secret code.";
            addToast(errorMsg, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editMode ? "Edit your Whisper" : "Share a Confession"}
            subtitle={editMode ? "Modify your secret story..." : "Anonymous • honest • yours 🌙"}
        >
            <form onSubmit={handleSubmit} className="confession-form">
                <div className="form-group">
                    <textarea
                        placeholder="What's on your mind? Let it out..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={500}
                        required
                        className="aesthetic-textarea"
                    />
                </div>

                <div className="category-selector">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            className={`tag-choice ${category === cat ? 'active' : ''}`}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="form-group icon-input">
                    <span className="input-icon">🔒</span>
                    <input
                        type="text"
                        placeholder={editMode ? "Enter secret code to authorize update" : "Secret code (min 4 chars) — for later edits"}
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                        required
                    />
                </div>

                <div className="form-footer">
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={isDraft}
                            onChange={(e) => setIsDraft(e.target.checked)}
                        />
                        <span className="slider round"></span>
                        <span className="toggle-label">Save as Draft</span>
                    </label>

                    <button type="submit" className="btn-post" disabled={isSubmitting}>
                        {isSubmitting ? 'Whispering...' : (editMode ? 'Update Whisper' : 'Post Confession')}
                        {!isSubmitting && <span className="btn-icon">🚀</span>}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ConfessionSheet;
