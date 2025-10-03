import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './lib/auth.ts';

// Contexto de autenticación
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
import Dashboard from './pages/Dashboard.tsx';
import StoriesPage from './pages/StoriesPage.tsx';
import CreateStoryPage from './pages/CreateStoryPage.tsx';
import NewsPage from './pages/NewsPage.tsx';
import StatisticsPage from './pages/StatisticsPage.tsx';
import ContestsPage from './pages/ContestsPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import ChatPage from './pages/ChatPage.tsx';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario al iniciar
    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    // Si hay usuario autenticado, mostrar la aplicación principal
    if (user) {
        return (
            <AuthContext.Provider value={{ user, setUser }}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/stories" element={<StoriesPage />} />
                        <Route path="/create" element={<CreateStoryPage />} />
                        <Route path="/news" element={<NewsPage />} />
                        <Route path="/contests" element={<ContestsPage />} />
                        <Route path="/statistics" element={<StatisticsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/chat" element={<ChatPage />} />
                    </Routes>
                </Router>
            </AuthContext.Provider>
        );
    }

    // Pantalla de login
    return (
        <LoginPage onLogin={setUser} />
    );
}

export default App;
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        if (token && userData) {
            try {
                setUsuario(JSON.parse(userData));
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
            }
        }

        fetchTotalUsuarios();
        fetchUsuariosOnline();
        const intervalUsuarios = setInterval(() => {
            fetchTotalUsuarios();
            fetchUsuariosOnline();
        }, 10000);
        return () => clearInterval(intervalUsuarios);
    }, []);

    useEffect(() => {
        actualizarHoraMadrid();
        const intervalHora = setInterval(actualizarHoraMadrid, 1000);
        return () => clearInterval(intervalHora);
    }, []);

    const handleLogin = (user) => {
        setUsuario(user);
        localStorage.setItem('userData', JSON.stringify(user));
    };

    const handleLogout = () => {
        setUsuario(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
    };

    // Si hay usuario logueado, mostrar la aplicación principal
    if (usuario) {
        return (
            <Router>
                <div className="App">
                    <header className="top-bar">
                        <div className="topbar-left">
                            <img src="/favicon.ico" alt="Logo StoryUp.es" className="topbar-logo" />
                            <span className="topbar-users">👥 Usuarios: {totalUsuarios !== null ? totalUsuarios : '—'}
                                <span className="topbar-sep">&nbsp;-&nbsp;</span>
                                <span className="topbar-online">🟢 Online: {usuariosOnline !== null ? usuariosOnline : '—'}</span>
                            </span>
                        </div>
                        <div className="topbar-center-absolute">
                            <span className="topbar-clock">{horaMadrid}</span>
                        </div>
                        <div className="topbar-right">
                            <LanguageSelector lang={lang} setLang={setLang} />
                            <button onClick={handleLogout} className="logout-btn">Salir</button>
                        </div>
                    </header>

                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/stories" element={<StoriesPage />} />
                        <Route path="/create" element={<CreateStoryPage />} />
                        <Route path="/news" element={<NewsPage />} />
                        <Route path="/contests" element={<ContestsPage />} />
                        <Route path="/statistics" element={<StatisticsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/chat" element={<ChatPage />} />
                    </Routes>
                </div>
            </Router>
        );
    }

    // Pantalla de login/registro
    return (
        <>
            <header className="top-bar">
                <div className="topbar-left">
                    <img src="/favicon.ico" alt="Logo StoryUp.es" className="topbar-logo" />
                    <span className="topbar-users">👥 Usuarios: {totalUsuarios !== null ? totalUsuarios : '—'}
                        <span className="topbar-sep">&nbsp;-&nbsp;</span>
                        <span className="topbar-online">🟢 Online: {usuariosOnline !== null ? usuariosOnline : '—'}</span>
                    </span>
                </div>
                <div className="topbar-center-absolute">
                    <span className="topbar-clock">{horaMadrid}</span>
                </div>
                <div className="topbar-right">
                    <LanguageSelector lang={lang} setLang={setLang} />
                </div>
            </header>
            <div className="main-layout">
                {/* Bloque blanco con características a la izquierda */}
                <div className="features-block">
                    <div className="features">
                        <div className="feature-card">
                            <span className="feature-icon">💬</span>
                            <h3>Chat en tiempo real</h3>
                            <p>Envía y recibe mensajes instantáneos con tus amigos y grupos.</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">👥</span>
                            <h3>Grupos personalizados</h3>
                            <p>Crea, administra y únete a grupos para compartir intereses.</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">🔒</span>
                            <h3>Privacidad y seguridad</h3>
                            <p>Tus datos y conversaciones están protegidos y son privados.</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">🌍</span>
                            <h3>Comunidad global</h3>
                            <p>Conecta con personas de todo el mundo.</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">🏆</span>
                            <h3>Logros y recompensas</h3>
                            <p>Gana medallas por tu actividad.</p>
                        </div>
                    </div>
                </div>
                {/* Login centrado sobre fondo gris */}
                <div className="login-block">
                    <img src="/login-icon.png" alt="Icono login StoryUp.es" className="logo-img" />
                    <div className="logo">StoryUp.es</div>
                    <div className="descripcion">
                        <strong>(PARA USUARIOS PARTICULARES)</strong><br />
                        Red social moderna y diferente para chatear, crear grupos y compartir experiencias con personas de todo el mundo. ¡Conéctate, haz amigos y disfruta de una comunidad segura y divertida!<br /><br />
                        <strong>(PARA DOCENTES Y ESCOLARES)</strong><br />
                        Herramienta social y educativa para centros escolares: multilingüe, colaborativa y con enfoque anti-bullying. Fomenta la comunicación, el aprendizaje y la convivencia positiva en el aula y más allá.
                    </div>
                    {!usuario ? (
                        <>
                            {mostrarRegistro ? (
                                <Register onRegister={handleLogin} />
                            ) : (
                                <Login onLogin={handleLogin} />
                            )}
                            <button onClick={() => setMostrarRegistro(!mostrarRegistro)}>
                                {mostrarRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                            </button>
                        </>
                    ) : (
                        <div>
                            <p>¡Bienvenido, {usuario.username}!</p>
                            <p>Ya puedes acceder al chat y grupos.</p>
                        </div>
                    )}
                    <footer className="footer">
                        <span>© 2025 StoryUp.es · <a href="mailto:contacto@storyup.es">Contacto</a></span>
                    </footer>
                </div>
                {/* Imagen a la derecha del login */}
                <div className="image-block">
                    <img src="/logo-grande.png" alt="Logo grande StoryUp.es" className="side-image" />
                </div>
            </div>
        </>
    );
}

export default App;