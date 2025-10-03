import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Dashboard({ user }) {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

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
                    <h1 className="page-title">¡Bienvenido, {user?.username}!</h1>
                    <p className="page-subtitle">Panel principal de StoryUp.es</p>
                </div>

                <div className="dashboard-cards">
                    <div className="feature-card">
                        <span className="feature-icon">📚</span>
                        <h3>Mis Historias</h3>
                        <p>Crea y gestiona tus historias personales</p>
                        <Link to="/stories">
                            <button>Ver Historias</button>
                        </Link>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">✍️</span>
                        <h3>Crear Nueva</h3>
                        <p>Escribe una nueva historia o continúa una existente</p>
                        <Link to="/create">
                            <button>Crear Historia</button>
                        </Link>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">💬</span>
                        <h3>Chat</h3>
                        <p>Conecta con otros usuarios y comparte experiencias</p>
                        <Link to="/chat">
                            <button>Abrir Chat</button>
                        </Link>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">📰</span>
                        <h3>Noticias</h3>
                        <p>Mantente al día con las últimas novedades</p>
                        <Link to="/news">
                            <button>Ver Noticias</button>
                        </Link>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">📊</span>
                        <h3>Estadísticas</h3>
                        <p>Revisa tu progreso y estadísticas de uso</p>
                        <Link to="/statistics">
                            <button>Ver Estadísticas</button>
                        </Link>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">👤</span>
                        <h3>Mi Perfil</h3>
                        <p>Gestiona tu perfil y configuración</p>
                        <Link to="/profile">
                            <button>Ver Perfil</button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;