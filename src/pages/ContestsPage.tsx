import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, Award, Star } from 'lucide-react';


export default function ContestsPage() {
    const activeContests = [];
    const finishedContests = [];

    const allTrophies = [
        { name: 'Primer Escrito', description: 'Por crear tu primera historia', difficulty: 'Fácil', icon: '🏆' },
        { name: 'Escritor Popular', description: 'Obtener 10 likes', difficulty: 'Fácil', icon: '⭐' },
        { name: 'Narrador', description: 'Crear 5 historias', difficulty: 'Medio', icon: '📖' },
        { name: 'Estrella de la Comunidad', description: 'Obtener 50 likes', difficulty: 'Medio', icon: '🌟' },
        { name: 'Autor Prolífico', description: 'Crear 20 historias', difficulty: 'Difícil', icon: '✍️' },
        { name: 'Leyenda Literaria', description: 'Obtener 100 likes', difficulty: 'Difícil', icon: '👑' }
    ];

    return (
        
            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                        <Trophy className="mr-3 text-yellow-600" />
                        Concursos y Trofeos
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Participa en concursos y gana trofeos por tu creatividad
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Concursos Activos */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="bg-green-50">
                            <CardTitle className="text-lg text-green-700 flex items-center">
                                <Calendar className="mr-2 w-5 h-5" />
                                Concursos Activos
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
                                        Los docentes pueden crear concursos desde su perfil
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {activeContests.map((contest, index) => (
                                        <div key={index} className="border border-green-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900">{contest.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{contest.description}</p>
                                            <div className="mt-2 text-xs text-green-600">
                                                <strong>Clave:</strong> {contest.key}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {contest.startDate} - {contest.endDate}
                                            </div>
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
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {finishedContests.length === 0 ? (
                                <div className="text-center py-8">
                                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">
                                        No hay concursos terminados
                                    </p>
                                    <p className="text-gray-400 text-xs mt-2">
                                        Aquí aparecerán los ganadores de concursos pasados
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {finishedContests.map((contest, index) => (
                                        <div key={index} className="border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900">{contest.name}</h4>
                                            <div className="mt-2">
                                                <div className="text-sm font-medium text-blue-600">
                                                    🏆 Ganador: {contest.winner}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Likes/Trofeos otorgados: {contest.prize}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Todos los Trofeos */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="bg-yellow-50">
                            <CardTitle className="text-lg text-yellow-700 flex items-center">
                                <Star className="mr-2 w-5 h-5" />
                                Trofeos Disponibles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {allTrophies.map((trophy, index) => (
                                    <div key={index} className="border border-yellow-200 rounded-lg p-3">
                                        <div className="flex items-start">
                                            <span className="text-2xl mr-3">{trophy.icon}</span>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 text-sm">
                                                    {trophy.name}
                                                </h4>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {trophy.description}
                                                </p>
                                                <div className={`inline-block px-2 py-1 rounded text-xs mt-2 ${trophy.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                                                        trophy.difficulty === 'Medio' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {trophy.difficulty}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        
    );
}

