import React, { useState, useEffect } from 'react';
import { getCookie } from './cookieUtils';
// import ChatSidebar from './ChatSidebar';

function Perfil({ usuario, setUsuario }) {
    const [avatar, setAvatar] = useState(usuario?.avatar || '');
    const [loading, setLoading] = useState(false);
    const [tituloNoticia, setTituloNoticia] = useState('');
    const [contenidoNoticia, setContenidoNoticia] = useState('');
    const [enviandoNoticia, setEnviandoNoticia] = useState(false);
    const [mensajeNoticia, setMensajeNoticia] = useState(null);

    const handleEnviarNoticia = async () => {
        setEnviandoNoticia(true);
        setMensajeNoticia(null);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://storyup-backend.onrender.com/api';
            const res = await fetch(`${API_URL}/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: tituloNoticia, content: contenidoNoticia })
            });
            if (!res.ok) throw new Error('Error al crear noticia');
            setTituloNoticia('');
            setContenidoNoticia('');
            setMensajeNoticia({ tipo: 'ok', texto: '¡Noticia creada con éxito!' });
        } catch (err) {
            setMensajeNoticia({ tipo: 'error', texto: err.message || 'Error al crear noticia' });
        } finally {
            setEnviandoNoticia(false);
        }
    };

    useEffect(() => {
        setAvatar(usuario?.avatar || '');
    }, [usuario]);

    return (
        <div>
            {/* ...contenido del perfil... */}
        </div>
    );
}

export default Perfil;
