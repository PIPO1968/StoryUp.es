import React, { useState, useEffect } from 'react';
import Register from './Register';
import Perfil from './Perfil';
import CrearHistoria from './CrearHistoria';
import { setCookie, getCookie, deleteCookie } from './cookieUtils';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import Sidebar from './Sidebar';
import './App.css';
function App() {
    // Cerrar sesión
    const handleLogout = () => {
        deleteCookie('token');
        setUsuario(null);
        navigate('/', { replace: true });
    };
    const [usuario, setUsuario] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);
    const [horaMadrid, setHoraMadrid] = useState("");
    const [lang, setLang] = useState('es');
    const location = useLocation();
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL || 'https://www.storyup.es/api';


    const actualizarHoraMadrid = () => {
        const ahora = new Date();
        const opciones = { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const opcionesFecha = { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' };
        const hora = ahora.toLocaleTimeString('es-ES', opciones);
        const fecha = ahora.toLocaleDateString('es-ES', opcionesFecha);
        setHoraMadrid(`${fecha} ${hora}`);
    };


    useEffect(() => {
        actualizarHoraMadrid();
        const intervalHora = setInterval(actualizarHoraMadrid, 1000);
        return () => clearInterval(intervalHora);
    }, []);

    // Restaurar sesión desde cookie al cargar la app
    useEffect(() => {
        const token = getCookie('token');
        if (token && !usuario) {
            fetch(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && data.user) setUsuario({ ...data.user, token });
                })
                .finally(() => setCheckingSession(false));
        } else {
            setCheckingSession(false);
        }
    }, [API_URL, usuario]);

    // Guardar la última ruta visitada en una cookie (excepto si es / o si es login/registro)
    useEffect(() => {
        if (usuario && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register') {
            setCookie('lastPath', location.pathname, 7);
        }
    }, [location.pathname, usuario]);

    // Al cargar, si hay usuario y no estamos en la última ruta, redirigir
    useEffect(() => {
        if (usuario && location.pathname === '/') {
            navigate('/perfil', { replace: true });
        }
    }, [usuario, location.pathname, navigate]);

    // Guardar token en cookie tras login/registro
    const handleLogin = (user) => {
        if (user.token) setCookie('token', user.token, 7);
        setUsuario(user);
    };

    // Loader mientras se verifica la sesión
    if (checkingSession) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fffbe6' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#e6b800', marginBottom: 16 }}>StoryUp.es</div>
                    <div className="loader" style={{ margin: '0 auto', width: 48, height: 48, border: '6px solid #ffe066', borderTop: '6px solid #e6b800', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <div style={{ marginTop: 16, color: '#888' }}>Verificando sesión...</div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% {transform: rotate(360deg);} }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {usuario && <Sidebar onLogout={handleLogout} />}
            <div style={{ flex: 1, marginLeft: usuario ? 210 : 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <header className="top-bar">
                    <div className="topbar-left"></div>
                    <div className="topbar-center">
                        <span className="topbar-clock">{horaMadrid}</span>
                    </div>
                    <div className="topbar-right">
                        <LanguageSelector lang={lang} setLang={setLang} />
                    </div>
                </header>
                <main style={{ flex: 1, marginTop: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <Routes>
                        <Route path="/perfil" element={usuario ? <Perfil usuario={usuario} /> : <Navigate to="/" />} />
                        <Route path="/crear-historia" element={<CrearHistoria />} />
                        <Route path="/" element={
                            !usuario ? (
                                <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #ffe06633', padding: '2.5rem 2.5rem 2rem 2.5rem', minWidth: 320, maxWidth: 380, margin: '0 auto' }}>
                                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                        {/* Imagen de login eliminada para evitar error 404 */}
                                        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#e6b800', marginBottom: 8 }}>StoryUp.es</div>
                                    </div>
                                    <Register onRegister={handleLogin} />
                                </div>
                            ) : <Navigate to="/perfil" />
                        } />
                    </Routes>
                </main>
                <footer className="footer" style={{ marginTop: '3rem' }}>
                    <span>© 2025 StoryUp.es · <a href="mailto:contacto@storyup.es">Contacto</a></span>
                </footer>
            </div>
        </div>
    );

}

export default App;


