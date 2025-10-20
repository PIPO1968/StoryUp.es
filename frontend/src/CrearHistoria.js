import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarHistoria from './SidebarHistoria';

function CrearHistoria({ usuario }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState("Real");
    const [theme, setTheme] = useState("Aventura");
    const [anonimo, setAnonimo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!title.trim() || !content.trim()) {
            setError("Debes completar el título y el contenido.");
            return;
        }
        setLoading(true);
        try {
            const API_URL = 'https://storyup-backend.onrender.com/api';
            const res = await fetch(`${API_URL}/stories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, type, theme, anonimo, authorId: usuario?._id })
            });
            if (!res.ok) throw new Error("Error al crear la historia");
            setSuccess("¡Historia creada correctamente!");
            setTimeout(() => {
                navigate("/historias");
            }, 1200);
        } catch (err) {
            setError("No se pudo crear la historia. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#f9f9f9', padding: '2.5rem 0' }}>
            <h1 style={{ textAlign: 'center', color: '#e6b800', fontSize: 36, marginBottom: 32, letterSpacing: 1 }}>Crea tu Historia</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', maxWidth: 1200, margin: '0 auto' }}>
                <SidebarHistoria
                    type={type}
                    setType={setType}
                    theme={theme}
                    setTheme={setTheme}
                    anonimo={anonimo}
                    setAnonimo={setAnonimo}
                />
                <form onSubmit={handleSubmit} style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #ffe06633', padding: '2.5rem 2.5rem', minWidth: 340, maxWidth: 700, position: 'relative', overflow: 'visible' }}>
                    {/* Adornos alrededor */}
                    <div style={{ position: 'absolute', left: -28, top: -28, fontSize: 32 }}>⭐</div>
                    <div style={{ position: 'absolute', right: -28, top: -28, fontSize: 32 }}>💖</div>
                    <div style={{ position: 'absolute', left: -28, bottom: -28, fontSize: 32 }}>👻</div>
                    <div style={{ position: 'absolute', right: -28, bottom: -28, fontSize: 32 }}>📚</div>
                    <h2 style={{ color: '#4db6ac', marginBottom: 18, textAlign: 'left', fontSize: 28 }}>Nueva historia</h2>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título de la historia" style={{ width: '100%', marginBottom: 18, padding: 10, borderRadius: 8, border: '1px solid #4db6ac', fontSize: 18 }} />
                    <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Escribe tu historia aquí..." style={{ width: '100%', minHeight: 180, marginBottom: 18, padding: 12, borderRadius: 8, border: '1px solid #4db6ac', fontSize: 16, resize: 'vertical' }} />
                    <button type="submit" disabled={loading} style={{ background: '#e6b800', color: '#fff', border: 'none', borderRadius: 8, padding: '0 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', marginTop: 8 }}>
                        {loading ? 'Enviando...' : 'Enviar historia'}
                    </button>
                    {error && <div style={{ color: '#e57373', marginTop: 16 }}>{error}</div>}
                    {success && <div style={{ color: '#4db6ac', marginTop: 16 }}>{success}</div>}
                </form>
            </div>
        </div>
    );
}

export default CrearHistoria;
