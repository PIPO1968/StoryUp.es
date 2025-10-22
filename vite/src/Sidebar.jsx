
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
	return (
		<nav>
			<ul>
				<li><Link to="/historias">Historias</Link></li>
				<li><Link to="/crear-historia">Crea tu Historia</Link></li>
				<li><Link to="/estadisticas">Estadísticas</Link></li>
				<li><Link to="/noticias">Noticias</Link></li>
				<li><Link to="/concursos">Concursos</Link></li>
				<li><Link to="/trofeos">Trofeos</Link></li>
				<li><Link to="/aprende-con-pipo">Aprende con Pipo</Link></li>
				<li><Link to="/perfil">Perfil</Link></li>
			</ul>
		</nav>
	);
}

export default Sidebar;

