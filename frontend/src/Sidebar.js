import React from 'react';
import './Sidebar.css';

function Sidebar() {
    return (
        <aside className="sidebar-fixed">
            <nav>
                <ul>
                    <li><a href="/historias">📖 Historias</a></li>
                    <li><a href="/crear-historia">✍️ Crea tu Historia</a></li>
                    <li><a href="/estadisticas">📊 Estadísticas</a></li>
                    <li><a href="/noticias">📰 Noticias</a></li>
                    <li><a href="/concursos">🏆 Concursos</a></li>
                    <li><a href="/trofeos">🥇 Trofeos</a></li>
                    <li><a href="/aprende-con-pipo">🎓 Aprende con Pipo</a></li>
                    <li><a href="/perfil">👤 Perfil</a></li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
