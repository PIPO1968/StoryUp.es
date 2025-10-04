import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, Award, Star, Clock, User } from 'lucide-react';
import { getAllContests, getActiveContests, getFinishedContests, updateContestStatuses } from '../lib/contestsManager';

interface TrophyData {
    id: string;
    name: string;
    description: string;
    image: string;
    color: string;
}

export default function ContestsPage() {
    const [activeContests, setActiveContests] = useState([]);
    const [finishedContests, setFinishedContests] = useState([]);
    const [trophies, setTrophies] = useState<TrophyData[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar concursos al montar el componente
    useEffect(() => {
        loadContests();
        loadTrophies();

        // Actualizar cada 30 segundos
        const interval = setInterval(() => {
            updateContestStatuses();
            loadContests();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const loadContests = () => {
        try {
            updateContestStatuses(); // Actualizar estados antes de cargar
            setActiveContests(getActiveContests());
            setFinishedContests(getFinishedContests());
        } catch (error) {
            console.error('Error loading contests:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTrophies = async () => {
        try {
            const response = await fetch('/assets/trophies.json');
            const data = await response.json();
            setTrophies(data.trophies || []);
        } catch (error) {
            console.error('Error loading trophies:', error);
            // Fallback a trofeos básicos si no se puede cargar el JSON
            const fallbackTrophies = Array.from({ length: 22 }, (_, i) => {
                const id = i + 1;
                const extension = (id === 13 || id === 14 || id === 15) ? 'jpg' : 'png';
                return {
                    id: id.toString(),
                    image: `Premio${id}.${extension}`,
                    name: `Trofeo ${id}`,
                    description: 'Descripción del logro pendiente',
                    color: 'bg-yellow-500'
                };
            });
            setTrophies(fallbackTrophies);
        }
    };

    const formatDate = (dateString) => {
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
                <span className="ml-3 text-gray-600">Cargando concursos...</span>
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
                                        <h4 className="font-semibold text-gray-900">{contest.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{contest.description}</p>

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
                                <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">
                                    No hay concursos terminados
                                </p>
                                <p className="text-gray-400 text-xs mt-2">
                                    Aquí aparecerán los ganadores de concursos pasados
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {finishedContests.map((contest) => (
                                    <div key={contest.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                        <h4 className="font-semibold text-gray-900">{contest.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{contest.description}</p>

                                        <div className="mt-3 space-y-1">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <User className="w-3 h-3 mr-1" />
                                                Creado por: <span className="font-medium ml-1">{contest.creatorUsername}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Finalizado: {formatDate(contest.endDate)}
                                            </div>
                                        </div>

                                        <div className="mt-3 p-2 bg-white rounded border-l-4 border-l-blue-500">
                                            <div className="text-sm font-medium text-blue-700">
                                                🏆 Ganador:
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                {contest.winner ? (
                                                    <span className="font-semibold text-blue-600">{contest.winner}</span>
                                                ) : (
                                                    <span className="text-orange-600 italic">Pendiente de ganador</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Trofeos Disponibles */}
                <Card className="lg:col-span-1">
                    <CardHeader className="bg-yellow-50">
                        <CardTitle className="text-lg text-yellow-700 flex items-center">
                            <Star className="mr-2 w-5 h-5" />
                            Trofeos Disponibles
                            <span className="ml-auto bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm">
                                {trophies.length}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {trophies.map((trophy) => (
                                <div key={trophy.id} className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                                    <div className="flex items-start">
                                        <div className="w-12 h-12 bg-white rounded border-2 border-yellow-300 flex items-center justify-center mr-3">
                                            {trophy.image === 'trofeo-default.png' ? (
                                                <Trophy className="w-6 h-6 text-yellow-600" />
                                            ) : (
                                                <>
                                                    <img
                                                        src={`/assets/${trophy.image}`}
                                                        alt={trophy.name}
                                                        className="w-8 h-8 object-contain"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const fallback = target.nextSibling as HTMLElement;
                                                            if (fallback) fallback.style.display = 'block';
                                                        }}
                                                    />
                                                    <Trophy className="w-6 h-6 text-yellow-600 hidden" />
                                                </>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 text-sm">
                                                {trophy.name}
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {trophy.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-yellow-100 rounded-lg text-center">
                            <p className="text-xs text-yellow-700">
                                💡 Los trofeos se asignarán automáticamente al bloque "Mis Trofeos"
                                de tu perfil conforme los vayas consiguiendo
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

