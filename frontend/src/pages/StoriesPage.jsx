import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function StoriesPage() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch("/api/stories");
                if (!res.ok) throw new Error("Error al obtener historias");
                const data = await res.json();
                setStories(data);
            } catch (err) {
                setStories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    const renderEmptyStories = () => {
        const emptySlots = [];
        for (let i = 1; i <= 25; i++) {
            emptySlots.push(
                <div key={i} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <span className="text-2xl font-bold text-gray-300 mr-4">{i}</span>
                    <div className="flex-1">
                        <p className="text-gray-400">Sin historia creada</p>
                        <p className="text-sm text-gray-300">Esperando nueva historia...</p>
                    </div>
                </div>
            );
        }
        return emptySlots;
    };

    return (
        <div className="space-y-6">
            <div style={{ width: '100%', minHeight: '100vh', background: '#f9f9f9', padding: '2.5rem 0' }}>
                <h1 style={{ textAlign: 'center', color: '#e6b800', fontSize: 36, marginBottom: 32, letterSpacing: 1 }}>
                    <span style={{ marginRight: 12 }}>📖</span>
                    Historias de la Comunidad
                </h1>
                <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #ffe06633', padding: '2.5rem 2.5rem', minWidth: 340 }}>
                    <h2 style={{ color: '#4db6ac', marginBottom: 18, textAlign: 'left', fontSize: 24 }}>Últimas 25 historias</h2>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>Cargando historias...</p>
                    ) : stories.length === 0 ? (
                        <>
                            <p style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
                                ¡Aún no hay historias creadas! Sé el primero en compartir tu historia.
                            </p>
                            {renderEmptyStories()}
                        </>
                    ) : (
                        stories.map((story, index) => (
                            <div key={story._id} style={{ display: 'flex', alignItems: 'center', padding: 16, border: '1px solid #eee', borderRadius: 12, marginBottom: 12, background: '#fafafa' }}>
                                <span style={{ fontSize: 22, fontWeight: 'bold', color: '#4db6ac', marginRight: 18 }}>{index + 1}</span>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 4 }}>
                                        <Link to={`/stories/${story._id}`} style={{ color: '#e6b800', textDecoration: 'underline', cursor: 'pointer' }}>
                                            {story.title}
                                        </Link>
                                    </h3>
                                    <div style={{ fontSize: 15, color: '#888' }}>
                                        <span style={{ marginRight: 8 }}>👤 {story.author?.username || story.author?.name || "Autor desconocido"}</span>
                                        <span style={{ marginRight: 8 }}>•</span>
                                        <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <button style={{ background: '#e6b800', color: '#fff', border: 'none', borderRadius: 8, padding: '0 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', marginTop: 8 }}>
                            Crear Nueva Historia
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
