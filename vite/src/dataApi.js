// Ejemplo de API de datos para StoryUp.es
const API_URL = 'https://storyup-backend.onrender.com/api';
export async function fetchData(url) {
    // Si la url no empieza por http, anteponer API_URL
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    const res = await fetch(fullUrl);
    if (!res.ok) throw new Error('Error al obtener datos');
    return res.json();
}
