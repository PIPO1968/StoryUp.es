import React from 'react';

function Perfil({ usuario }) {
    return (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #ffe06633', padding: '2.5rem', minWidth: 320, maxWidth: 480, margin: '2rem auto' }}>
            <h2 style={{ color: '#e6b800', marginBottom: 24 }}>Perfil de usuario</h2>
            <p><strong>Nombre:</strong> {usuario?.realName || usuario?.username || usuario?.nick}</p>
            <p><strong>Nick:</strong> {usuario?.nick || usuario?.username}</p>
            <p><strong>Email:</strong> {usuario?.email}</p>
            <p><strong>Tipo:</strong> {usuario?.userType || 'Usuario'}</p>
            {/* Aquí puedes añadir más datos del usuario */}
        </div>
    );
}

export default Perfil;
