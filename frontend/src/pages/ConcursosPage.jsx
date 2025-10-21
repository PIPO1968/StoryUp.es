import React, { useEffect, useState } from 'react';

export default function ConcursosPage() {
    const [concursos, setConcursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConcursos = async () => {
            try {
                const API_URL = 'https://storyup-backend.onrender.com/api';
                const res = await fetch(`${API_URL}/concursos`);
                if (!res.ok) throw new Error('Error al obtener concursos');
                const data = await res.json();
                setConcursos(data);
            } catch (err) {
                setConcursos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchConcursos();
    }, []);

    // Separar concursos activos y finalizados
    const ahora = new Date();
    const activos = concursos.filter(c => new Date(c.fechaFinal) >= ahora).slice(0, 5);
    const finalizados = concursos.filter(c => new Date(c.fechaFinal) < ahora).slice(0, 5);

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#f9f9f9', padding: '2.5rem 0' }}>
            <h1 style={{ textAlign: 'center', color: '#e6b800', fontSize: 36, marginBottom: 32, letterSpacing: 1 }}>
                <span style={{ marginRight: 12 }}>🏆</span>
                Concursos
            </h1>
            <div style={{ display: 'flex', gap: 32, maxWidth: 1100, margin: '0 auto' }}>
                {/* Concursos Activos */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #ffe06633', padding: '2rem', minWidth: 340 }}>
                    <h2 style={{ color: '#4db6ac', marginBottom: 18, textAlign: 'left', fontSize: 24 }}>Concursos Activos</h2>
                    {loading ? <p>Cargando...</p> : activos.length === 0 ? <p>No hay concursos activos.</p> : activos.map((c, i) => (
                        <div key={c._id || i} style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
                            <h3 style={{ color: '#e6b800', fontWeight: 'bold', fontSize: 20 }}>{c.titulo}</h3>
                            <div style={{ color: '#888', fontSize: 15, marginBottom: 6 }}>Autor: {c.autor?.username || c.autor?.name || 'Desconocido'}</div>
                            <div style={{ color: '#888', fontSize: 15, marginBottom: 6 }}>Inicio: {new Date(c.fechaInicio).toLocaleDateString()} | Fin: {new Date(c.fechaFinal).toLocaleDateString()}</div>
                            <div style={{ color: '#444', fontSize: 16, marginBottom: 6 }}>{c.resumen}</div>
                        </div>
                    ))}
                </div>
                {/* Concursos Finalizados */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #ffe06633', padding: '2rem', minWidth: 340 }}>
                    <h2 style={{ color: '#e57373', marginBottom: 18, textAlign: 'left', fontSize: 24 }}>Concursos Finalizados</h2>
                    {loading ? <p>Cargando...</p> : finalizados.length === 0 ? <p>No hay concursos finalizados.</p> : finalizados.map((c, i) => (
                        <div key={c._id || i} style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
                            <h3 style={{ color: '#e6b800', fontWeight: 'bold', fontSize: 20 }}>{c.titulo}</h3>
                            <div style={{ color: '#888', fontSize: 15, marginBottom: 6 }}>Autor: {c.autor?.username || c.autor?.name || 'Desconocido'}</div>
                            <div style={{ color: '#888', fontSize: 15, marginBottom: 6 }}>Inicio: {new Date(c.fechaInicio).toLocaleDateString()} | Fin: {new Date(c.fechaFinal).toLocaleDateString()}</div>
                            <div style={{ color: '#444', fontSize: 16, marginBottom: 6 }}>{c.resumen}</div>
                            <div style={{ color: '#43a047', fontWeight: 'bold', fontSize: 16 }}>Ganador: {c.ganador || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Sin definir</span>}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
