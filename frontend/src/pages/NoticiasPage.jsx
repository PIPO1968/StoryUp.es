// Forzar nuevo deploy: cambio menor
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NoticiasPage() {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                const API_URL = 'https://storyup-backend.onrender.com/api';
                const res = await fetch(`${API_URL}/news`);
                if (!res.ok) throw new Error("Error al obtener noticias");
                const data = await res.json();
                setNoticias(data);
            } catch (err) {
                setNoticias([]);
            } finally {
                setLoading(false);
            }
        };
        fetchNoticias();
    }, []);

    const renderEmptyNoticias = () => {
        const emptySlots = [];
        for (let i = 1; i <= 25; i++) {
            emptySlots.push(
                <div key={i} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <span className="text-2xl font-bold text-gray-300 mr-4">{i}</span>
                    <div className="flex-1">
                        <p className="text-gray-400">Sin noticia creada</p>
                        <p className="text-sm text-gray-300">Esperando nueva noticia...</p>
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
                    <span style={{ marginRight: 12 }}>📰</span>
                    Noticias
                </h1>
                <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #ffe06633', padding: '2.5rem 2.5rem', minWidth: 340 }}>
                    <h2 style={{ color: '#4db6ac', marginBottom: 18, textAlign: 'left', fontSize: 24 }}>Últimas Noticias</h2>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>Cargando noticias...</p>
                    ) : noticias.length === 0 ? (
                        <>
                            <p style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
                                ¡Aún no hay noticias creadas! Sé el primero en compartir una noticia.
                            </p>
                            {renderEmptyNoticias()}
                        </>
                    ) : (
                        noticias.slice(0, 5).map((noticia, index) => (
                            <div key={noticia._id} style={{ display: 'flex', alignItems: 'center', padding: 16, border: '1px solid #eee', borderRadius: 12, marginBottom: 12, background: '#fafafa' }}>
                                <span style={{ fontSize: 22, fontWeight: 'bold', color: '#4db6ac', marginRight: 18 }}>{index + 1}</span>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 4 }}>
                                        <Link to={`/noticias/${noticia._id}`} style={{ color: '#e6b800', textDecoration: 'underline', cursor: 'pointer' }}>
                                            {noticia.title}
                                        </Link>
                                    </h3>
                                    <div style={{ fontSize: 15, color: '#888', display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span>👤 {noticia.anonimo ? "Anonimo" : (noticia.author?.username || noticia.author?.name || "Autor desconocido")}</span>
                                        <span>•</span>
                                        <span>{new Date(noticia.createdAt).toLocaleDateString()}</span>
                                        <span>❤️ {noticia.likes || 0}</span>
                                        <span>💬 {(noticia.comments?.length || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
