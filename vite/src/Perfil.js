import React, { useState, useEffect } from 'react';
import { getCookie } from './cookieUtils';
import ChatSidebar from './ChatSidebar';

function Perfil({ usuario, setUsuario }) {
    const [avatar, setAvatar] = useState(usuario?.avatar || '');
    const [loading, setLoading] = useState(false);
    // ...resto del código original copiado fielmente del frontend
}

export default Perfil;
