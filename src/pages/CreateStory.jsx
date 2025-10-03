import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function CreateStory({ user }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('aventura');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setSaving] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleSave = async (isDraft = false) => {
        setSaving(true);
        
        // Simular guardado
        setTimeout(() => {
            setSaving(false);
            alert(`Historia ${isDraft ? 'guardada como borrador' : 'publicada'} exitosamente!`);
            if (!isDraft) {
                navigate('/stories');
            }
        }, 1500);
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
                    <h1 className="page-title">Crear Nueva Historia</h1>
                    <p className="page-subtitle">Deja volar tu imaginación y crea una historia única</p>
                </div>

                <div className="create-story-form">
                    <div className="form-group">
                        <label htmlFor="title">Título de la Historia</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Escribe un título atractivo..."
                            maxLength={100}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Categoría</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="aventura">🗺️ Aventura</option>
                                <option value="fantasia">🧙‍♂️ Fantasía</option>
                                <option value="ciencia-ficcion">🚀 Ciencia Ficción</option>
                                <option value="misterio">🔍 Misterio</option>
                                <option value="romance">💕 Romance</option>
                                <option value="terror">👻 Terror</option>
                                <option value="comedia">😄 Comedia</option>
                                <option value="historica">🏛️ Histórica</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                />
                                Historia pública (otros usuarios pueden leerla)
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Contenido</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Era una vez..."
                            rows={15}
                            style={{
                                width: '100%',
                                padding: '15px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                lineHeight: '1.6',
                                resize: 'vertical'
                            }}
                        />
                        <div className="character-count">
                            {content.length} caracteres
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            onClick={() => handleSave(true)}
                            disabled={loading}
                            className="save-draft-btn"
                        >
                            {loading ? '💾 Guardando...' : '💾 Guardar Borrador'}
                        </button>
                        <button
                            onClick={() => handleSave(false)}
                            disabled={loading || !title.trim() || !content.trim()}
                            className="publish-btn"
                        >
                            {loading ? '📤 Publicando...' : '📤 Publicar Historia'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CreateStory;