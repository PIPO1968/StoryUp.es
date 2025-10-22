import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie } from '../cookieUtils';

export default function StoryDetailPage({ usuario }) {
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [comment, setComment] = useState("");
    const [likeLoading, setLikeLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const API_URL = 'https://storyup-backend.onrender.com/api';
                const res = await fetch(`${API_URL}/stories/${id}`);
                if (!res.ok) throw new Error("No se pudo cargar la historia");
                const data = await res.json();
                setStory(data);
            } catch (err) {
                setError("No se pudo cargar la historia");
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, [id]);

    const handleLike = async () => {
        if (!usuario) return;
        setLikeLoading(true);
        try {
            const API_URL = 'https://storyup-backend.onrender.com/api';
            const res = await fetch(`${API_URL}/stories/${id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: usuario._id })
            });
            if (!res.ok) throw new Error('No se pudo dar like');
            const data = await res.json();
            setStory(s => ({ ...s, likes: data.likes, likedBy: [...(s.likedBy || []), usuario._id] }));
        } catch {
            setError('No se pudo dar like');
        } finally {
            setLikeLoading(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!usuario || !comment.trim()) return;
        setCommentLoading(true);
        try {
            const API_URL = 'https://storyup-backend.onrender.com/api';
            const token = usuario?.token || (typeof getCookie === 'function' ? getCookie('token') : '');
            const res = await fetch(`${API_URL}/stories/${id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ text: comment })
            });
            if (!res.ok) throw new Error('No se pudo comentar');
            const data = await res.json();
            setStory(s => ({ ...s, comments: data }));
            setComment("");
        } catch {
            setError('No se pudo comentar');
        } finally {
            setCommentLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Cargando historia...</div>;
    if (error) return <div style={{ color: '#e57373', textAlign: 'center', marginTop: 40 }}>{error}</div>;
    if (!story) return null;

    return (
        <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #ffe06633', padding: '2.5rem 2.5rem', minWidth: 340 }}>
            <h1 style={{ color: '#e6b800', fontSize: 32, marginBottom: 12 }}>{story.title}</h1>
            <div style={{ fontSize: 16, color: '#888', marginBottom: 18 }}>
                <span>👤 {story.anonimo ? 'Anonimo' : (story.author?.username || story.author?.name || 'Autor desconocido')}</span>
                <span style={{ marginLeft: 12 }}>{new Date(story.createdAt).toLocaleDateString()}</span>
                <span style={{ marginLeft: 12 }}>❤️ {story.likes || 0}</span>
            </div>
            <div style={{ fontSize: 18, marginBottom: 24 }}>{story.content}</div>
            <button onClick={handleLike} disabled={likeLoading || (story.likedBy || []).includes(usuario?._id)} style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 8, padding: '0 24px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', marginBottom: 18 }}>
                {likeLoading ? 'Enviando...' : ((story.likedBy || []).includes(usuario?._id) ? 'Ya te gusta' : 'Me gusta')}
            </button>
            <h2 style={{ color: '#4db6ac', marginBottom: 12, fontSize: 22 }}>Comentarios</h2>
            <form onSubmit={handleComment} style={{ marginBottom: 18 }}>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Escribe un comentario..." style={{ width: '100%', minHeight: 60, padding: 10, borderRadius: 6, border: '1px solid #4db6ac', fontSize: 16, resize: 'vertical', marginBottom: 8 }} />
                <button type="submit" disabled={commentLoading || !comment.trim()} style={{ background: '#4db6ac', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>
                    {commentLoading ? 'Enviando...' : 'Comentar'}
                </button>
            </form>
            <div>
                {(story.comments || []).length === 0 ? (
                    <p style={{ color: '#888' }}>Aún no hay comentarios.</p>
                ) : (
                    story.comments.map((c, i) => (
                        <div key={i} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                            <span style={{ fontWeight: 'bold', color: '#e6b800' }}>{c.author?.username || c.author?.name || 'Anonimo'}</span>
                            <span style={{ marginLeft: 8, color: '#888', fontSize: 13 }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                            <div style={{ marginTop: 4 }}>{c.text}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
