import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PenTool, Image, Send } from 'lucide-react';
import { getCurrentUser } from '../lib/auth';
import { toast } from 'sonner';

export default function CreateStory() {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser().then(user => {
            setUser({
                id: user.id,
                username: user.username || '',
                name: user.name || '',
                avatar: user.avatar || '',
                bio: user.bio || '',
                userType: user.userType || 'user',
            });
        });
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error('Por favor escribe algo para tu historia');
            return;
        }

        setIsLoading(true);

        // Aquí se implementaría la lógica para guardar la historia
        setTimeout(() => {
            toast.success('Historia publicada exitosamente');
            navigate('/feed');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PenTool className="h-5 w-5" />
                        Crear Nueva Historia
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Área de texto */}
                        <div>
                            <Label htmlFor="content">¿Qué quieres compartir?</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Comparte tu historia, pensamiento o experiencia..."
                                className="min-h-32 mt-2"
                                maxLength={500}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {content.length}/500 caracteres
                            </p>
                        </div>

                        {/* Subir imagen */}
                        <div>
                            <Label htmlFor="image-upload">Imagen (opcional)</Label>
                            <div className="mt-2">
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                    className="w-full"
                                >
                                    <Image className="h-4 w-4 mr-2" />
                                    {image ? 'Cambiar imagen' : 'Añadir imagen'}
                                </Button>
                            </div>

                            {image && (
                                <div className="mt-4">
                                    <img
                                        src={image}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setImage(null)}
                                        className="mt-2"
                                    >
                                        Eliminar imagen
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Vista previa del usuario */}
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={user?.avatar}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-medium">{user?.name}</p>
                                    <p className="text-sm text-gray-500">@{user?.username}</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                {content || 'Tu historia aparecerá aquí...'}
                            </p>
                            {image && (
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded-lg mt-3"
                                />
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/feed')}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={!content.trim() || isLoading}
                                className="flex-1"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                {isLoading ? 'Publicando...' : 'Publicar Historia'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

