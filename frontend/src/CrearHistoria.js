import React from 'react';
import SidebarHistoria from './SidebarHistoria';

function CrearHistoria() {
    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#f9f9f9', padding: '2.5rem 0' }}>
            <h1 style={{ textAlign: 'center', color: '#e6b800', fontSize: 36, marginBottom: 32, letterSpacing: 1 }}>Crea tu Historia</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', maxWidth: 1200, margin: '0 auto' }}>
                <SidebarHistoria />
                <div style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #ffe06633', padding: '2.5rem 2.5rem', minWidth: 340, maxWidth: 700, position: 'relative', overflow: 'visible' }}>
                    {/* Adornos alrededor */}
                    <div style={{ position: 'absolute', left: -28, top: -28, fontSize: 32 }}>⭐</div>
                    <div style={{ position: 'absolute', right: -28, top: -28, fontSize: 32 }}>💖</div>
                    <div style={{ position: 'absolute', left: -28, bottom: -28, fontSize: 32 }}>👻</div>
                    <div style={{ position: 'absolute', right: -28, bottom: -28, fontSize: 32 }}>📚</div>
                    <h2 style={{ color: '#4db6ac', marginBottom: 18, textAlign: 'left', fontSize: 28 }}>Nueva historia</h2>
                    <input type="text" placeholder="Título de la historia" style={{ width: '100%', marginBottom: 18, padding: 10, borderRadius: 8, border: '1px solid #4db6ac', fontSize: 18 }} />
                    <textarea placeholder="Escribe tu historia aquí..." style={{ width: '100%', minHeight: 180, marginBottom: 18, padding: 12, borderRadius: 8, border: '1px solid #4db6ac', fontSize: 16, resize: 'vertical' }} />
                    <button style={{ background: '#e6b800', color: '#fff', border: 'none', borderRadius: 8, padding: '0 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', marginTop: 8 }}>Enviar historia</button>
                </div>
            </div>
        </div>
    );
}

export default CrearHistoria;
