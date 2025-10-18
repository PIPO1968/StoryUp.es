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
        <div style={{ display: 'flex', gap: '2.5rem', margin: '2.5rem auto', maxWidth: 1400, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #ffe06633', padding: '2rem 2.5rem', minWidth: 340, maxWidth: 600, height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
                    <div style={{ width: 110, height: 110, borderRadius: '50%', background: '#ffe066', overflow: 'hidden', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {avatar ? (
                            <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ color: '#e6b800', fontSize: 48 }}>👤</span>
                        )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ marginBottom: 6 }} />
                    <span style={{ fontSize: 13, color: '#888' }}>Sube tu avatar</span>
                </div>
                <h2 style={{ color: '#e6b800', marginBottom: 18, alignSelf: 'flex-start' }}>Datos personales</h2>
                <div style={{ width: '100%' }}>
                    <p><strong>Nombre:</strong> {usuario?.realName || ''}</p>
                    <p><strong>Nick:</strong> {usuario?.nick || usuario?.username}</p>
                    <p><strong>Email:</strong> {usuario?.email}</p>
                    <p><strong>Tipo:</strong> {usuario?.userType || 'Usuario'}</p>
                </div>
            </div>
            <div style={{ flex: 2, background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #ffe06633', padding: '2rem 2.5rem', minWidth: 340, height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h2 style={{ color: '#e6b800', marginBottom: 18 }}>TROFEOS</h2>
                {/* Aquí irán los trofeos del usuario */}
            </div>
        </div>
    );
}

export default Perfil;
