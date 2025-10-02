import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrophyCard } from '@/components/TrophyCard';
import { Trophy as TrophyType } from '@/lib/types';

export default function Trophies() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<any | null>(null); // Eliminado: DatabaseUser
    const [earnedTrophies] = useState<TrophyType[]>([]); // Eliminado: mockTrophies

    // Trofeos disponibles pero no ganados
    const availableTrophies: TrophyType[] = [
        {
            id: '5',
            name: 'Conversador',
            description: 'Envía 50 mensajes en el chat',
            icon: '💬',
            color: 'bg-purple-500',
            earnedAt: new Date()
        },
        {
            id: '6',
            name: 'Influencer',
            description: 'Consigue 100 likes en total',
            icon: '🌟',
            color: 'bg-pink-500',
            earnedAt: new Date()
        },
        {
            id: '7',
            name: 'Colaborador',
            description: 'Comenta en 20 historias diferentes',
            icon: '🤝',
            color: 'bg-green-500',
            earnedAt: new Date()
        }
    ];

    useEffect(() => {
        // Simular usuario actual
        setCurrentUser({ id: '1', name: 'Usuario Demo' });
    }, []);

    if (!currentUser) return null;

    const totalTrophies = earnedTrophies.length + availableTrophies.length;
    const progressPercentage = (earnedTrophies.length / totalTrophies) * 100;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/feed')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        <h1 className="text-xl font-bold text-blue-600">Mis Trofeos</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Progress Overview */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-yellow-500" />
                            <span>Progreso de Trofeos</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {earnedTrophies.length} de {totalTrophies} trofeos conseguidos
                                </span>
                                <Badge variant="secondary">
                                    {Math.round(progressPercentage)}% completado
                                </Badge>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />

                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-500">{earnedTrophies.length}</div>
                                    <div className="text-sm text-gray-500">Conseguidos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-500">{availableTrophies.length}</div>
                                    <div className="text-sm text-gray-500">Por conseguir</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-500">
                                        {earnedTrophies.filter(t => {
                                            const daysSince = (new Date().getTime() - t.earnedAt.getTime()) / (1000 * 3600 * 24);
                                            return daysSince <= 7;
                                        }).length}
                                    </div>
                                    <div className="text-sm text-gray-500">Esta semana</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Earned Trophies */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <h2 className="text-lg font-semibold">Trofeos Conseguidos</h2>
                        </div>
                        <div className="space-y-3">
                            {earnedTrophies.map((trophy) => (
                                <TrophyCard key={trophy.id} trophy={trophy} />
                            ))}
                        </div>
                    </div>

                    {/* Available Trophies */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Trophy className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-semibold">Por Conseguir</h2>
                        </div>
                        <div className="space-y-3">
                            {availableTrophies.map((trophy) => (
                                <Card key={trophy.id} className="opacity-60 hover:opacity-80 transition-opacity">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-white text-xl">
                                                {trophy.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm text-gray-600">{trophy.name}</h3>
                                                <p className="text-xs text-gray-500">{trophy.description}</p>
                                                <Badge variant="outline" className="text-xs mt-1">
                                                    Bloqueado
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Achievement Tips */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>💡 Consejos para conseguir más trofeos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-blue-700">Sé activo</h4>
                                <p className="text-blue-600">Publica historias regularmente y participa en la comunidad</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <h4 className="font-semibold text-green-700">Interactúa</h4>
                                <p className="text-green-600">Comenta y da likes a las historias de tus compañeros</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <h4 className="font-semibold text-purple-700">Conecta</h4>
                                <p className="text-purple-600">Usa el chat para comunicarte con otros estudiantes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}