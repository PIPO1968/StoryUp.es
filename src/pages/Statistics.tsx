import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    Users,
    Trophy,
    MessageCircle,
    Heart,
    BookOpen,
    TrendingUp,
    Calendar
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

export default function Statistics() {
    const user = getCurrentUser();

    const stats = {
        totalStories: 24,
        totalLikes: 156,
        totalComments: 89,
        totalFollowers: user?.followers || 0,
        totalFollowing: user?.following || 0,
        totalTrophies: user?.trophies.length || 0,
        weeklyActivity: [
            { day: 'Lun', stories: 3, likes: 12 },
            { day: 'Mar', stories: 5, likes: 18 },
            { day: 'Mié', stories: 2, likes: 8 },
            { day: 'Jue', stories: 4, likes: 15 },
            { day: 'Vie', stories: 6, likes: 22 },
            { day: 'Sáb', stories: 3, likes: 14 },
            { day: 'Dom', stories: 1, likes: 5 }
        ]
    };

    const achievements = [
        { name: 'Escritor Activo', description: 'Publicaste 20+ historias', progress: 80, icon: BookOpen },
        { name: 'Influencer', description: 'Consigue 100+ likes', progress: 100, icon: Heart },
        { name: 'Comunicador', description: 'Recibe 50+ comentarios', progress: 90, icon: MessageCircle },
        { name: 'Líder Social', description: 'Consigue 200+ seguidores', progress: 45, icon: Users }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold">Mis Estadísticas</h1>
            </div>

            {/* Estadísticas principales */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{stats.totalStories}</p>
                        <p className="text-sm text-gray-600">Historias</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{stats.totalLikes}</p>
                        <p className="text-sm text-gray-600">Likes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <MessageCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{stats.totalComments}</p>
                        <p className="text-sm text-gray-600">Comentarios</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{stats.totalFollowers}</p>
                        <p className="text-sm text-gray-600">Seguidores</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{stats.totalFollowing}</p>
                        <p className="text-sm text-gray-600">Siguiendo</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{stats.totalTrophies}</p>
                        <p className="text-sm text-gray-600">Trofeos</p>
                    </CardContent>
                </Card>
            </div>

            {/* Actividad semanal */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Actividad Semanal
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-4">
                        {stats.weeklyActivity.map((day, index) => (
                            <div key={index} className="text-center">
                                <p className="text-sm font-medium mb-2">{day.day}</p>
                                <div className="space-y-2">
                                    <div className="bg-blue-100 rounded-lg p-2">
                                        <p className="text-lg font-bold text-blue-600">{day.stories}</p>
                                        <p className="text-xs text-blue-600">Historias</p>
                                    </div>
                                    <div className="bg-red-100 rounded-lg p-2">
                                        <p className="text-lg font-bold text-red-600">{day.likes}</p>
                                        <p className="text-xs text-red-600">Likes</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Logros y progreso */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Progreso de Logros
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        {achievements.map((achievement, index) => {
                            const Icon = achievement.icon;
                            return (
                                <div key={index} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <h3 className="font-semibold">{achievement.name}</h3>
                                                <p className="text-sm text-gray-600">{achievement.description}</p>
                                            </div>
                                        </div>
                                        <Badge variant={achievement.progress === 100 ? 'default' : 'secondary'}>
                                            {achievement.progress}%
                                        </Badge>
                                    </div>
                                    <Progress value={achievement.progress} className="h-2" />
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Ranking en la comunidad */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Historias del Mes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { title: 'Mi experiencia en el laboratorio', likes: 45, position: 1 },
                                { title: 'Reflexiones sobre el futuro', likes: 38, position: 2 },
                                { title: 'Proyecto de ciencias', likes: 32, position: 3 }
                            ].map((story, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline">#{story.position}</Badge>
                                        <p className="font-medium">{story.title}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Heart className="h-4 w-4 text-red-500" />
                                        <span className="text-sm">{story.likes}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Mi Posición en Rankings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Historias Publicadas</span>
                                <Badge>#12 de 150</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Likes Recibidos</span>
                                <Badge>#8 de 150</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Engagement</span>
                                <Badge>#15 de 150</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Trofeos Conseguidos</span>
                                <Badge>#20 de 150</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}