import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = 'https://storyup-backend.onrender.com/api';

export default function StoryDetailPage() {
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await fetch(`${API_URL}/stories/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al cargar la historia');
                setStory(data.story || null);
            } catch (err) {
                setError('No se pudo cargar la historia');
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Cargando historia...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!story) return <div className="p-8 text-center text-gray-500">Historia no encontrada.</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Link to="/historias" className="text-blue-600 hover:underline text-sm">← Volver a historias</Link>
            <h1 className="text-2xl font-bold mb-2 mt-4">{story.title}</h1>
            <div className="text-sm text-gray-600 mb-4">por {story.authorName || story.username || 'Anónimo'}</div>
            <div className="bg-white rounded shadow p-4 mb-4 whitespace-pre-line">{story.content}</div>
            {/* Aquí puedes añadir más detalles: fecha, likes, comentarios, etc. */}
        </div>
    );
}
