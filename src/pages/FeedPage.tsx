import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heart, MessageCircle, Share, Plus } from 'lucide-react';

interface Story {
    id: string;
    user_id: string;
    title: string;
    content: string;
    image_url?: string;
    visibility: 'public' | 'friends' | 'private';
    created_at: string;
    updated_at: string;
}

interface StoryWithUser extends Story {
    user: {
        id: string;
        username: string;
        name: string;
        email: string;
    };
    likes: number;
    comments: number;
    liked_by_user: boolean;
}

const FeedPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [stories, setStories] = useState<StoryWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('/api/stories', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar las historias');
            }

            const data = await response.json();
            setStories(data.stories || []);
        } catch (error) {
            console.error('Error cargando historias:', error);
            setError('Error al cargar las historias');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (storyId: string, isLiked: boolean) => {
        try {
            const token = localStorage.getItem('auth_token');
            const method = isLiked ? 'DELETE' : 'POST';

            const response = await fetch('/api/likes', {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ story_id: storyId })
            });

            if (response.ok) {
                // Actualizar el estado local
                setStories(prev => prev.map(story =>
                    story.id === storyId
                        ? {
                            ...story,
                            liked_by_user: !isLiked,
                            likes: isLiked ? story.likes - 1 : story.likes + 1
                        }
                        : story
                ));
            }
        } catch (error) {
            console.error('Error al dar like:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg">Cargando historias...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">StoryUp</h1>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/create')}
                            className="flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nueva Historia</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/chat')}
                            className="flex items-center space-x-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Chat</span>
                        </Button>

                        <div className="flex items-center space-x-2">
                            <span className="text-gray-700 text-sm">
                                {user?.name || user?.username}
                            </span>
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                            >
                                Salir
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {stories.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 mb-4">
                            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium">No hay historias aún</h3>
                            <p className="text-sm">¡Sé el primero en compartir una historia!</p>
                        </div>
                        <Button className="mt-4" onClick={() => navigate('/create')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Primera Historia
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {stories.map((story) => (
                            <Card key={story.id} className="w-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {(story.user.name || story.user.username).charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">
                                                {story.user.name || story.user.username}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                @{story.user.username} • {formatTime(story.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    {story.title && (
                                        <h2 className="font-bold text-lg mb-2">{story.title}</h2>
                                    )}

                                    <p className="text-gray-800 mb-4 whitespace-pre-line">
                                        {story.content}
                                    </p>

                                    {story.image_url && (
                                        <div className="mb-4">
                                            <img
                                                src={story.image_url}
                                                alt="Historia"
                                                className="w-full rounded-lg max-h-96 object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex items-center space-x-6">
                                            <button
                                                onClick={() => handleLike(story.id, story.liked_by_user)}
                                                className={`flex items-center space-x-2 transition-colors ${story.liked_by_user
                                                        ? 'text-red-500'
                                                        : 'text-gray-500 hover:text-red-500'
                                                    }`}
                                            >
                                                <Heart
                                                    className={`w-5 h-5 ${story.liked_by_user ? 'fill-current' : ''
                                                        }`}
                                                />
                                                <span className="text-sm">{story.likes}</span>
                                            </button>

                                            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                                                <MessageCircle className="w-5 h-5" />
                                                <span className="text-sm">{story.comments}</span>
                                            </button>
                                        </div>

                                        <button className="text-gray-500 hover:text-gray-700 transition-colors">
                                            <Share className="w-5 h-5" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedPage;