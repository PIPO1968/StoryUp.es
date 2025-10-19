import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ onLogout }) {
    return (
        <aside className="sidebar-fixed">
            <nav>
                <ul>
                    <li><Link to="/historias">📖 Historias</Link></li>
                    <li><Link to="/crear-historia">✍️ Crea tu Historia</Link></li>
                    <li><Link to="/estadisticas">📊 Estadísticas</Link></li>
                    <li><Link to="/noticias">📰 Noticias</Link></li>
                    <li><Link to="/concursos">🏆 Concursos</Link></li>
                    <li><Link to="/trofeos">🥇 Trofeos</Link></li>
                    <li><Link to="/aprende-con-pipo">🎓 Aprende con Pipo</Link></li>
                    <li><Link to="/perfil">👤 Perfil</Link></li>
                    <li><button style={{ marginTop: 16, background: '#e57373', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }} onClick={onLogout}>Cerrar sesión</button></li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
