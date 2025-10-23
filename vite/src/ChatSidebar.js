// Componente de chat lateral (placeholder)
import React from 'react';

export default function ChatSidebar({ usuarios, onSelectUsuario }) {
    return (
        <aside style={{ width: '250px', background: '#f4f4f4', padding: '10px' }}>
            <h3>Usuarios</h3>
            <ul>
                {usuarios.map((usuario) => (
                    <li key={usuario.id} onClick={() => onSelectUsuario(usuario)}>
                        {usuario.name}
                    </li>
                ))}
            </ul>
        </aside>
    );
}
