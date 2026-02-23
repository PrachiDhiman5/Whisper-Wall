import React, { useState, useEffect } from 'react';
import { fetchConfessions, addReaction } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Feed.css';

const categories = ['All', 'Funny', 'Sad', 'Happy', 'Angry', 'Secret', 'Crush'];

const Feed = () => {
    const { user, refreshVersion } = useAuth();
    const [confessions, setConfessions] = useState([]);
    const [filteredConfessions, setFilteredConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useToast();

    useEffect(() => {
        loadConfessions();
    }, [refreshVersion]);

    useEffect(() => {
        filterConfessions();
    }, [activeCategory, searchQuery, confessions]);

    const loadConfessions = async () => {
        try {
            const response = await fetchConfessions();
            setConfessions(response.data.confessions);
        } catch (error) {
            addToast("Failed to load the wall.", "error");
        } finally {
            setLoading(false);
        }
    };

    const filterConfessions = () => {
        let filtered = [...confessions];

        if (activeCategory !== 'All') {
            filtered = filtered.filter(c => c.category && c.category.toLowerCase() === activeCategory.toLowerCase());
        }

        if (searchQuery) {
            filtered = filtered.filter(c =>
                c.text.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredConfessions(filtered);
    };

    const handleReact = async (id, type) => {
        try {
            const response = await addReaction(id, type);
            setConfessions(confessions.map(c =>
                c._id === id ? { ...c, reactions: response.data.reactions } : c
            ));
            addToast(`Whisper liked!`, "success");
        } catch (error) {
            addToast("Couldn't add reaction.", "error");
        }
    };

    if (loading) return (
        <div className="container flex-center" style={{ padding: '100px' }}>
            <div className="loader-spinner"></div>
        </div>
    );

    return (
        <div className="feed container fade-in">
            <header className="feed-header-alt">
                <div className="header-top">
                    <div className="title-group">
                        <h1>The Wall <span className="moon-icon">🌙</span></h1>
                        <p className="subtitle">{confessions.length} whispers floating around</p>
                    </div>
                </div>

                <div className="feed-controls">
                    <div className="category-bar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="search-box glass">
                        <svg viewBox="0 0 24 24" width="18" height="18" className="search-icon">
                            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Find a whisper..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="confession-grid">
                {filteredConfessions.length === 0 ? (
                    <div className="empty-wall container">
                        <div className="moon-large">🌙</div>
                        <h3>No confessions yet...</h3>
                        <p>Be the first to whisper something.</p>
                    </div>
                ) : (
                    filteredConfessions.map((post) => (
                        <div key={post._id} className="confession-card glass">
                            <div className="card-header">
                                <div className="card-header-meta">
                                    <span className={`category-tag cat-${post.category ? post.category.toLowerCase() : 'other'}`}>
                                        {post.category}
                                    </span>
                                    {user && post.userId?._id === user.id && (
                                        <span className="user-badge">You</span>
                                    )}
                                </div>
                                <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="whisper-text">"{post.text}"</p>
                            <div className="card-footer">
                                <span className="author-id">{post.userId?.anonymousId || "#0000000"}</span>
                                <div className="reaction-group">
                                    <button className="reaction-btn" onClick={() => handleReact(post._id, 'love')}>
                                        <span className="icon">❤️</span>
                                        <span className="count">{post.reactions.love}</span>
                                    </button>
                                    <button className="reaction-btn" onClick={() => handleReact(post._id, 'laugh')}>
                                        <span className="icon">😂</span>
                                        <span className="count">{post.reactions.laugh}</span>
                                    </button>
                                    <button className="reaction-btn" onClick={() => handleReact(post._id, 'like')}>
                                        <span className="icon">👍</span>
                                        <span className="count">{post.reactions.like}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Feed;
