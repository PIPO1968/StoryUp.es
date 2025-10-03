import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function News({ user }) {
    const location = useLocation();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        // Simular carga de noticias
        setTimeout(() => {
            setNews([
                {
                    id: 1,
                    title: "Nuevas Funciones de Chat Disponibles",
                    content: "Hemos añadido emojis, stickers y la posibilidad de enviar archivos en el chat. ¡Descúbrelo!",
                    category: "actualizacion",
                    date: "2025-01-03",
                    author: "Equipo StoryUp",
                    image: "/news1.jpg"
                },
                {
                    id: 2,
                    title: "Concurso de Historias de Enero",
                    content: "Participa en nuestro concurso mensual. El tema de este mes es 'Aventuras en el Tiempo'. ¡Premios increíbles te esperan!",
                    category: "concurso",
                    date: "2025-01-02",
                    author: "Equipo StoryUp",
                    image: "/news2.jpg"
                },
                {
                    id: 3,
                    title: "Mantenimiento Programado",
                    content: "El próximo sábado realizaremos mantenimiento en nuestros servidores de 2:00 a 4:00 AM (hora de Madrid).",
                    category: "mantenimiento",
                    date: "2025-01-01",
                    author: "Soporte Técnico",
                    image: "/news3.jpg"
                },
                {
                    id: 4,
                    title: "Nuevas Categorías de Historias",
                    content: "Añadimos las categorías 'Biografía' y 'Ensayo' para que puedas clasificar mejor tus historias.",
                    category: "actualizacion",
                    date: "2024-12-30",
                    author: "Equipo StoryUp",
                    image: "/news4.jpg"
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredNews = selectedCategory === 'all' 
        ? news 
        : news.filter(item => item.category === selectedCategory);

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'actualizacion': return '🆕';
            case 'concurso': return '🏆';
            case 'mantenimiento': return '🔧';
            default: return '📰';
        }
    };

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
                    <h1 className="page-title">Noticias y Novedades</h1>
                    <p className="page-subtitle">Mantente al día con las últimas actualizaciones de StoryUp</p>
                </div>

                <div className="news-filters">
                    <button 
                        className={selectedCategory === 'all' ? 'active' : ''}
                        onClick={() => setSelectedCategory('all')}
                    >
                        📰 Todas
                    </button>
                    <button 
                        className={selectedCategory === 'actualizacion' ? 'active' : ''}
                        onClick={() => setSelectedCategory('actualizacion')}
                    >
                        🆕 Actualizaciones
                    </button>
                    <button 
                        className={selectedCategory === 'concurso' ? 'active' : ''}
                        onClick={() => setSelectedCategory('concurso')}
                    >
                        🏆 Concursos
                    </button>
                    <button 
                        className={selectedCategory === 'mantenimiento' ? 'active' : ''}
                        onClick={() => setSelectedCategory('mantenimiento')}
                    >
                        🔧 Mantenimiento
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Cargando noticias...</div>
                ) : (
                    <div className="news-grid">
                        {filteredNews.map(item => (
                            <article key={item.id} className="news-card">
                                <div className="news-category">
                                    {getCategoryIcon(item.category)} {item.category}
                                </div>
                                <h3 className="news-title">{item.title}</h3>
                                <p className="news-content">{item.content}</p>
                                <div className="news-meta">
                                    <span className="news-author">Por {item.author}</span>
                                    <span className="news-date">{item.date}</span>
                                </div>
                                <div className="news-actions">
                                    <button>👍 Me gusta</button>
                                    <button>💬 Comentar</button>
                                    <button>📤 Compartir</button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default News;