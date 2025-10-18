import React from 'react';

const TROFEOS = Array.from({ length: 22 }, (_, i) => ({
    id: i + 1,
    nombre: `Premio${i + 1}`,
    imagen: `/assets/Premio${i + 1}.png`,
    descripcion: `Descripción del trofeo ${i + 1}`,
    comoConseguir: `Cómo conseguir el trofeo ${i + 1}`
}));

function Trofeos({ trofeosConseguidos = [] }) {
    return (
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', margin: '40px auto', maxWidth: 1200 }}>
            {/* Trofeos por conseguir (izquierda) */}
            <div style={{ flex: 1 }}>
                <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Trofeos por conseguir</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                    {TROFEOS.filter(t => !trofeosConseguidos.includes(t.id)).map(trofeo => (
                        <div key={trofeo.id} style={{ position: 'relative', textAlign: 'center', opacity: 0.5 }}>
                            <img src={trofeo.imagen} alt={trofeo.nombre} style={{ width: 80, height: 80, filter: 'grayscale(1)' }} />
                            {/* Candado cerrado */}
                            <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 28, color: '#d32f2f' }}>🔒</span>
                            <div style={{ marginTop: 8, fontWeight: 'bold' }}>{trofeo.nombre}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>{trofeo.descripcion}</div>
                            <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{trofeo.comoConseguir}</div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Trofeos conseguidos (derecha) */}
            <div style={{ flex: 1 }}>
                <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Trofeos conseguidos</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                    {TROFEOS.filter(t => trofeosConseguidos.includes(t.id)).map(trofeo => (
                        <div key={trofeo.id} style={{ position: 'relative', textAlign: 'center', opacity: 1 }}>
                            <img src={trofeo.imagen} alt={trofeo.nombre} style={{ width: 80, height: 80, filter: 'none', boxShadow: '0 0 12px #ffd54f' }} />
                            {/* Candado abierto */}
                            <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 28, color: '#388e3c' }}>🔓</span>
                            <div style={{ marginTop: 8, fontWeight: 'bold' }}>{trofeo.nombre}</div>
                            <div style={{ fontSize: 12, color: '#333' }}>{trofeo.descripcion}</div>
                            <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{trofeo.comoConseguir}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Trofeos;
