import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, Award, Star, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContestData {
    id: string;
    title: string;
    description: string;
    creatorUsername: string;
    startDate: string;
    endDate: string;
    status: string;
    winner?: string;
}

interface TrophyPublic {
    id: number;
    image: string;
    name: string;
    condition: string;
    description: string;
    likes: number;
}

export default function ContestsPage() {
    const [activeContests, setActiveContests] = useState<ContestData[]>([]);
    const [finishedContests, setFinishedContests] = useState<ContestData[]>([]);
    const [trophies, setTrophies] = useState<TrophyPublic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/contests/active')
            .then(res => res.json())
            .then(data => setActiveContests(data.contests || []));
        fetch('/api/contests/finished')
            .then(res => res.json())
            .then(data => setFinishedContests(data.contests || []));
        fetch('/api/trophiesPublic')
            .then(res => res.json())
            .then(data => setTrophies(data.trophies || []));
        setLoading(false);
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando concursos y trofeos...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                    <Trophy className="mr-3 text-yellow-600" />
                    Concursos y Trofeos
                </h1>
                <p className="text-gray-600 mt-2">
                    Participa en concursos creados por Padres/Docentes y gana trofeos por tu creatividad
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Concursos Activos */}
                <Card className="lg:col-span-1">
                    <CardHeader className="bg-green-50">
                        <CardTitle className="text-lg text-green-700 flex items-center">
                            <Calendar className="mr-2 w-5 h-5" />
                            Concursos Activos
                            <span className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                                {activeContests.length}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {activeContests.length === 0 ? (
                            <div className="text-center py-8">
                                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">
                                    No hay concursos activos
                                </p>
                                <p className="text-gray-400 text-xs mt-2">
                                    Los Padres/Docentes pueden crear concursos desde su perfil
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {activeContests.map((contest) => (
                                    <div key={contest.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                                        <details>
                                            <summary className="font-semibold text-gray-900 cursor-pointer hover:underline">{contest.title}</summary>
                                            <div className="pl-2 mt-2">
                                                <p className="text-sm text-gray-600">{contest.description}</p>
                                                <div className="mt-3 space-y-1">
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <User className="w-3 h-3 mr-1" />
                                                        Creado por: <span className="font-medium ml-1">{contest.creatorUsername}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Desde: {formatDate(contest.startDate)}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Hasta: {formatDate(contest.endDate)}
                                                    </div>
                                                </div>
                                                <div className="mt-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs inline-block">
                                                    📅 En período de inscripción
                                                </div>
                                            </div>
                                        </details>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Concursos Terminados */}
                <Card className="lg:col-span-1">
                    <CardHeader className="bg-blue-50">
                        <CardTitle className="text-lg text-blue-700 flex items-center">
                            <Award className="mr-2 w-5 h-5" />
                            Concursos Terminados
                            <span className="ml-auto bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                                {finishedContests.length}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {finishedContests.length === 0 ? (
                            <div className="text-center py-8">
                                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">
                                    No hay concursos terminados
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {finishedContests.map((contest) => (
                                    <div key={contest.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                        <details>
                                            <summary className="font-semibold text-gray-900 cursor-pointer hover:underline flex items-center">
                                                {contest.title}
                                                {contest.winner && (
                                                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">🏅 Ganador: {contest.winner}</span>
                                                )}
                                            </summary>
                                            <div className="pl-2 mt-2">
                                                <p className="text-sm text-gray-600">{contest.description}</p>
                                                <div className="mt-3 space-y-1">
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <User className="w-3 h-3 mr-1" />
                                                        Creado por: <span className="font-medium ml-1">{contest.creatorUsername}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Desde: {formatDate(contest.startDate)}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Hasta: {formatDate(contest.endDate)}
                                                    </div>
                                                </div>
                                                <div className="mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs inline-block">
                                                    🏆 Concurso finalizado
                                                </div>
                                            </div>
                                        </details>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Trofeos StoryUp */}
                <Card className="lg:col-span-1">
                    <CardHeader className="bg-yellow-50">
                        <CardTitle className="text-lg text-yellow-700 flex items-center">
                            <Trophy className="mr-2 w-5 h-5" />
                            Trofeos StoryUp
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {trophies.map((trophy) => (
                                <Card key={trophy.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col items-center">
                                            <img src={`/assets/trophies/${trophy.image}`} alt={trophy.name} className="w-16 h-16 mb-2" />
                                            <h3 className="font-semibold text-base text-center mb-1">{trophy.name}</h3>
                                            <Badge variant="outline" className="mb-2 text-xs">{trophy.likes > 0 ? `+${trophy.likes}` : trophy.likes}</Badge>
                                            <p className="text-xs text-blue-700 font-semibold text-center mb-1">{trophy.condition}</p>
                                            <p className="text-xs text-muted-foreground text-center">{trophy.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

