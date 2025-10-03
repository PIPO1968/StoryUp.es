import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Statistics({ user }) {
    const location = useLocation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        // Simular carga de estadísticas
        setTimeout(() => {
            setStats({
                stories: {
                    total: 8,
                    published: 5,
                    drafts: 3,
                    views: 1247,
                    likes: 89
                },
                activity: {
                    daysActive: 23,
                    wordsWritten: 15420,
                    averageWordsPerDay: 670,
                    longestStreak: 7
                },
                social: {
                    followers: 34,
                    following: 28,
                    comments: 156,
                    shares: 23
                },
                achievements: [
                    { id: 1, name: "Primer Historia", description: "Publicaste tu primera historia", earned: true, date: "2024-12-15" },
                    { id: 2, name: "Escritor Prolífico", description: "Escribe 5 historias", earned: true, date: "2024-12-28" },
                    { id: 3, name: "Popular", description: "Obtén 50 likes", earned: true, date: "2025-01-01" },
                    { id: 4, name: "Constante", description: "Escribe durante 7 días seguidos", earned: true, date: "2025-01-02" },
                    { id: 5, name: "Maestro", description: "Escribe 10 historias", earned: false, progress: "8/10" },
                    { id: 6, name: "Viral", description: "Obtén 100 likes", earned: false, progress: "89/100" }
                ]
            });
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
                    <h1 className="page-title">Mis Estadísticas</h1>
                    <p className="page-subtitle">Revisa tu progreso y logros en StoryUp</p>
                </div>

                {loading ? (
                    <div className="loading">Cargando estadísticas...</div>
                ) : (
                    <div className="statistics-content">
                        {/* Estadísticas principales */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📚</div>
                                <div className="stat-info">
                                    <h3>{stats.stories.total}</h3>
                                    <p>Historias Totales</p>
                                    <small>{stats.stories.published} publicadas, {stats.stories.drafts} borradores</small>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">👀</div>
                                <div className="stat-info">
                                    <h3>{stats.stories.views.toLocaleString()}</h3>
                                    <p>Visualizaciones</p>
                                    <small>En todas tus historias</small>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">👍</div>
                                <div className="stat-info">
                                    <h3>{stats.stories.likes}</h3>
                                    <p>Likes Recibidos</p>
                                    <small>De otros usuarios</small>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">✍️</div>
                                <div className="stat-info">
                                    <h3>{stats.activity.wordsWritten.toLocaleString()}</h3>
                                    <p>Palabras Escritas</p>
                                    <small>Promedio: {stats.activity.averageWordsPerDay} por día</small>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">📅</div>
                                <div className="stat-info">
                                    <h3>{stats.activity.daysActive}</h3>
                                    <p>Días Activo</p>
                                    <small>Racha más larga: {stats.activity.longestStreak} días</small>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-info">
                                    <h3>{stats.social.followers}</h3>
                                    <p>Seguidores</p>
                                    <small>Siguiendo a {stats.social.following}</small>
                                </div>
                            </div>
                        </div>

                        {/* Logros y Trofeos */}
                        <div className="achievements-section">
                            <h2>🏆 Logros y Trofeos</h2>
                            <div className="achievements-grid">
                                {stats.achievements.map(achievement => (
                                    <div 
                                        key={achievement.id} 
                                        className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
                                    >
                                        <div className="achievement-icon">
                                            {achievement.earned ? '🏆' : '🔒'}
                                        </div>
                                        <h4>{achievement.name}</h4>
                                        <p>{achievement.description}</p>
                                        {achievement.earned ? (
                                            <small className="achievement-date">
                                                Obtenido el {achievement.date}
                                            </small>
                                        ) : (
                                            <small className="achievement-progress">
                                                Progreso: {achievement.progress}
                                            </small>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gráfico de actividad (simulado) */}
                        <div className="activity-chart">
                            <h2>📈 Actividad Reciente</h2>
                            <div className="chart-placeholder">
                                <p>Gráfico de actividad de los últimos 30 días</p>
                                <div className="chart-bars">
                                    {[4, 7, 2, 8, 5, 9, 3, 6, 4, 7, 5, 8, 9, 2, 6, 4, 7, 8, 3, 5, 9, 4, 6, 7, 2, 8, 5, 9, 3, 6].map((height, index) => (
                                        <div 
                                            key={index} 
                                            className="chart-bar" 
                                            style={{ height: `${height * 10}px` }}
                                            title={`Día ${index + 1}: ${height} palabras`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Statistics;