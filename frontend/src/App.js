

import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
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
            <footer className="footer" style={{ marginTop: '3rem', marginLeft: usuario ? '200px' : 0 }}>
                <span>© 2025 StoryUp.es · <a href="mailto:contacto@storyup.es">Contacto</a></span>
            </footer>
        </>
    );
}

export default App;

