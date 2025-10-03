import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Stories({ user }) {
    const location = useLocation();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        // Simular carga de historias
        setTimeout(() => {
            setStories([
                {
                    id: 1,
                    title: "Mi Primera Historia",
                    preview: "Era una vez en un lugar muy lejano...",
                    date: "2025-01-02",
                    status: "published"
                },
                {
                    id: 2,
                    title: "Aventuras en el Bosque",
                    preview: "Los árboles susurraban secretos al viento...",
                    date: "2025-01-01",
                    status: "draft"
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <ul className="sidebar-nav">
                    <li>
                        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                            <span className="nav-icon">🏠</span>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/stories" className={isActive('/stories') ? 'active' : ''}>
                            <span className="nav-icon">📚</span>
                            Historias
                        </Link>
                    </li>
                    <li>
                        <Link to="/create" className={isActive('/create') ? 'active' : ''}>
                            <span className="nav-icon">✍️</span>
                            Crear Historia
                        </Link>
                    </li>
                    <li>
                        <Link to="/news" className={isActive('/news') ? 'active' : ''}>
                            <span className="nav-icon">📰</span>
                            Noticias
                        </Link>
                    </li>
                    <li>
                        <Link to="/statistics" className={isActive('/statistics') ? 'active' : ''}>
                            <span className="nav-icon">📊</span>
                            Estadísticas
                        </Link>
                    </li>
                    <li>
                        <Link to="/chat" className={isActive('/chat') ? 'active' : ''}>
                            <span className="nav-icon">💬</span>
                            Chat
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
                            <span className="nav-icon">👤</span>
                            Perfil
                        </Link>
                    </li>
                </ul>
            </nav>

            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Mis Historias</h1>
                    <p className="page-subtitle">Gestiona y revisa todas tus historias</p>
                </div>

                <div className="stories-actions">
                    <Link to="/create">
                        <button>📝 Nueva Historia</button>
                    </Link>
                </div>

                {loading ? (
                    <div className="loading">Cargando historias...</div>
                ) : (
                    <div className="stories-grid">
                        {stories.map(story => (
                            <div key={story.id} className="story-card">
                                <div className="story-status">
                                    {story.status === 'published' ? '🟢 Publicada' : '🟡 Borrador'}
                                </div>
                                <h3>{story.title}</h3>
                                <p className="story-preview">{story.preview}</p>
                                <div className="story-meta">
                                    <span className="story-date">{story.date}</span>
                                </div>
                                <div className="story-actions">
                                    <button>📖 Leer</button>
                                    <button>✏️ Editar</button>
                                    <button>🗑️ Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Stories;