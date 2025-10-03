import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ImageIcon, Type, Eye, Users, Lock } from 'lucide-react';

const CreateStoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        visibility: 'public' as 'public' | 'friends' | 'private'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleVisibilityChange = (value: string) => {
        setFormData(prev => ({ ...prev, visibility: value as 'public' | 'friends' | 'private' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones
        if (!formData.content.trim()) {
            setError('El contenido de la historia es obligatorio');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('/api/stories', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formData.title.trim() || null,
                    content: formData.content.trim(),
                    image_url: formData.imageUrl.trim() || null,
                    visibility: formData.visibility
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear la historia');
            }

            setSuccess(true);
            // Redirigir al feed después de 2 segundos
            setTimeout(() => {
                navigate('/feed');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Error al crear la historia');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-green-600 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">¡Historia Creada!</h2>
                    <p className="text-gray-600">Tu historia se ha publicado exitosamente. Redirigiendo al feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/feed')}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Volver</span>
                    </Button>
                    <h1 className="text-2xl font-bold text-blue-600">Nueva Historia</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Type className="w-5 h-5" />
                            <span>Crear Nueva Historia</span>
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            Comparte tu historia con la comunidad de StoryUp
                        </p>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Título */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Título (opcional)
                                </label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="Un título llamativo para tu historia..."
                                    className="w-full"
                                />
                            </div>

                            {/* Contenido */}
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contenido *
                                </label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                    placeholder="Escribe tu historia aquí... ¿Qué quieres compartir hoy?"
                                    className="w-full min-h-[150px] resize-y"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.content.length} caracteres
                                </p>
                            </div>

                            {/* URL de imagen */}
                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Imagen (opcional)</span>
                                </label>
                                <Input
                                    id="imageUrl"
                                    name="imageUrl"
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="https://ejemplo.com/mi-imagen.jpg"
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Pega la URL de una imagen para acompañar tu historia
                                </p>
                            </div>

                            {/* Visibilidad */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Visibilidad
                                </label>
                                <Select value={formData.visibility} onValueChange={handleVisibilityChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona la visibilidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">
                                            <div className="flex items-center space-x-2">
                                                <Eye className="w-4 h-4" />
                                                <span>Público - Todos pueden ver</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="friends">
                                            <div className="flex items-center space-x-2">
                                                <Users className="w-4 h-4" />
                                                <span>Amigos - Solo mis contactos</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="private">
                                            <div className="flex items-center space-x-2">
                                                <Lock className="w-4 h-4" />
                                                <span>Privado - Solo yo</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Vista previa si hay imagen */}
                            {formData.imageUrl && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vista previa de imagen
                                    </label>
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Vista previa"
                                            className="w-full max-h-64 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Botones */}
                            <div className="flex items-center justify-between pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/feed')}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={loading || !formData.content.trim()}
                                    className="px-8"
                                >
                                    {loading ? 'Publicando...' : 'Publicar Historia'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateStoryPage;