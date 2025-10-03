import React, { useState } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { saveStory } from '../lib/storiesManager';

const CreateStoryPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        anonymous: false
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        setLoading(true);

        try {
            // Crear historia usando el sistema de gestión
            const newStory = await saveStory({
                title: formData.title.trim(),
                content: formData.content.trim(),
                author: {
                    id: user?.id || user?.username,
                    username: user?.username,
                    name: user?.name
                },
                likes: 0,
                likedBy: []
            });

            setSuccess(true);

            // Redirigir a la lista de historias después de 2 segundos
            setTimeout(() => {
                navigate('/stories');
            }, 2000);

        } catch (error) {
            console.error('Error al crear la historia:', error);
            alert('Error al crear la historia. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-green-800 mb-2">¡Historia creada exitosamente!</h2>
                    <p className="text-green-600 mb-4">Redirigiendo a la sección de historias...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                ✍️ Crear Nueva Historia
                            </h1>
                            <p className="text-gray-600">
                                Comparte tu creatividad con la comunidad StoryUp.es
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Título */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Título de la Historia *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Escribe un título atractivo para tu historia..."
                                    maxLength={100}
                                    required
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {formData.title.length}/100 caracteres
                                </div>
                            </div>

                            {/* Contenido */}
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contenido de la Historia *
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={12}
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                                    placeholder="Escribe tu historia aquí... Sé creativo y educativo."
                                    required
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {formData.content.length} caracteres
                                </div>
                            </div>

                            {/* Opción anónima */}
                            <div className="bg-gray-50 p-4 rounded-md">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="anonymous"
                                        name="anonymous"
                                        checked={formData.anonymous}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                                        Publicar de forma anónima
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 ml-6">
                                    Tu historia aparecerá como "Anónimo" sin mostrar tu nombre de usuario.
                                </p>
                            </div>

                            {/* Información del autor */}
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                        <span className="text-blue-600">👤</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-800">
                                            Autor: {formData.anonymous ? 'Anónimo' : user?.username || user?.name}
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            {formData.anonymous ?
                                                'Tu identidad no será revelada' :
                                                `Publicando como ${user?.role === 'admin' ? 'Administrador' : 'Docente/Padre'}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/stories')}
                                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.title.trim() || !formData.content.trim()}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Publicando...' : 'Publicar Historia'}
                                </button>
                            </div>
                        </form>

                        {/* Consejos */}
                        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                            <h3 className="text-sm font-medium text-yellow-800 mb-2">💡 Consejos para una buena historia:</h3>
                            <ul className="text-xs text-yellow-700 space-y-1">
                                <li>• Usa un título claro y atractivo</li>
                                <li>• Incluye una moraleja o enseñanza educativa</li>
                                <li>• Revisa la ortografía y gramática</li>
                                <li>• Mantén un lenguaje apropiado y respetuoso</li>
                                <li>• Sé original y creativo</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStoryPage;

