import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, Calendar, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../App';
const { user, token } = useAuth();
const jwtToken = token || '';
const [activeNewsId, setActiveNewsId] = useState<string | null>(null);
const [comments, setComments] = useState<{ [key: string]: any[] }>({});
const [commentInput, setCommentInput] = useState('');
const [commentLoading, setCommentLoading] = useState(false);
const [commentError, setCommentError] = useState('');

// Cargar comentarios de una noticia
const fetchComments = async (newsId: string) => {
    try {
        const res = await fetch(`/api/comments?storyId=${newsId}`);
        const data = await res.json();
        setComments(prev => ({ ...prev, [newsId]: data.comments || [] }));
    } catch {
        setComments(prev => ({ ...prev, [newsId]: [] }));
    }
};

// Abrir/cerrar comentarios y cargar si es necesario
const handleToggleComments = (newsId: string) => {
    if (activeNewsId === newsId) {
        setActiveNewsId(null);
    } else {
        setActiveNewsId(newsId);
        if (!comments[newsId]) fetchComments(newsId);
    }
};

// Enviar comentario
const handleAddComment = async (newsId: string) => {
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    setCommentError('');
    try {
        const res = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {})
            },
            body: JSON.stringify({ storyId: newsId, content: commentInput })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al comentar');
        setCommentInput('');
        fetchComments(newsId);
    } catch (err: any) {
        setCommentError(err.message);
    } finally {
        setCommentLoading(false);
    }
};



import React, { useEffect, useState } from 'react';

export default function News() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                if (!res.ok) throw new Error('Error al cargar noticias');
                const data = await res.json();
                setNews(data.news || []);
            } catch (err) {
                setError('No se pudieron cargar las noticias');
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const getCategoryColor = (category: string) => {
        const colors = {
            'StoryUp': 'bg-indigo-100 text-indigo-800',
            'Educación': 'bg-blue-100 text-blue-800',
            'Tecnología': 'bg-purple-100 text-purple-800',
            'Cultura': 'bg-pink-100 text-pink-800',
            'Deportes': 'bg-green-100 text-green-800',
            'Salud': 'bg-red-100 text-red-800',
            'Comunidad': 'bg-gray-100 text-gray-800',
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="text-center py-12">Cargando noticias...</div>;
    }
    if (error) {
        return <div className="text-center py-12 text-red-600">{error}</div>;
    }
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Newspaper className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold">Noticias y Anuncios</h1>
            </div>

            {/* Noticias importantes destacadas */}
            <div className="space-y-4">
                {news.filter((item: any) => item.featured).map((item: any) => (
                    <Card key={item.id} className="border-l-4 border-l-yellow-500 bg-yellow-50">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-yellow-100 text-yellow-800">Destacada</Badge>
                                        <Badge className={getCategoryColor(item.category)}>
                                            {item.category}
                                        </Badge>
                                    </div>
                                    <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-4 leading-relaxed">{item.content}</p>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>{item.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(item.created_at)}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleToggleComments(item.id)}>
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    Comentar
                                </Button>
                            </div>
                            {/* Área de comentarios */}
                            {activeNewsId === item.id && (
                                <div className="mt-6 border-t pt-4">
                                    <h4 className="font-semibold mb-2 text-gray-700">Comentarios</h4>
                                    {commentLoading && <div className="text-sm text-gray-500">Enviando comentario...</div>}
                                    {commentError && <div className="text-sm text-red-500">{commentError}</div>}
                                    <div className="space-y-3 mb-4">
                                        {(comments[item.id] || []).length === 0 && <div className="text-sm text-gray-400">No hay comentarios aún.</div>}
                                        {(comments[item.id] || []).map((c: any) => (
                                            <div key={c.id} className="bg-gray-50 border rounded p-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <User className="h-4 w-4" />
                                                    <span className="font-medium text-gray-700">{c.username || c.name}</span>
                                                    <span className="text-xs text-gray-400 ml-2">{formatDate(c.createdAt)}</span>
                                                </div>
                                                <div className="text-gray-700 text-sm">{c.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {user ? (
                                        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); handleAddComment(item.id); }}>
                                            <input
                                                type="text"
                                                value={commentInput}
                                                onChange={e => setCommentInput(e.target.value)}
                                                className="flex-1 border rounded px-3 py-2 text-sm"
                                                placeholder="Escribe un comentario..."
                                                disabled={commentLoading}
                                            />
                                            <Button type="submit" disabled={commentLoading || !commentInput.trim()}>
                                                Publicar
                                            </Button>
                                        </form>
                                    ) : (
                                        <div className="text-sm text-gray-500">Inicia sesión para comentar.</div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Resto de noticias */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Todas las Noticias
                </h2>

                {news.map((item: any) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {item.featured && (
                                            <Badge className="bg-yellow-100 text-yellow-800">Destacada</Badge>
                                        )}
                                        <Badge className={getCategoryColor(item.category)}>
                                            {item.category}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-4 leading-relaxed">{item.content}</p>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>{item.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(item.created_at)}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleToggleComments(item.id)}>
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    Comentar
                                </Button>
                            </div>
                            {/* Área de comentarios */}
                            {activeNewsId === item.id && (
                                <div className="mt-6 border-t pt-4">
                                    <h4 className="font-semibold mb-2 text-gray-700">Comentarios</h4>
                                    {commentLoading && <div className="text-sm text-gray-500">Enviando comentario...</div>}
                                    {commentError && <div className="text-sm text-red-500">{commentError}</div>}
                                    <div className="space-y-3 mb-4">
                                        {(comments[item.id] || []).length === 0 && <div className="text-sm text-gray-400">No hay comentarios aún.</div>}
                                        {(comments[item.id] || []).map((c: any) => (
                                            <div key={c.id} className="bg-gray-50 border rounded p-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <User className="h-4 w-4" />
                                                    <span className="font-medium text-gray-700">{c.username || c.name}</span>
                                                    <span className="text-xs text-gray-400 ml-2">{formatDate(c.createdAt)}</span>
                                                </div>
                                                <div className="text-gray-700 text-sm">{c.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {user ? (
                                        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); handleAddComment(item.id); }}>
                                            <input
                                                type="text"
                                                value={commentInput}
                                                onChange={e => setCommentInput(e.target.value)}
                                                className="flex-1 border rounded px-3 py-2 text-sm"
                                                placeholder="Escribe un comentario..."
                                                disabled={commentLoading}
                                            />
                                            <Button type="submit" disabled={commentLoading || !commentInput.trim()}>
                                                Publicar
                                            </Button>
                                        </form>
                                    ) : (
                                        <div className="text-sm text-gray-500">Inicia sesión para comentar.</div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Sección para educadores */}
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-800">Para Educadores</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-blue-700 mb-4">
                        ¿Eres padre o docente? Puedes crear tus propias noticias y anuncios
                        para tu comunidad desde tu perfil de educador.
                    </p>
                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                        Ir a mi perfil de educador
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

