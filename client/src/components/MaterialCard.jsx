import { useState, useContext } from 'react';
import { Download, Heart, MessageCircle, FileText } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const MaterialCard = ({ material }) => {
    const { user } = useContext(AuthContext);
    const [likes, setLikes] = useState(material.likes?.length || 0);
    const [liked, setLiked] = useState(user && material.likes ? material.likes.includes(user._id) : false);

    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [commentsList, setCommentsList] = useState(material.comments || []);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if(!user) return alert("You need to be logged in to comment.");
        if (!commentText.trim()) return;

        try {
            const res = await api.post(`/materials/${material._id}/comment`, { text: commentText });
            setCommentsList(res.data.comments);
            setCommentText('');
        } catch (error) {
            console.error('Comment failed', error);
            alert("Comment submission failed.");
        }
    };

    const handleLike = async () => {
        try {
            const res = await api.post(`/materials/${material._id}/like`);
            setLikes(res.data.likes.length);
            setLiked(!liked);
        } catch (error) {
            console.error('Like failed', error);
            alert("You need to be logged in to like.");
        }
    };

    return (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s ease' }} 
             onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            
            <div className="flex-between">
                <span style={{ fontSize: '0.8rem', background: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>{material.subject}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sem {material.semester}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText color="var(--accent)" size={24} />
                <h3 style={{ fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{material.title}</h3>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flexGrow: 1 }}>{material.description}</p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {material.tags && material.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>#{tag}</span>
                ))}
            </div>

            <div className="flex-between" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleLike} style={{ background: 'none', border: 'none', color: liked ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Heart size={18} fill={liked ? "#ef4444" : "none"} /> {likes}
                    </button>
                    <button onClick={() => setShowComments(!showComments)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MessageCircle size={18} /> {commentsList.length}
                    </button>
                </div>
                
                <a href={`http://localhost:5000${material.fileUrl}`} download target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                    <Download size={16} /> Get
                </a>
            </div>

            {showComments && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}>
                        {commentsList.length > 0 ? commentsList.map((c, i) => (
                            <div key={i} style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <strong style={{ color: 'var(--accent)' }}>{c.user?.username || 'Unknown'}:</strong> <span style={{ color: 'var(--text-main)' }}>{c.text}</span>
                            </div>
                        )) : <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No comments yet. Be the first!</p>}
                    </div>
                    {user ? (
                        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="text" 
                                value={commentText} 
                                onChange={(e) => setCommentText(e.target.value)} 
                                placeholder="Write a comment..." 
                                className="input-field" 
                                style={{ padding: '0.4rem 0.8rem', marginTop: 0, fontSize: '0.85rem', flex: 1 }} 
                            />
                            <button type="submit" className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Post</button>
                        </form>
                    ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>Login to post a comment</p>
                    )}
                </div>
            )}
            
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>By: {material.uploader?.username || 'Unknown'}</span>
        </div>
    );
};

export default MaterialCard;
