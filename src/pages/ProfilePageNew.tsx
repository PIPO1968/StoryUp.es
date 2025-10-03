import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Trophy, MessageCircle, Send, Users, Settings } from 'lucide-react';
import { useAuth } from '../App';


export default function ProfilePage() {
    const { user } = useAuth();
    const [chatMessage, setChatMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Datos de perfil del usuario
    const profileData = {
        name: user?.name || 'Usuario',
        email: user?.email || '',
        username: user?.username || '',
        role: user?.role || 'user',
        likes: user?.likes || 0,
        trophies: user?.trophies || [],
        friends: user?.friends || []
    };

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            const newMessage = {
                id: Date.now(),
                text: chatMessage,
                sender: user?.username,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages([...messages, newMessage]);
            setChatMessage('');
        }
    };

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

    return (
        
            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                        <User className="mr-3 text-blue-600" />
                        Mi Perfil
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Datos Personales - 3/5 de la página */}
                    <Card className="lg:col-span-3">
                        <CardHeader className="bg-blue-50">
                            <CardTitle className="text-xl text-blue-700 flex items-center">
                                <User className="mr-2 w-5 h-5" />
                                Datos Personales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre de usuario
                                    </label>
                                    <Input value={profileData.username} readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <Input value={profileData.email} readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre completo
                                    </label>
                                    <Input value={profileData.name} readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rol
                                    </label>
                                    <Input value={
                                        profileData.role === 'admin' ? 'Usuario/Admin' :
                                            profileData.role === 'teacher' ? 'Padre/Docente' : 'Usuario'
                                    } readOnly />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{profileData.likes}</div>
                                    <div className="text-sm text-gray-600">Likes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{profileData.friends.length}</div>
                                    <div className="text-sm text-gray-600">Amigos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">{profileData.trophies.length}</div>
                                    <div className="text-sm text-gray-600">Trofeos</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trofeos - 2/5 de la página */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="bg-yellow-50">
                            <CardTitle className="text-xl text-yellow-700 flex items-center">
                                <Trophy className="mr-2 w-5 h-5" />
                                Mis Trofeos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {profileData.trophies.length === 0 ? (
                                <div className="text-center py-8">
                                    <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Aún no tienes trofeos</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        ¡Participa en concursos para ganar trofeos!
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {profileData.trophies.map((trophy, index) => (
                                        <div key={index} className="text-center p-2 bg-yellow-50 rounded">
                                            <div className="text-2xl">{trophy.icon}</div>
                                            <div className="text-xs text-gray-600">{trophy.name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Chat WhatsApp - Todo el ancho */}
                <Card>
                    <CardHeader className="bg-green-50">
                        <CardTitle className="text-xl text-green-700 flex items-center">
                            <MessageCircle className="mr-2 w-5 h-5" />
                            Chat Comunitario
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-96 bg-gray-50 p-4 overflow-y-auto">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-16">
                                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div key={message.id} className="mb-4 flex">
                                        <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                                            <div className="text-sm font-medium text-blue-600">{message.sender}</div>
                                            <div className="text-gray-800">{message.text}</div>
                                            <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-4 border-t bg-white">
                            <div className="flex space-x-2">
                                <Input
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bloques adicionales para Padre/Docente */}
                {isTeacher && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                        {/* Crear Noticia */}
                        <Card>
                            <CardHeader className="bg-indigo-50">
                                <CardTitle className="text-lg text-indigo-700">
                                    📰 Crear Noticia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <Input placeholder="Título de la noticia" />
                                <Textarea placeholder="Contenido de la noticia..." className="min-h-[100px]" />
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                                    Publicar Noticia
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Crear Concurso */}
                        <Card>
                            <CardHeader className="bg-purple-50">
                                <CardTitle className="text-lg text-purple-700">
                                    🏆 Crear Concurso
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <Input placeholder="Nombre del concurso" />
                                <Input placeholder="Clave del concurso" />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input type="date" placeholder="Fecha inicio" />
                                    <Input type="date" placeholder="Fecha fin" />
                                </div>
                                <Textarea placeholder="Descripción del concurso..." />
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                    Crear Concurso
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Administración */}
                        <Card>
                            <CardHeader className="bg-red-50">
                                <CardTitle className="text-lg text-red-700 flex items-center">
                                    <Settings className="mr-2 w-4 h-4" />
                                    Administración
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <Input placeholder="Agregar amigo por username" />
                                <Button variant="outline" className="w-full">
                                    <Users className="mr-2 w-4 h-4" />
                                    Gestionar Amigos
                                </Button>
                                <Input placeholder="Palabra prohibida" />
                                <Button variant="outline" className="w-full">
                                    Agregar Palabra Prohibida
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Usuario" />
                                    <Input placeholder="Likes +/-" type="number" />
                                </div>
                                <Button variant="destructive" className="w-full">
                                    Moderar Usuario
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        
    );
}

