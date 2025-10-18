import React, { useState } from 'react';

function Perfil({ usuario }) {
    const [avatar, setAvatar] = useState(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setAvatar(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '2rem', margin: '2rem auto', maxWidth: 1100 }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #ffe06633', padding: '2.5rem', minWidth: 320 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ width: 110, height: 110, borderRadius: '50%', background: '#ffe066', overflow: 'hidden', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {avatar ? (
                            <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ color: '#e6b800', fontSize: 48 }}>👤</span>
                        )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ marginBottom: 8 }} />
                    <span style={{ fontSize: 14, color: '#888' }}>Sube tu avatar</span>
                </div>
                <h2 style={{ color: '#e6b800', marginBottom: 24 }}>Datos personales</h2>
                <p><strong>Nombre:</strong> {usuario?.realName || ''}</p>
                <p><strong>Nick:</strong> {usuario?.nick || usuario?.username}</p>
                <p><strong>Email:</strong> {usuario?.email}</p>
                <p><strong>Tipo:</strong> {usuario?.userType || 'Usuario'}</p>
                {/* Aquí puedes añadir más datos del usuario */}
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #ffe06633', padding: '2.5rem', minWidth: 320 }}>
                <h2 style={{ color: '#e6b800', marginBottom: 24 }}>TROFEOS</h2>
                {/* Aquí irán los trofeos del usuario */}
            </div>
        </div>
    );
}

export default Perfil;
