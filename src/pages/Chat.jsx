import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Chat({ user }) {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Simular carga de mensajes
        setTimeout(() => {
            setMessages([
                {
                    id: 1,
                    user: "Ana García",
                    content: "¡Hola a todos! ¿Cómo están?",
                    time: "10:30",
                    isOwn: false
                },
                {
                    id: 2,
                    user: "Carlos López",
                    content: "¡Muy bien! Acabo de terminar una nueva historia 📚",
                    time: "10:32",
                    isOwn: false
                },
                {
                    id: 3,
                    user: user?.username || "Tú",
                    content: "¡Genial! Me encanta leer historias nuevas",
                    time: "10:33",
                    isOwn: true
                },
                {
                    id: 4,
                    user: "María Fernández",
                    content: "El concurso de este mes está muy interesante 🏆",
                    time: "10:35",
                    isOwn: false
                },
                {
                    id: 5,
                    user: "Ana García",
                    content: "Sí, yo también voy a participar. ¿Algún consejo?",
                    time: "10:36",
                    isOwn: false
                }
            ]);
            setLoading(false);
        }, 1000);
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Simular respuesta automática después de un momento
        setTimeout(() => {
            const responses = [
                "¡Interesante punto de vista! 👍",
                "Totalmente de acuerdo contigo",
                "¿Podrías contarnos más sobre eso?",
                "¡Excelente aporte al chat!",
                "Me gusta mucho esa idea 💡"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const responseMessage = {
                id: Date.now() + 1,
                user: "Usuario del Chat",
                content: randomResponse,
                time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                isOwn: false
            };
            
            setMessages(prev => [...prev, responseMessage]);
        }, 2000 + Math.random() * 3000);
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
                    <h1 className="page-title">Chat Global</h1>
                    <p className="page-subtitle">Conecta con otros usuarios de StoryUp</p>
                </div>

                {loading ? (
                    <div className="loading">Cargando chat...</div>
                ) : (
                    <div className="chat-container">
                        <div className="chat-header">
                            <h3>💬 Chat General</h3>
                            <div className="chat-status">
                                <span className="online-indicator">🟢</span>
                                <span>12 usuarios online</span>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {messages.map(message => (
                                <div key={message.id} className={`message ${message.isOwn ? 'own' : ''}`}>
                                    <div className="message-content">
                                        {!message.isOwn && (
                                            <div className="message-user">{message.user}</div>
                                        )}
                                        <div className="message-text">{message.content}</div>
                                        <div className="message-time">{message.time}</div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="chat-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe tu mensaje..."
                                maxLength={500}
                            />
                            <button type="submit" disabled={!newMessage.trim()}>
                                📤 Enviar
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Chat;