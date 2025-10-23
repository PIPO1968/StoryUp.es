

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../App';

function CrearHistoria() {
    // const { user } = useAuth(); // Descomenta si tienes contexto de usuario
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'Ficticia',
        theme: 'Aventura',
        anonymous: false
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result;
                setUploadedImages(prev => [...prev, imageUrl]);
                setFormData(prev => ({
                    ...prev,
                    content: prev.content + `\n![${file.name}](${imageUrl})\n`
                }));
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Aquí deberías llamar a tu API para guardar la historia
        setTimeout(() => {
            setSuccess(true);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
            <h1 className="text-2xl font-bold mb-4">Crear Historia</h1>
            {success ? (
                <div className="text-green-600 font-semibold mb-4">¡Historia publicada con éxito!</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={8}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="border rounded px-2 py-1">
                                <option value="Real">Real</option>
                                <option value="Ficticia">Ficticia</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                            <select name="theme" value={formData.theme} onChange={handleChange} className="border rounded px-2 py-1">
                                <option value="Aventura">Aventura</option>
                                <option value="Fantasía">Fantasía</option>
                                <option value="Corazón">Corazón</option>
                                <option value="Terror">Terror</option>
                                <option value="Educativa">Educativa</option>
                                <option value="CONCURSO">CONCURSO</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="anonymous"
                                checked={formData.anonymous}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Escribir como anónimo
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {uploadedImages.map((img, i) => (
                                <img key={i} src={img} alt="subida" className="w-16 h-16 object-cover rounded" />
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => navigate('/feed')} className="flex-1 bg-gray-200 rounded px-4 py-2">Cancelar</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white rounded px-4 py-2">
                            {loading ? 'Publicando...' : 'Publicar Historia'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default CrearHistoria;
