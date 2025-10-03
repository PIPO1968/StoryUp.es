import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Profile({ user }) {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('info');
    const [profileData, setProfileData] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Simular carga de datos del perfil
        setTimeout(() => {
            setProfileData({
                username: user?.username || 'usuario_storyup',
                email: user?.email || 'usuario@storyup.es',
                userType: user?.userType || 'usuario',
                joinDate: '2024-12-15',
                avatar: '/default-avatar.png',
                bio: 'Escritor apasionado por las historias de aventura y fantasía.',
                stats: {
                    stories: 8,
                    followers: 34,
                    following: 28,
                    likes: 89
                }
            });

            setChatMessages([
                {
                    id: 1,
                    user: "Luis Martínez",
                    content: "¡Hola! Me encantó tu última historia 📚",
                    time: "14:30",
                    isOwn: false,
                    avatar: "/avatar1.png"
                },
                {
                    id: 2,
                    user: user?.username || "Tú",
                    content: "¡Muchas gracias! Me alegra que te haya gustado 😊",
                    time: "14:32",
                    isOwn: true
                },
                {
                    id: 3,
                    user: "Sofia Chen",
                    content: "¿Vas a participar en el concurso de este mes?",
                    time: "14:35",
                    isOwn: false,
                    avatar: "/avatar2.png"
                },
                {
                    id: 4,
                    user: user?.username || "Tú",
                    content: "¡Sí! Ya tengo algunas ideas. ¿Y tú?",
                    time: "14:36",
                    isOwn: true
                }
            ]);
            setLoading(false);
        }, 1000);
    }, [user]);

    useEffect(() => {
        if (activeTab === 'chat') {
            scrollToBottom();
        }
    }, [chatMessages, activeTab]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: Date.now(),
            user: user?.username || "Tú",
            content: newMessage.trim(),
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            isOwn: true
        };

        setChatMessages(prev => [...prev, message]);
        setNewMessage('');

        // Simular respuesta automática
        setTimeout(() => {
            const responses = [
                "¡Interesante! Cuéntame más 🤔",
                "Me parece una gran idea 👍",
                "¿Has leído algo similar antes?",
                "¡Eso suena emocionante! ✨"
            ];
            
            const names = ["Ana García", "Carlos López", "María Fernández", "Diego Ruiz"];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const randomName = names[Math.floor(Math.random() * names.length)];
            
            const responseMessage = {
                id: Date.now() + 1,
                user: randomName,
                content: randomResponse,
                time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
                avatar: `/avatar${Math.floor(Math.random() * 3) + 1}.png`
            };
            
            setChatMessages(prev => [...prev, responseMessage]);
        }, 1500 + Math.random() * 2000);
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
                    <h1 className="page-title">Mi Perfil</h1>
                    <p className="page-subtitle">Gestiona tu información personal y chatea con otros usuarios</p>
                </div>

                {loading ? (
                    <div className="loading">Cargando perfil...</div>
                ) : (
                    <div className="profile-content">
                        {/* Tabs del perfil */}
                        <div className="profile-tabs">
                            <button 
                                className={activeTab === 'info' ? 'active' : ''}
                                onClick={() => setActiveTab('info')}
                            >
                                👤 Información
                            </button>
                            <button 
                                className={activeTab === 'chat' ? 'active' : ''}
                                onClick={() => setActiveTab('chat')}
                            >
                                💬 Chat Personal
                            </button>
                            <button 
                                className={activeTab === 'settings' ? 'active' : ''}
                                onClick={() => setActiveTab('settings')}
                            >
                                ⚙️ Configuración
                            </button>
                        </div>

                        {/* Contenido de información personal */}
                        {activeTab === 'info' && (
                            <div className="profile-info">
                                <div className="profile-header">
                                    <div className="profile-avatar">
                                        <img src={profileData.avatar} alt="Avatar" onError={(e) => e.target.src = '/default-avatar.png'} />
                                        <button className="edit-avatar">📷</button>
                                    </div>
                                    <div className="profile-basic">
                                        <h2>{profileData.username}</h2>
                                        <p>{profileData.email}</p>
                                        <span className="user-type">
                                            {profileData.userType === 'padre' ? '👨‍🏫 Padre/Docente' : '👤 Usuario Particular'}
                                        </span>
                                        <p className="join-date">Miembro desde: {profileData.joinDate}</p>
                                    </div>
                                </div>

                                <div className="profile-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">{profileData.stats.stories}</span>
                                        <span className="stat-label">Historias</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{profileData.stats.followers}</span>
                                        <span className="stat-label">Seguidores</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{profileData.stats.following}</span>
                                        <span className="stat-label">Siguiendo</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{profileData.stats.likes}</span>
                                        <span className="stat-label">Likes</span>
                                    </div>
                                </div>

                                <div className="profile-bio">
                                    <h3>Biografía</h3>
                                    <p>{profileData.bio}</p>
                                    <button>✏️ Editar</button>
                                </div>
                            </div>
                        )}

                        {/* Chat WhatsApp-style integrado */}
                        {activeTab === 'chat' && (
                            <div className="whatsapp-chat">
                                <div className="chat-container">
                                    <div className="chat-header">
                                        <h3>💬 Chat Personal</h3>
                                        <div className="chat-status">
                                            <span className="online-indicator">🟢</span>
                                            <span>Conectado</span>
                                        </div>
                                    </div>

                                    <div className="chat-messages whatsapp-style">
                                        {chatMessages.map(message => (
                                            <div key={message.id} 
                                                 className={`whatsapp-message ${message.isOwn ? 'own' : 'received'}`}>
                                                {!message.isOwn && (
                                                    <div className="message-avatar">
                                                        <img src={message.avatar} 
                                                             alt={message.user} 
                                                             onError={(e) => e.target.src = '/default-avatar.png'} />
                                                    </div>
                                                )}
                                                <div className="message-bubble">
                                                    {!message.isOwn && (
                                                        <div className="message-sender">{message.user}</div>
                                                    )}
                                                    <div className="message-text">{message.content}</div>
                                                    <div className="message-time">
                                                        {message.time}
                                                        {message.isOwn && <span className="message-status">✓✓</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    <form onSubmit={handleSendMessage} className="whatsapp-input">
                                        <button type="button" className="emoji-btn">😊</button>
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Escribe un mensaje..."
                                            maxLength={500}
                                        />
                                        <button type="submit" 
                                                disabled={!newMessage.trim()}
                                                className="send-btn">
                                            <span>📤</span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Configuración */}
                        {activeTab === 'settings' && (
                            <div className="profile-settings">
                                <h3>⚙️ Configuración del Perfil</h3>
                                
                                <div className="settings-section">
                                    <h4>Privacidad</h4>
                                    <label>
                                        <input type="checkbox" defaultChecked />
                                        Permitir que otros usuarios me envíen mensajes
                                    </label>
                                    <label>
                                        <input type="checkbox" defaultChecked />
                                        Mostrar mi actividad online
                                    </label>
                                    <label>
                                        <input type="checkbox" />
                                        Hacer mi perfil privado
                                    </label>
                                </div>

                                <div className="settings-section">
                                    <h4>Notificaciones</h4>
                                    <label>
                                        <input type="checkbox" defaultChecked />
                                        Notificar nuevos mensajes
                                    </label>
                                    <label>
                                        <input type="checkbox" defaultChecked />
                                        Notificar nuevos seguidores
                                    </label>
                                    <label>
                                        <input type="checkbox" />
                                        Notificar comentarios en mis historias
                                    </label>
                                </div>

                                <div className="settings-actions">
                                    <button className="save-btn">💾 Guardar Cambios</button>
                                    <button className="danger-btn">🗑️ Eliminar Cuenta</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Profile;