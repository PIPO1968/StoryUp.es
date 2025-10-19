// Utilidad para crear datos genéricos desde el frontend
import { getCookie } from './cookieUtils';

export async function crearDato({ type, content, meta }) {
    const API_URL = process.env.REACT_APP_API_URL || 'https://storyup-backend.onrender.com/api';
    const token = getCookie('token');
    const res = await fetch(`${API_URL}/data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type, content, meta })
    });
    if (!res.ok) throw new Error('Error al crear dato');
    return await res.json();
}

export async function consultarDatos({ type, userId, limit = 50, skip = 0 }) {
    const API_URL = process.env.REACT_APP_API_URL || 'https://storyup-backend.onrender.com/api';
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (userId) params.append('userId', userId);
    params.append('limit', limit);
    params.append('skip', skip);
    const res = await fetch(`${API_URL}/data?${params.toString()}`);
    if (!res.ok) throw new Error('Error al consultar datos');
    return await res.json();
}
