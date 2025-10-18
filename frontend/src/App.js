
import Login from './Login';
import Register from './Register';
import { setCookie, getCookie } from './cookieUtils';


import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';

import Sidebar from './Sidebar';
import './App.css';


function App() {
    const [usuario, setUsuario] = useState(null);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
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
        <>
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
            {usuario && <Sidebar />}
            {/* Contenido principal vacío, solo sidebar y header si está logueado */}
            <main style={{ marginLeft: usuario ? 200 : 0, marginTop: '2rem', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                {!usuario && (
                    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #ffe06633', padding: '2.5rem 2.5rem 2rem 2.5rem', minWidth: 320, maxWidth: 380 }}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <img src="/login-icon.png" alt="Icono login StoryUp.es" style={{ width: 60, height: 60, marginBottom: 12 }} />
                            <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#e6b800', marginBottom: 8 }}>StoryUp.es</div>
                        </div>
                        {mostrarRegistro ? (
                            <Register onRegister={handleLogin} />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )}
                        <button style={{ marginTop: 18, width: '100%' }} onClick={() => setMostrarRegistro(!mostrarRegistro)}>
                            {mostrarRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                        </button>
                    </div>
                )}
            </main>
            <footer className="footer" style={{ marginTop: '3rem', marginLeft: usuario ? '200px' : 0 }}>
                <span>© 2025 StoryUp.es · <a href="mailto:contacto@storyup.es">Contacto</a></span>
            </footer>
        </>
    );
}

export default App;

