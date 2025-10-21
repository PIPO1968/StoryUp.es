import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar';


function Perfil({ usuario }) {
    // --- Estado para crear concurso ---
    const [tituloConcurso, setTituloConcurso] = useState("");
    const [resumenConcurso, setResumenConcurso] = useState("");
    const [fechaInicioConcurso, setFechaInicioConcurso] = useState("");
    const [fechaFinalConcurso, setFechaFinalConcurso] = useState("");
    const [enviandoConcurso, setEnviandoConcurso] = useState(false);
    const [mensajeConcurso, setMensajeConcurso] = useState(null);
    const [ganadorConcurso, setGanadorConcurso] = useState("");
    const [idUltimoConcurso, setIdUltimoConcurso] = useState(null);
    const [fechaFinalUltimoConcurso, setFechaFinalUltimoConcurso] = useState(null);

    // Lógica para habilitar el campo ganador solo una semana después de la fecha final
    const puedeEditarGanador = () => {
        if (!fechaFinalUltimoConcurso) return false;
        const fechaFinal = new Date(fechaFinalUltimoConcurso);
        const ahora = new Date();
        return ahora - fechaFinal > 7 * 24 * 60 * 60 * 1000; // 7 días
    };

    const handleCrearConcurso = async () => {
        setEnviandoConcurso(true);
        setMensajeConcurso(null);
        try {
            const API_URL = 'https://storyup-backend.onrender.com/api';
            const res = await fetch(`${API_URL}/concursos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo: tituloConcurso,
                    resumen: resumenConcurso,
                    fechaInicio: fechaInicioConcurso,
                    fechaFinal: fechaFinalConcurso,
                    autorId: usuario?._id,
                })
            });
            if (!res.ok) throw new Error('Error al crear concurso');
            const data = await res.json();
            setTituloConcurso("");
            setResumenConcurso("");
            setFechaInicioConcurso("");
            setFechaFinalConcurso("");
            setIdUltimoConcurso(data._id);
            setFechaFinalUltimoConcurso(data.fechaFinal);
            setMensajeConcurso({ tipo: 'ok', texto: '¡Concurso creado con éxito!' });
        } catch (err) {
            setMensajeConcurso({ tipo: 'error', texto: err.message || 'Error al crear concurso' });
        } finally {
            setEnviandoConcurso(false);
        }
    };

    // Guardar ganador (solo si permitido)
    const handleGuardarGanador = async () => {
        if (!idUltimoConcurso) return;
        setMensajeConcurso(null);
        try {
            const API_URL = 'https://storyup-backend.onrender.com/api';
            const res = await fetch(`${API_URL}/concursos/${idUltimoConcurso}/ganador`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ganador: ganadorConcurso })
            });
            if (!res.ok) throw new Error('Error al guardar ganador');
            setMensajeConcurso({ tipo: 'ok', texto: '¡Ganador guardado!' });
        } catch (err) {
            setMensajeConcurso({ tipo: 'error', texto: err.message || 'Error al guardar ganador' });
        }
    };
    const [avatar, setAvatar] = useState(usuario?.avatar || '');
    const [loading, setLoading] = useState(false);
    // --- Estado para crear noticia ---
    const [tituloNoticia, setTituloNoticia] = useState('');
    const [contenidoNoticia, setContenidoNoticia] = useState('');
    const [enviandoNoticia, setEnviandoNoticia] = useState(false);
    const [mensajeNoticia, setMensajeNoticia] = useState(null);

    const [anonimoNoticia, setAnonimoNoticia] = useState(false);
    const handleEnviarNoticia = async () => {
        setEnviandoNoticia(true);
        setMensajeNoticia(null);
        try {
            const API_URL = 'https://storyup-backend.onrender.com/api';
            const res = await fetch(`${API_URL}/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Si usas autenticación, añade aquí el token
                },
                body: JSON.stringify({ title: tituloNoticia, content: contenidoNoticia, authorId: usuario?._id, anonimo: anonimoNoticia })
            });
            if (!res.ok) throw new Error('Error al crear noticia');
            setTituloNoticia('');
            setContenidoNoticia('');
            setAnonimoNoticia(false);
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

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const base64 = ev.target.result;
                setAvatar(base64);
                setLoading(true);
                // ...no renderizar nada aquí...
            };
            reader.readAsDataURL(file);
        }
    }
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
                        <p><strong>ID:</strong> <a href={`/perfil/${usuario?._id}`} style={{ color: '#4db6ac', textDecoration: 'underline', cursor: 'pointer' }}>{usuario?._id}</a></p>
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
                    <input
                        type="text"
                        placeholder="Título de la noticia"
                        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #4db6ac' }}
                        value={tituloNoticia || ''}
                        onChange={e => setTituloNoticia(e.target.value)}
                        disabled={enviandoNoticia}
                    />
                    <textarea
                        placeholder="Escribe la noticia..."
                        style={{ width: '100%', minHeight: 80, marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #4db6ac' }}
                        value={contenidoNoticia || ''}
                        onChange={e => setContenidoNoticia(e.target.value)}
                        disabled={enviandoNoticia}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <input
                            type="checkbox"
                            id="anonimoNoticia"
                            checked={anonimoNoticia}
                            onChange={e => setAnonimoNoticia(e.target.checked)}
                            disabled={enviandoNoticia}
                            style={{ marginRight: 8 }}
                        />
                        <label htmlFor="anonimoNoticia" style={{ color: '#4db6ac', fontWeight: 'bold', cursor: 'pointer' }}>
                            Publicar como anónimo
                        </label>
                    </div>
                    <button
                        style={{ background: '#4db6ac', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={handleEnviarNoticia}
                        disabled={enviandoNoticia || !tituloNoticia || !contenidoNoticia}
                    >
                        {enviandoNoticia ? 'Enviando...' : 'Enviar noticia'}
                    </button>
                    {mensajeNoticia && (
                        <div style={{ marginTop: 10, color: mensajeNoticia.tipo === 'error' ? 'red' : 'green', fontWeight: 'bold' }}>
                            {mensajeNoticia.texto}
                        </div>
                    )}
                </div>
                {/* Bloque de crear concursos */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #4db6ac33', padding: '2.5rem 2.5rem', minWidth: 340, maxWidth: 540, height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h2 style={{ color: '#4db6ac', marginBottom: 8 }}>Crear concurso</h2>
                    <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#e6b800' }}>ID del concurso: <span style={{ background: '#ffe066', borderRadius: 4, padding: '2px 8px' }}>{idUltimoConcurso ? `#${idUltimoConcurso}` : '—'}</span></div>
                    <input
                        type="text"
                        placeholder="Título del concurso"
                        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #4db6ac' }}
                        value={tituloConcurso}
                        onChange={e => setTituloConcurso(e.target.value)}
                        disabled={enviandoConcurso}
                    />
                    <textarea
                        placeholder="Descripción del concurso..."
                        style={{ width: '100%', minHeight: 80, marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #4db6ac' }}
                        value={resumenConcurso}
                        onChange={e => setResumenConcurso(e.target.value)}
                        disabled={enviandoConcurso}
                    />
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12, width: '100%' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', color: '#4db6ac' }}>Fecha inicio</label>
                            <input
                                type="date"
                                style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #4db6ac' }}
                                value={fechaInicioConcurso}
                                onChange={e => setFechaInicioConcurso(e.target.value)}
                                disabled={enviandoConcurso}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', color: '#4db6ac' }}>Fecha final</label>
                            <input
                                type="date"
                                style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #4db6ac' }}
                                value={fechaFinalConcurso}
                                onChange={e => setFechaFinalConcurso(e.target.value)}
                                disabled={enviandoConcurso}
                            />
                        </div>
                    </div>
                    {/* Campo de ganador, solo editable una semana después de la fecha final */}
                    <div style={{ width: '100%', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', color: '#4db6ac', marginBottom: 4, display: 'block' }}>Nombre del ganador</label>
                            <input
                                type="text"
                                placeholder="Nombre del ganador"
                                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #4db6ac', background: puedeEditarGanador() ? '#fff' : '#f5f5f5' }}
                                value={ganadorConcurso}
                                onChange={e => setGanadorConcurso(e.target.value)}
                                disabled={!puedeEditarGanador()}
                            />
                            <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                                {puedeEditarGanador() ? 'Puedes definir el ganador.' : 'Este campo estará disponible una semana después de la fecha final del concurso.'}
                            </div>
                        </div>
                        <button
                            style={{ background: '#4db6ac', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', cursor: puedeEditarGanador() ? 'pointer' : 'not-allowed', height: 40 }}
                            onClick={handleGuardarGanador}
                            disabled={!puedeEditarGanador() || !ganadorConcurso.trim()}
                        >Guardar</button>
                    </div>
                    <button
                        style={{ background: '#4db6ac', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={handleCrearConcurso}
                        disabled={enviandoConcurso || !tituloConcurso || !resumenConcurso || !fechaInicioConcurso || !fechaFinalConcurso}
                    >
                        {enviandoConcurso ? 'Enviando...' : 'Crear concurso'}
                    </button>
                    {mensajeConcurso && (
                        <div style={{ marginTop: 10, color: mensajeConcurso.tipo === 'error' ? 'red' : 'green', fontWeight: 'bold' }}>
                            {mensajeConcurso.texto}
                        </div>
                    )}
                </div>
            </div>
            {/* Panel de Administrador */}
            <div style={{ width: '95vw', maxWidth: 1200, margin: '2.5rem auto 0 auto', background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #43a047', padding: '2rem 2.5rem', minHeight: 320, border: '3px solid #43a047', display: 'flex', gap: '2rem' }}>
                {/* Sidebar de búsqueda de usuario */}
                <div style={{ width: 220, background: '#ffebee', borderRadius: 10, boxShadow: '0 2px 8px #e5737333', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input type="text" placeholder="Buscar usuario..." style={{ marginBottom: 10, padding: 6, borderRadius: 6, border: '1px solid #e57373', width: '100%' }} />
                    <div style={{ flex: 1, overflowY: 'auto', maxHeight: 220 }}>
                        {/* Aquí aparecerán los nicks encontrados para seleccionar */}
                        <div style={{ color: '#e57373', fontWeight: 'bold', cursor: 'pointer', marginBottom: 6 }}>EjemploNick1</div>
                        <div style={{ color: '#e57373', fontWeight: 'bold', cursor: 'pointer', marginBottom: 6 }}>EjemploNick2</div>
                    </div>
                </div>
                {/* Panel principal de administración */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <h2 style={{ color: '#43a047', marginBottom: 8 }}>Panel de Administrador</h2>
                    {/* Lista de seleccionados */}
                    <div style={{ background: '#fffbe6', borderRadius: 10, boxShadow: '0 2px 8px #ffe06633', padding: '1rem', marginBottom: 8 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Usuarios seleccionados:</div>
                        <div style={{ minHeight: 32, marginBottom: 8 }}>
                            <span style={{ color: '#e6b800', fontWeight: 'bold', marginRight: 12 }}>EjemploNick1</span>
                            <span style={{ color: '#e6b800', fontWeight: 'bold', marginRight: 12 }}>EjemploNick2</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <button style={{ background: '#e6b800', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', cursor: 'pointer' }}>Dar likes</button>
                            <select style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e6b800', fontWeight: 'bold' }}>
                                {Array.from({ length: 41 }, (_, i) => i - 20).map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Palabras prohibidas */}
                    <div style={{ background: '#ffebee', borderRadius: 10, boxShadow: '0 2px 8px #e5737333', padding: '1rem', marginBottom: 8 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Palabras prohibidas:</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input type="text" placeholder="Escribe palabras prohibidas..." style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e57373' }} />
                            <button style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar</button>
                        </div>
                    </div>
                    {/* Pregunta y respuesta + selectores */}
                    <div style={{ background: '#fffbe6', borderRadius: 10, boxShadow: '0 2px 8px #ffe06633', padding: '1rem', marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="text" placeholder="Pregunta" style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #e6b800' }} />
                        <input type="text" placeholder="Respuesta" style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #e6b800' }} />
                        <select style={{ flex: 1, padding: '6px 12px', borderRadius: 6, border: '1px solid #e6b800' }}>
                            <option>Asignatura 1</option>
                            <option>Asignatura 2</option>
                            <option>Asignatura 3</option>
                        </select>
                        <select style={{ flex: 1, padding: '6px 12px', borderRadius: 6, border: '1px solid #e6b800' }}>
                            <option>Curso 1</option>
                            <option>Curso 2</option>
                            <option>Curso 3</option>
                        </select>
                        <button style={{ background: '#e6b800', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar</button>
                    </div>
                    {/* Botón expulsar usuario */}
                    <button style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 8, padding: '0 32px', fontWeight: 'bold', cursor: 'pointer', marginTop: 18, height: 48, fontSize: 18, letterSpacing: 1 }}>Expulsar usuario de StoryUp</button>
                </div>
            </div>
        </div>
    );
}
export default Perfil;
