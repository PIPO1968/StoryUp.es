import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export default function NoticiasPage() {
    const { noticias, loading } = useGlobal();

    const renderEmptyNoticias = () => {
        const emptySlots = [];
        for (let i = 1; i <= 25; i++) {
            emptySlots.push(
                <div key={i} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <span className="text-2xl font-bold text-gray-300 mr-4">{i}</span>
                    <div className="flex-1">
                        <p className="text-gray-400">Sin noticia creada</p>
                        <p className="text-sm text-gray-300">Esperando nueva noticia...</p>
                    </div>
                </div>
            );
        }
        return emptySlots;
    };

    return (
        <div className="space-y-6">
            <div style={{ width: '100%', minHeight: '100vh', background: '#f9f9f9', padding: '2.5rem 0' }}>
                <h1 style={{ textAlign: 'center', color: '#e6b800', fontSize: 36, marginBottom: 32, letterSpacing: 1 }}>
                    <span style={{ marginRight: 12 }}>📰</span>
                    Noticias
                </h1>
                <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #ffe06633', padding: '2.5rem 2.5rem', minWidth: 340 }}>
                    <h2 style={{ color: '#4db6ac', marginBottom: 18, textAlign: 'left', fontSize: 24 }}>Últimas Noticias</h2>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>Cargando noticias...</p>
                    ) : noticias.length === 0 ? (
                        <>
                            <p style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
                                ¡Aún no hay noticias creadas! Sé el primero en compartir una noticia.
                            </p>
                            {renderEmptyNoticias()}
                        </>
                    ) : (
                        noticias.slice(0, 5).map((noticia, index) => (
                            <NoticiaConComentarios key={noticia._id} noticia={noticia} index={index} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
// --- Componente para cada noticia con comentarios ---
function NoticiaConComentarios({ noticia, index }) {
    const [comentario, setComentario] = React.useState("");
    const [comentarios, setComentarios] = React.useState(noticia.comments ? noticia.comments.slice(0, 5) : []);
    const [enviando, setEnviando] = React.useState(false);
    const [error, setError] = React.useState("");

    const { usuario } = useGlobal();
    const handleEnviarComentario = async () => {
        setEnviando(true);
        setError("");
        try {
            if (!usuario || !usuario._id) {
                setError("Debes iniciar sesión para comentar.");
                setEnviando(false);
                return;
            }
            const res = await fetch(`https://storyup-backend.onrender.com/api/news/${noticia._id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: usuario._id, text: comentario })
            });
            if (!res.ok) throw new Error("Error al enviar comentario");
            const nuevosComentarios = await res.json();
            setComentarios(nuevosComentarios);
            setComentario("");
        } catch (err) {
            setError("No se pudo enviar el comentario");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: 16, border: '1px solid #eee', borderRadius: 12, marginBottom: 12, background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 'bold', color: '#4db6ac', marginRight: 18 }}>{index + 1}</span>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 4, color: '#e6b800' }}>
                        {noticia.title}
                    </h3>
                    {/* ID eliminado */}
                    <div style={{ fontSize: 15, color: '#888', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span>👤 {noticia.anonimo ? "Anonimo" : (
                            noticia.author && noticia.author._id ?
                                <Link to={`/perfil/${noticia.author._id}`} style={{ color: '#e6b800', textDecoration: 'underline', cursor: 'pointer' }}>
                                    {noticia.author.username || noticia.author.name || "Autor desconocido"}
                                </Link>
                                : (noticia.author?.username || noticia.author?.name || "Autor desconocido")
                        )}</span>
                        <span>•</span>
                        <span>{new Date(noticia.createdAt).toLocaleDateString()}</span>
                        <span>💬 {comentarios.length}</span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 16, color: '#444', whiteSpace: 'pre-line' }}>
                        {noticia.content}
                    </div>
                </div>
            </div>
            {/* Área de comentarios */}
            <div style={{ marginTop: 16, background: '#f5f5f5', borderRadius: 8, padding: 12 }}>
                <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#4db6ac' }}>Comentarios recientes</div>
                {comentarios.length === 0 ? (
                    <div style={{ color: '#aaa', fontStyle: 'italic' }}>Sin comentarios aún.</div>
                ) : (
                    comentarios.map((c, i) => {
                        const nick = c.author?.username || c.author?.name || c.nick || 'Usuario';
                        return (
                            <div key={i} style={{ borderBottom: '1px solid #eee', padding: '6px 0', fontSize: 15 }}>
                                <span style={{ color: '#e6b800', fontWeight: 'bold' }}>
                                    {c.author && c.author._id ? (
                                        <Link to={`/perfil/${c.author._id}`} style={{ color: '#e6b800', textDecoration: 'underline', cursor: 'pointer' }}>{nick}</Link>
                                    ) : nick}
                                </span>: {c.text}
                            </div>
                        );
                    })
                )}
                <div style={{ display: 'flex', marginTop: 10, gap: 8 }}>
                    <input
                        type="text"
                        value={comentario}
                        onChange={e => setComentario(e.target.value)}
                        placeholder="Escribe un comentario..."
                        style={{ flex: 1, borderRadius: 6, border: '1px solid #ccc', padding: 8 }}
                        disabled={enviando}
                    />
                    <button
                        onClick={handleEnviarComentario}
                        disabled={enviando || !comentario.trim()}
                        style={{ background: '#e6b800', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }}
                    >Enviar</button>
                </div>
                {error && <div style={{ color: 'red', marginTop: 6 }}>{error}</div>}
            </div>
        </div>
    );
}
