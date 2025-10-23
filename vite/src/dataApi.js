// Ejemplo de API de datos para StoryUp.es
export async function fetchData(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener datos');
    return res.json();
}
