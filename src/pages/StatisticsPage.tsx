import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Heart, Trophy, BookOpen } from 'lucide-react';
import Layout from '../components/Layout';

export default function StatisticsPage() {
    return (
        <Layout>
            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                        <BarChart3 className="mr-3 text-purple-600" />
                        Estadísticas de StoryUp
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Descubre las tendencias y mejores contenidos de nuestra comunidad
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Top 5 Historias por Likes */}
                    <Card>
                        <CardHeader className="bg-red-50">
                            <CardTitle className="text-lg text-red-700 flex items-center">
                                <Heart className="mr-2 w-5 h-5" />
                                Top 5 Historias por Likes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="text-center py-8">
                                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">
                                    Aún no hay historias con likes
                                </p>
                                <p className="text-gray-400 text-xs mt-2">
                                    ¡Sé el primero en crear una historia popular!
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Usuarios con Más Likes */}
                    <Card>
                        <CardHeader className="bg-blue-50">
                            <CardTitle className="text-lg text-blue-700 flex items-center">
                                <TrendingUp className="mr-2 w-5 h-5" />
                                Usuarios con Más Likes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">1. PIPO68</span>
                                    <span className="text-sm font-semibold">0 likes</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">2. piporgz68</span>
                                    <span className="text-sm font-semibold">0 likes</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Usuarios con Más Amigos */}
                    <Card>
                        <CardHeader className="bg-green-50">
                            <CardTitle className="text-lg text-green-700 flex items-center">
                                <Users className="mr-2 w-5 h-5" />
                                Usuarios con Más Amigos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">1. PIPO68</span>
                                    <span className="text-sm font-semibold">0 amigos</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">2. piporgz68</span>
                                    <span className="text-sm font-semibold">0 amigos</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Usuarios con Más Historias */}
                    <Card>
                        <CardHeader className="bg-purple-50">
                            <CardTitle className="text-lg text-purple-700 flex items-center">
                                <BookOpen className="mr-2 w-5 h-5" />
                                Usuarios con Más Historias
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">1. PIPO68</span>
                                    <span className="text-sm font-semibold">0 historias</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">2. piporgz68</span>
                                    <span className="text-sm font-semibold">0 historias</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Usuarios con Más Trofeos */}
                    <Card>
                        <CardHeader className="bg-yellow-50">
                            <CardTitle className="text-lg text-yellow-700 flex items-center">
                                <Trophy className="mr-2 w-5 h-5" />
                                Usuarios con Más Trofeos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">1. PIPO68</span>
                                    <span className="text-sm font-semibold">0 trofeos</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">2. piporgz68</span>
                                    <span className="text-sm font-semibold">0 trofeos</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estadísticas Generales */}
                    <Card>
                        <CardHeader className="bg-indigo-50">
                            <CardTitle className="text-lg text-indigo-700 flex items-center">
                                <BarChart3 className="mr-2 w-5 h-5" />
                                Estadísticas Generales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Total Usuarios</span>
                                    <span className="text-sm font-semibold">2</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Total Historias</span>
                                    <span className="text-sm font-semibold">0</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Total Likes</span>
                                    <span className="text-sm font-semibold">0</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Usuarios Online</span>
                                    <span className="text-sm font-semibold text-green-600">1</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Concursos Activos</span>
                                    <span className="text-sm font-semibold">0</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}