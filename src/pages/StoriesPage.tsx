import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { useLanguage } from '../lib/LanguageContext';


export default function StoriesPage() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch("/api/stories");
                if (!res.ok) throw new Error("Error al obtener historias");
                const data = await res.json();
                setStories(data);
            } catch (err) {
                setStories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    const renderEmptyStories = () => {
        const emptySlots = [];
        for (let i = 1; i <= 25; i++) {
            emptySlots.push(
                <div key={i} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <span className="text-2xl font-bold text-gray-300 mr-4">{i}</span>
                    <div className="flex-1">
                        <p className="text-gray-400">Sin historia creada</p>
                        <p className="text-sm text-gray-300">Esperando nueva historia...</p>
                    </div>
                </div>
            );
        }
        return emptySlots;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <BookOpen className="mr-3 text-blue-600" />
                        Historias de la Comunidad
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Las últimas 25 historias creadas por nuestra comunidad StoryUp
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-blue-600">
                        📖 Lista de Historias (1-25)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-center text-gray-500 py-8">Cargando historias...</p>
                        ) : stories.length === 0 ? (
                            <>
                                <p className="text-center text-gray-500 py-8">
                                    ¡Aún no hay historias creadas! Sé el primero en compartir tu historia.
                                </p>
                                {renderEmptyStories()}
                            </>
                        ) : (
                            stories.map((story, index) => (
                                <div key={story._id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <span className="text-2xl font-bold text-blue-600 mr-4">{index + 1}</span>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                            <Link to={`/stories/${story._id}`} className="hover:underline">
                                                {story.title}
                                            </Link>
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <User className="w-4 h-4 mr-1" />
                                            <span>{story.author?.username || story.author?.name || "Autor desconocido"}</span>
                                            <span className="mx-2">•</span>
                                            <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="text-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                    Crear Nueva Historia
                </Button>
            </div>
        </div>
    );
}

