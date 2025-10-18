

import Register from './Register';
import Perfil from './Perfil';
import { setCookie, getCookie } from './cookieUtils';
import { Routes, Route, Navigate } from 'react-router-dom';


import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';

import Sidebar from './Sidebar';
import './App.css';


function App() {
    const [usuario, setUsuario] = useState(null);
    const [totalUsuarios, setTotalUsuarios] = useState(null);
    const [usuariosOnline, setUsuariosOnline] = useState(null);
    const [horaMadrid, setHoraMadrid] = useState("");
    const [lang, setLang] = useState('es');

    const API_URL = process.env.REACT_APP_API_URL || 'https://www.storyup.es/api';

    const fetchTotalUsuarios = React.useCallback(() => {
        fetch(`${API_URL}/usuarios/total`)
            .then(res => res.json())
            .then(data => setTotalUsuarios(data.total))
            .catch(() => setTotalUsuarios('—'));
    }, [API_URL]);

    const fetchUsuariosOnline = React.useCallback(() => {
        fetch(`${API_URL}/usuarios/online`)
            .then(res => res.json())
            .then(data => setUsuariosOnline(data.online))
            .catch(() => setUsuariosOnline('—'));
    }, [API_URL]);

    const actualizarHoraMadrid = () => {
        const ahora = new Date();
        const opciones = { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const opcionesFecha = { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' };
        const hora = ahora.toLocaleTimeString('es-ES', opciones);
        const fecha = ahora.toLocaleDateString('es-ES', opcionesFecha);
        setHoraMadrid(`${fecha} ${hora}`);
    };

    useEffect(() => {
        fetchTotalUsuarios();
        fetchUsuariosOnline();
        const intervalUsuarios = setInterval(() => {
            fetchTotalUsuarios();
            fetchUsuariosOnline();
        }, 10000);
        return () => clearInterval(intervalUsuarios);
    }, [fetchTotalUsuarios, fetchUsuariosOnline]);

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
                });
        }
    }, [API_URL, usuario]);

    // Guardar token en cookie tras login/registro
    const handleLogin = (user) => {
        if (user.token) setCookie('token', user.token, 7);
        setUsuario(user);
    };



    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {usuario && <Sidebar />}
            <div style={{ flex: 1, marginLeft: usuario ? 210 : 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <header className="top-bar">
                    <div className="topbar-left">
                        <span className="topbar-users">👥 Usuarios: {totalUsuarios !== null ? totalUsuarios : '—'}
                            <span className="topbar-sep">&nbsp;-&nbsp;</span>
                            <span className="topbar-online">🟢 Online: {usuariosOnline !== null ? usuariosOnline : '—'}</span>
                        </span>
                    </div>
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

