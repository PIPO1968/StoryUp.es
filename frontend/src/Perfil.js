import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar';
import { getCookie } from './cookieUtils';


function Perfil({ usuario }) {
    const [avatar, setAvatar] = useState(usuario?.avatar || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAvatar(usuario?.avatar || '');
    }, [usuario]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const base64 = ev.target.result;
                setAvatar(base64);
                setLoading(true);
                try {
                    const token = getCookie('token');
                    const API_URL = process.env.REACT_APP_API_URL || 'https://www.storyup.es/api';
                    const res = await fetch(`${API_URL}/me/avatar`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ avatar: base64 })
                    });
                    if (!res.ok) throw new Error('Error al guardar avatar');
                } catch (err) {
                    alert('No se pudo guardar el avatar');
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: '2.5rem', margin: '2.5rem auto', maxWidth: 1200, width: '95vw', alignItems: 'flex-start', justifyContent: 'center' }}>
                <div style={{ flex: 1, background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #ffe06633', padding: '2.5rem 2.5rem', minWidth: 340, maxWidth: 540, height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
                        <div style={{ width: 110, height: 110, borderRadius: '50%', background: '#ffe066', overflow: 'hidden', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {avatar ? (
                                <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: '#e6b800', fontSize: 48 }}>👤</span>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ marginBottom: 6 }} disabled={loading} />
                        <span style={{ fontSize: 13, color: '#888' }}>{loading ? 'Guardando avatar...' : 'Sube tu avatar'}</span>
                    </div>
                    <h2 style={{ color: '#e6b800', marginBottom: 18, alignSelf: 'flex-start' }}>Datos personales</h2>
                    <div style={{ width: '100%' }}>
                        <p><strong>Nombre:</strong> {usuario?.realName || ''}</p>
                        <p><strong>Nick:</strong> {usuario?.nick || usuario?.username}</p>
                        <p><strong>Email:</strong> {usuario?.email}</p>
                        <p><strong>Tipo:</strong> {usuario?.userType || 'Usuario'}</p>
                        <p><strong>Centro Escolar:</strong> {usuario?.school || '—'}</p>
                        <p><strong>Curso:</strong> {usuario?.course || '—'}</p>
                        <div style={{ display: 'flex', gap: '2.5rem', marginTop: 12 }}>
                            <span><strong>Likes:</strong> {usuario?.likes ?? '0'}</span>
                            <span><strong>Comentarios:</strong> {usuario?.comments ?? '0'}</span>
                            <span><strong>Amigos:</strong> {usuario?.friends ?? '0'}</span>
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1, background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #ffe06633', padding: '2.5rem 2.5rem', minWidth: 340, maxWidth: 540, height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h2 style={{ color: '#e6b800', marginBottom: 18 }}>TROFEOS</h2>
                    {/* Aquí irán los trofeos del usuario */}
                </div>
            </div>
            <div style={{ width: '95vw', maxWidth: 1200, margin: '2.5rem auto 0 auto', background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #ffe06633', padding: '2rem 2.5rem', minHeight: 320, border: '3px solid #4db6ac' }}>
                <h2 style={{ color: '#e6b800', marginBottom: 18 }}>CHAT</h2>
                <div style={{ display: 'flex', gap: '2rem', height: 320 }}>
                    {/* Sidebar de usuarios */}
                    <ChatSidebar usuarios={[]} onSelectUsuario={() => { }} />
                    {/* Espacio de lectura y escritura */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ flex: 1, background: '#fffbe6', borderRadius: 10, boxShadow: '0 2px 8px #ffe06633', padding: '1rem', marginBottom: 12, overflowY: 'auto' }}>
                            {/* Aquí se mostrarán los mensajes */}
                            <div style={{ color: '#aaa', fontSize: 14 }}>Selecciona un usuario para chatear</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input type="text" placeholder="Escribe tu mensaje..." style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e6b800' }} />
                            <button style={{ background: '#e6b800', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bloques de noticias y concursos */}
            <div style={{ display: 'flex', gap: '2.5rem', margin: '2.5rem auto 0 auto', maxWidth: 1200, width: '95vw', alignItems: 'flex-start', justifyContent: 'center' }}>
                {/* Bloque de crear noticias */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #4db6ac33', padding: '2.5rem 2.5rem', minWidth: 340, maxWidth: 540, height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h2 style={{ color: '#4db6ac', marginBottom: 18 }}>Crear noticia</h2>
                    <input type="text" placeholder="Título de la noticia" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #4db6ac' }} />
                    <textarea placeholder="Escribe la noticia..." style={{ width: '100%', minHeight: 80, marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #4db6ac' }} />
                    <button style={{ background: '#4db6ac', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar noticia</button>
                </div>
                {/* Bloque de crear concursos */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #4db6ac33', padding: '2.5rem 2.5rem', minWidth: 340, maxWidth: 540, height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h2 style={{ color: '#4db6ac', marginBottom: 8 }}>Crear concurso</h2>
                    <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#e6b800' }}>ID del concurso: <span style={{ background: '#ffe066', borderRadius: 4, padding: '2px 8px' }}>#12345</span></div>
                    <textarea placeholder="Descripción del concurso..." style={{ width: '100%', minHeight: 80, marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #4db6ac' }} />
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12, width: '100%' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', color: '#4db6ac' }}>Fecha inicio</label>
                            <input type="date" style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #4db6ac' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', color: '#4db6ac' }}>Fecha final</label>
                            <input type="date" style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #4db6ac' }} />
                        </div>
                    </div>
                    {/* Campo de ganador, solo visible una semana después de la fecha final (lógica visual, no funcional aún) */}
                    <div style={{ width: '100%', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', color: '#4db6ac', marginBottom: 4, display: 'block' }}>Nombre del ganador</label>
                            <input type="text" placeholder="Nombre del ganador" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #4db6ac', background: '#f5f5f5' }} disabled />
                            <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                                Este campo estará disponible una semana después de la fecha final del concurso.
                            </div>
                        </div>
                        <button style={{ background: '#4db6ac', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', cursor: 'pointer', height: 40 }} disabled>Enviar</button>
                    </div>
                    <button style={{ background: '#4db6ac', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', cursor: 'pointer' }}>Crear concurso</button>
                </div>
            </div>
        </div>
    );
}

export default Perfil;
