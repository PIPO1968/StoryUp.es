import React from 'react';

function SidebarHistoria() {
    return (
        <div style={{ width: 220, background: '#fffbe6', borderRadius: 12, boxShadow: '0 2px 8px #ffe06633', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start', position: 'relative' }}>
            <div style={{ fontWeight: 'bold', color: '#e6b800', fontSize: 18, marginBottom: 8 }}>Opciones</div>
            <label style={{ fontWeight: 'bold', color: '#4db6ac', marginBottom: 4 }}>Modo de historia</label>
            <select style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #4db6ac', marginBottom: 12 }}>
                <option>Real</option>
                <option>Ficción</option>
            </select>
            <label style={{ fontWeight: 'bold', color: '#4db6ac', marginBottom: 4 }}>Tipo de historia</label>
            <select style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #4db6ac', marginBottom: 12 }}>
                <option>Aventura</option>
                <option>Corazón</option>
                <option>Fantasía</option>
                <option>Terror</option>
                <option>Familiar</option>
                <option>Educativa</option>
            </select>
            <button style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 'bold', cursor: 'pointer', marginBottom: 12 }}>Escribir como Anónimo</button>
            {/* Adornos */}
            <div style={{ position: 'absolute', left: -18, top: 12, fontSize: 22 }}>⭐</div>
            <div style={{ position: 'absolute', left: -18, bottom: 32, fontSize: 22 }}>💖</div>
            <div style={{ position: 'absolute', right: -18, top: 32, fontSize: 22 }}>👻</div>
            <div style={{ position: 'absolute', right: -18, bottom: 12, fontSize: 22 }}>📚</div>
        </div>
    );
}

export default SidebarHistoria;
