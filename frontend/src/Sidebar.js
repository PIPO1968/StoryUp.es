import React from 'react';
import './Sidebar.css';

function Sidebar() {
    return (
        <aside className="sidebar">
            {/* Aquí puedes poner los enlaces o iconos del menú lateral */}
            <nav>
                <ul>
                    <li><a href="/perfil">Perfil</a></li>
                    <li><a href="/chat">Chat</a></li>
                    <li><a href="/grupos">Grupos</a></li>
                    <li><a href="/ajustes">Ajustes</a></li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
