import React, { useState } from 'react';

function ChatSidebar({ usuarios, onSelectUsuario }) {
    const [busqueda, setBusqueda] = useState('');
    const abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const usuariosFiltrados = usuarios.filter(u =>
        u.nick.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div style={{ width: 220, background: '#fffbe6', borderRadius: 10, boxShadow: '0 2px 8px #ffe06633', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
                type="text"
                placeholder="Buscar usuario..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{ marginBottom: 10, padding: 6, borderRadius: 6, border: '1px solid #e6b800', width: '100%' }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {abecedario.map(letra => (
                    <button key={letra} style={{ background: '#ffe066', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setBusqueda(letra)}>{letra}</button>
                ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: 320 }}>
                {usuariosFiltrados.map(u => (
                    <div key={u.nick} style={{ padding: '6px 0', borderBottom: '1px solid #ffe066', cursor: 'pointer' }} onClick={() => onSelectUsuario(u)}>
                        <span style={{ color: '#e6b800', fontWeight: 'bold' }}>{u.nick}</span>
                    </div>
                ))}
                {usuariosFiltrados.length === 0 && <div style={{ color: '#aaa', fontSize: 13 }}>No hay usuarios</div>}
            </div>
        </div>
    );
}

export default ChatSidebar;
