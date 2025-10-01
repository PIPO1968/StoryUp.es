import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, Calendar, User, ExternalLink } from 'lucide-react';

export default function News() {
    const news = [
        {
            id: 1,
            title: 'Nuevo Sistema de Trofeos Disponible',
            content: 'Hemos lanzado un sistema completamente renovado de trofeos y logros. Ahora puedes conseguir reconocimientos por tu participación activa en la comunidad.',
            author: 'Administración StoryUp',
            date: '2024-01-15',
            category: 'Actualización',
            isImportant: true
        },
        {
            id: 2,
            title: 'Concurso de Escritura Creativa',
            content: 'Participa en nuestro concurso mensual de escritura creativa. Los ganadores recibirán trofeos especiales y reconocimiento en la comunidad.',
            author: 'Prof. María García',
            date: '2024-01-14',
            category: 'Concurso',
            isImportant: false
        },
        {
            id: 3,
            title: 'Nuevas Funciones de Chat',
            content: 'El sistema de chat ha sido mejorado con nuevas funciones de formato de texto, envío de imágenes y videos de YouTube.',
            author: 'Equipo Técnico',
            date: '2024-01-13',
            category: 'Mejora',
            isImportant: false
        },
        {
            id: 4,
            title: 'Mantenimiento Programado',
            content: 'El próximo sábado realizaremos mantenimiento en la plataforma entre las 2:00 y 4:00 AM. Durante este tiempo el servicio no estará disponible.',
            author: 'Administración StoryUp',
            date: '2024-01-12',
            category: 'Mantenimiento',
            isImportant: true
        },
        {
            id: 5,
            title: 'Celebramos 1000 Usuarios',
            content: '¡Hemos alcanzado los 1000 usuarios registrados! Gracias a toda la comunidad por hacer de StoryUp un lugar increíble para compartir y aprender.',
            author: 'Administración StoryUp',
            date: '2024-01-10',
            category: 'Celebración',
            isImportant: false
        }
    ];

    const getCategoryColor = (category: string) => {
        const colors = {
            'Actualización': 'bg-blue-100 text-blue-800',
            'Concurso': 'bg-green-100 text-green-800',
            'Mejora': 'bg-purple-100 text-purple-800',
            'Mantenimiento': 'bg-orange-100 text-orange-800',
            'Celebración': 'bg-pink-100 text-pink-800'
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Newspaper className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold">Noticias y Anuncios</h1>
            </div>

            {/* Noticias importantes destacadas */}
            <div className="space-y-4">
                {news.filter(item => item.isImportant).map((item) => (
                    <Card key={item.id} className="border-l-4 border-l-red-500 bg-red-50">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-red-100 text-red-800">Importante</Badge>
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
                                        <span>{formatDate(item.date)}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Leer más
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Resto de noticias */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Todas las Noticias
                </h2>

                {news.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {item.isImportant && (
                                            <Badge className="bg-red-100 text-red-800">Importante</Badge>
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
                                        <span>{formatDate(item.date)}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Leer más
                                </Button>
                            </div>
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