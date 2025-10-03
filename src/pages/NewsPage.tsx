import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Calendar, User } from 'lucide-react';


export default function NewsPage() {
    // Lista vacía inicial - las noticias aparecerán cuando los Padre/Docente las creen
    const news = [];

    return (
        
            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                        <Newspaper className="mr-3 text-blue-600" />
                        Noticias Educativas
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Últimas noticias de actualidad creadas por nuestros docentes
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-blue-600">
                            📰 Noticias de la Comunidad
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {news.length === 0 ? (
                            <div className="text-center py-12">
                                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-500 mb-2">
                                    No hay noticias disponibles
                                </h3>
                                <p className="text-gray-400">
                                    Los usuarios con rol de Padre/Docente pueden crear noticias desde su página de perfil
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {news.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {item.date}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed mb-4">{item.content}</p>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <User className="w-4 h-4 mr-1" />
                                            <span>Por: {item.author}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        
    );
}

