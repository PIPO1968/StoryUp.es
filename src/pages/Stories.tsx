import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Filter, Heart, MessageCircle, Share } from 'lucide-react';

export default function Stories() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'Todas' },
        { id: 'academic', label: 'Académicas' },
        { id: 'social', label: 'Sociales' },
        { id: 'personal', label: 'Personales' },
        { id: 'creative', label: 'Creativas' }
    ];

    const stories = [
        {
            id: 1,
            user: { name: 'Ana García', username: 'ana_garcia', avatar: '/assets/logo-grande.png.png' },
            content: 'Hoy aprendí algo increíble en clase de ciencias. Los experimentos con química son fascinantes.',
            category: 'academic',
            likes: 15,
            comments: 3,
            timestamp: '2 horas',
            image: null
        },
        {
            id: 2,
            user: { name: 'Carlos Ruiz', username: 'carlos_ruiz', avatar: '/assets/logo-grande.png.png' },
            content: 'Participé en el concurso de matemáticas y quedé en segundo lugar. ¡Muy emocionado!',
            category: 'academic',
            likes: 28,
            comments: 7,
            timestamp: '4 horas',
            image: null
        },
        {
            id: 3,
            user: { name: 'María López', username: 'maria_lopez', avatar: '/assets/logo-grande.png.png' },
            content: 'Organizamos una actividad de voluntariado para ayudar a la comunidad. ¡Fue increíble!',
            category: 'social',
            likes: 42,
            comments: 12,
            timestamp: '1 día',
            image: null
        }
    ];

    const filteredStories = stories.filter(story => {
        const matchesSearch = story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            story.user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold">Historias de la Comunidad</h1>
            </div>

            {/* Filtros y búsqueda */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Buscador */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar historias o usuarios..."
                                className="pl-10"
                            />
                        </div>

                        {/* Filtro por categoría */}
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    {category.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de historias */}
            <div className="space-y-4">
                {filteredStories.length > 0 ? (
                    filteredStories.map((story) => (
                        <Card key={story.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                {/* Header de la historia */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={story.user.avatar}
                                            alt={story.user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{story.user.name}</h3>
                                            <p className="text-sm text-gray-500">@{story.user.username} • {story.timestamp}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">
                                        {categories.find(c => c.id === story.category)?.label}
                                    </Badge>
                                </div>

                                {/* Contenido */}
                                <div className="mb-4">
                                    <p className="text-gray-700 leading-relaxed">{story.content}</p>
                                    {story.image && (
                                        <img
                                            src={story.image}
                                            alt="Historia"
                                            className="w-full h-64 object-cover rounded-lg mt-3"
                                        />
                                    )}
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center gap-6 pt-4 border-t">
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                        <Heart className="h-4 w-4" />
                                        <span>{story.likes}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        <span>{story.comments}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                        <Share className="h-4 w-4" />
                                        <span>Compartir</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                No se encontraron historias
                            </h3>
                            <p className="text-gray-500">
                                Intenta cambiar los filtros o términos de búsqueda
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}