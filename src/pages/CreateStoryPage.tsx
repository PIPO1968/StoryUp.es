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
        type: 'Ficticia' as 'Real' | 'Ficticia',
        theme: 'Aventura' as 'Aventura' | 'Fantasía' | 'Corazón' | 'Terror' | 'Educativa' | 'CONCURSO',
        anonymous: false
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    // Funciones para formateo de texto
    const applyTextFormat = (format: string) => {
        const textarea = document.getElementById('content') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);

        let formattedText = '';

        switch (format) {
            case 'bold':
                formattedText = selectedText ? `**${selectedText}**` : '**texto en negrita**';
                break;
            case 'italic':
                formattedText = selectedText ? `*${selectedText}*` : '*texto en cursiva*';
                break;
            case 'underline':
                formattedText = selectedText ? `<u>${selectedText}</u>` : '<u>texto subrayado</u>';
                break;
            case 'color':
                formattedText = selectedText ? `<span style="color: ${selectedColor}">${selectedText}</span>` : `<span style="color: ${selectedColor}">texto en color</span>`;
                break;
        }

        const newContent = beforeText + formattedText + afterText;
        setFormData(prev => ({ ...prev, content: newContent }));

        // Refocus and set cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
        }, 0);
    };

    // Función para subir imágenes
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                alert(`El archivo "${file.name}" no es una imagen válida.`);
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert(`La imagen "${file.name}" es demasiado grande. Máximo 5MB permitido.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                setUploadedImages(prev => [...prev, imageUrl]);

                // Insertar la imagen en el contenido con nombre del archivo
                const imageName = file.name.split('.')[0];
                const imageMarkdown = `\n![${imageName}](${imageUrl})\n`;
                setFormData(prev => ({
                    ...prev,
                    content: prev.content + imageMarkdown
                }));
            };
            reader.onerror = () => {
                alert(`Error al cargar la imagen "${file.name}".`);
            };
            reader.readAsDataURL(file);
        });

        // Limpiar el input para permitir subir la misma imagen otra vez
        e.target.value = '';
    };

    // Función para eliminar imagen
    const removeImage = (imageUrl: string) => {
        setUploadedImages(prev => prev.filter(img => img !== imageUrl));
        setFormData(prev => ({
            ...prev,
            content: prev.content.replace(new RegExp(`!\\[.*?\\]\\(${imageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g'), '')
        }));
    };

    // Función para procesar el contenido de vista previa (igual que en StoryDetailPage)
    const processContentPreview = (content: string) => {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-md my-4" />')
            .split('\n')
            .map(line => line.trim() ? `<p>${line}</p>` : '<br>')
            .join('');
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
                type: formData.type,
                theme: formData.theme,
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

                            {/* Tipo de Historia */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Historia *
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="Ficticia">📚 Ficticia</option>
                                    <option value="Real">✨ Real</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Selecciona si tu historia está basada en hechos reales o es ficción.
                                </p>
                            </div>

                            {/* Tema de la Historia */}
                            <div>
                                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tema de la Historia *
                                </label>
                                <select
                                    id="theme"
                                    name="theme"
                                    value={formData.theme}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="Aventura">🗺️ Aventura</option>
                                    <option value="Fantasía">🧙‍♂️ Fantasía</option>
                                    <option value="Corazón">💖 Corazón</option>
                                    <option value="Terror">👻 Terror</option>
                                    <option value="Educativa">📖 Educativa</option>
                                    <option value="CONCURSO">🏆 CONCURSO</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Elige la categoría que mejor represente tu historia.
                                </p>
                            </div>

                            {/* Contenido con Editor Enriquecido */}
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contenido de la Historia *
                                </label>

                                {/* Barra de herramientas del editor */}
                                <div className="border border-gray-300 rounded-t-md bg-gray-50 p-3 flex flex-wrap items-center gap-2">
                                    {/* Botones de formato */}
                                    <button
                                        type="button"
                                        onClick={() => applyTextFormat('bold')}
                                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold text-sm"
                                        title="Negrita"
                                    >
                                        B
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyTextFormat('italic')}
                                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 italic text-sm"
                                        title="Cursiva"
                                    >
                                        I
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyTextFormat('underline')}
                                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 underline text-sm"
                                        title="Subrayado"
                                    >
                                        U
                                    </button>

                                    {/* Separador */}
                                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                                    {/* Selector de color */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={selectedColor}
                                            onChange={(e) => setSelectedColor(e.target.value)}
                                            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                                            title="Color de texto"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => applyTextFormat('color')}
                                            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                                            title="Aplicar color"
                                        >
                                            🎨
                                        </button>
                                    </div>

                                    {/* Separador */}
                                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                                    {/* Subir imagen */}
                                    <label className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm cursor-pointer flex items-center gap-1">
                                        📷 Imagen
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>

                                    {/* Separador */}
                                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                                    {/* Vista previa */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(!showPreview)}
                                        className={`px-3 py-1 border border-gray-300 rounded text-sm ${showPreview
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white hover:bg-gray-100'
                                            }`}
                                        title="Vista previa"
                                    >
                                        👁️ {showPreview ? 'Editor' : 'Preview'}
                                    </button>
                                </div>

                                {/* Área de texto o vista previa */}
                                {showPreview ? (
                                    <div className="w-full min-h-[300px] px-4 py-3 border-l border-r border-b border-gray-300 rounded-b-md bg-gray-50">
                                        <div className="prose prose-lg max-w-none">
                                            {formData.content ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: processContentPreview(formData.content)
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-gray-400 italic">
                                                    La vista previa de tu historia aparecerá aquí...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <textarea
                                        id="content"
                                        name="content"
                                        rows={12}
                                        value={formData.content}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-l border-r border-b border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                                        placeholder="Escribe tu historia aquí... Usa los botones de formato para dar estilo a tu texto."
                                        required
                                    />
                                )}

                                {/* Información y preview de imágenes */}
                                <div className="flex justify-between items-start mt-2">
                                    <div className="text-right text-sm text-gray-500">
                                        {formData.content.length} caracteres
                                    </div>

                                    {uploadedImages.length > 0 && (
                                        <div className="flex-1 ml-4">
                                            <p className="text-sm text-gray-600 mb-2">Imágenes subidas:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {uploadedImages.map((imageUrl, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Imagen ${index + 1}`}
                                                            className="w-20 h-20 object-cover rounded border"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(imageUrl)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                            title="Eliminar imagen"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Ayuda de formato */}
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                                    <strong>💡 Consejos de formato:</strong>
                                    <ul className="mt-1 space-y-1 text-xs">
                                        <li>• Selecciona texto y haz clic en <strong>B</strong>, <em>I</em>, o <u>U</u> para aplicar formato</li>
                                        <li>• Elige un color y aplícalo al texto seleccionado</li>
                                        <li>• Las imágenes se insertarán automáticamente en tu historia</li>
                                        <li>• Puedes usar markdown: **negrita**, *cursiva*</li>
                                        <li>• Las imágenes soportadas: JPG, PNG, GIF, WebP</li>
                                    </ul>
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

