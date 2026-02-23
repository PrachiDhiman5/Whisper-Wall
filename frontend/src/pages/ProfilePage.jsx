import React, { useState, useEffect } from 'react';
import { getMyPosts, getStats, deleteConfession } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SecretCodeModal from '../components/SecretCodeModal';
import ConfessionSheet from './ConfessionSheet';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, logout, refreshVersion, triggerRefresh } = useAuth();
    const { addToast } = useToast();
    const [myPosts, setMyPosts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Public');

    // Modals state
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        loadData();
    }, [refreshVersion]);

    const loadData = async () => {
        try {
            const [postsRes, statsRes] = await Promise.all([getMyPosts(), getStats()]);
            setMyPosts(postsRes.data.confessions);
            setStats(statsRes.data.stats);
        } catch (error) {
            addToast("Couldn't retrieve your profile data.", "error");
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (post) => {
        setSelectedPost(post);
        setIsCodeModalOpen(true);
    };

    const openEditModal = (post) => {
        setSelectedPost(post);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (secretCode) => {
        if (!selectedPost) return;
        try {
            await deleteConfession(selectedPost._id, secretCode);
            addToast("Whisper permanently removed.", "success");
            setIsCodeModalOpen(false);
            loadData();
        } catch (error) {
            addToast("Delete failed. Check your secret code.", "error");
        }
    };

    const filteredPosts = myPosts.filter(p =>
        activeTab === 'Public' ? !p.isDraft : p.isDraft
    );

    if (loading) return (
        <div className="container flex-center" style={{ padding: '100px' }}>
            <div className="loader-spinner"></div>
        </div>
    );

    return (
        <div className="profile-page container fade-in">
            <div className="profile-hero glass">
                <div className="profile-info">
                    <div className="avatar-large">
                        <img src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`} alt="avatar" />
                    </div>
                    <div className="user-details">
                        <h2>{user?.name || "User"}</h2>
                        <div className="anon-identity">
                            <span className="anon-label">Anonymous Identity:</span>
                            <span className="anon-value">{user?.anonymousId || "#0000000"}</span>
                        </div>
                        <p className="email">{user?.email || ""}</p>
                        <div className="quick-stats">
                            <div className="stat">
                                <span className="stat-val">{stats?.totalPosts || 0}</span>
                                <span className="stat-name">Confessions</span>
                            </div>
                            <div className="stat">
                                <span className="stat-val">{(stats?.totalLove || 0) + (stats?.totalLaugh || 0) + (stats?.totalLikes || 0)}</span>
                                <span className="stat-name">Total Reactions</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="btn-secondary-white" onClick={logout}>Logout</button>
            </div>

            <div className="profile-content">
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'Public' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Public')}
                    >
                        👁️ Public
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'Drafts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Drafts')}
                    >
                        📝 Drafts
                    </button>
                </div>

                <div className="my-posts-list">
                    {filteredPosts.length === 0 ? (
                        <div className="empty-profile">
                            <p>No {activeTab.toLowerCase()} whispers found.</p>
                        </div>
                    ) : (
                        filteredPosts.map((post) => (
                            <div key={post._id} className="my-post-card glass">
                                <div className="post-header">
                                    <span className={`category-tag cat-${post.category ? post.category.toLowerCase() : 'other'}`}>
                                        {post.category}
                                    </span>
                                    <div className="post-actions">
                                        <button className="action-icn-btn" onClick={() => openEditModal(post)} title="Edit">
                                            ✏️
                                        </button>
                                        <button className="action-icn-btn" onClick={() => openDeleteModal(post)} title="Delete">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <p className="whisper-text">"{post.text}"</p>
                                <div className="post-footer">
                                    <div className="post-stats">
                                        <span>❤️ {post.reactions.love}</span>
                                        <span>😂 {post.reactions.laugh}</span>
                                        <span>👍 {post.reactions.like}</span>
                                    </div>
                                    <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Verification Modal for Deletion */}
            <SecretCodeModal
                isOpen={isCodeModalOpen}
                onClose={() => setIsCodeModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Whisper"
                actionLabel="Confirm Delete"
            />

            {/* Edit Modal (reuses ConfessionSheet) */}
            <ConfessionSheet
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onRefresh={triggerRefresh}
                editMode={true}
                editData={selectedPost}
            />
        </div>
    );
};

export default ProfilePage;
