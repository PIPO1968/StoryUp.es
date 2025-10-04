import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ArrowLeft, Edit, Calendar, Trophy, Users, BookOpen, Upload, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { getUserStats, UserStats } from '../lib/userStatsManager';

export default function ProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        bio: (user as any)?.bio || '',
        username: user?.username || ''
    });

    const onBack = () => navigate(-1);
    const updateProfile = async (updates: Partial<any>) => {
        // Función simulada para actualizar perfil
        console.log('Actualizando perfil:', updates);
        alert('Función de actualización de perfil (demo)');
    };
    const [fullUser, setFullUser] = useState<any | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [announcement, setAnnouncement] = useState('');
    const [schoolCenter, setSchoolCenter] = useState('');
    const [schoolCenterSaved, setSchoolCenterSaved] = useState(false);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const userTrophies: any[] = [];
    const fileInputRef = useRef<HTMLInputElement>(null);
    const joinDate = new Date();

    useEffect(() => {
        console.log('Valor de user:', user); // Depuración
        async function fetchUserData() {
            if (user) {
                try {
                    // Aquí iría la lógica para obtener los datos del usuario, por ahora se simula con un setTimeout
                    setTimeout(() => {
                        setFullUser(user);
                        setAvatarUrl(user.avatar || '');
                        setEditForm({
                            name: user.name || '',
                            bio: (user as any).bio || '',
                            username: user.username || ''
                        });

                        // Sistema de centro escolar simulado (sin localStorage)
                        if (user.role === 'padre-docente') {
                            setSchoolCenter('Centro Educativo Demo');
                            setSchoolCenterSaved(true);
                        }

                        // Cargar estadísticas del usuario
                        const stats = getUserStats(user.id || user.username);
                        setUserStats(stats);

                        // Simular lista de usuarios
                        setUsersList([user, { id: '2', name: 'Usuario Ejemplo', username: 'usuario.ejemplo', bio: 'Este es un usuario de ejemplo.', avatar: '' }]);
                    }, 1000);
                } catch (err) {
                    console.error('Error recargando datos de usuario:', err);
                }
            } else {
                console.log('No hay usuario disponible');
            }
        }
        fetchUserData();
    }, [user]);

    if (!user) {
        return (

            <div className="max-w-4xl mx-auto">
                <div className="text-center py-8">
                    <p className="text-gray-600">Debes iniciar sesión para ver el perfil</p>
                    <Button onClick={onBack} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Button>
                </div>
            </div>

        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            await updateProfile({
                name: editForm.name.trim(),
                bio: editForm.bio.trim(),
                username: editForm.username.trim()
            });
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error('Error actualizando perfil:', error);
        }
    };

    const handlePublishAnnouncement = async () => {
        if (!announcement.trim()) {
            alert('El anuncio no puede estar vacío.');
            return;
        }

        // Aquí iría la lógica para publicar el anuncio, por ahora solo se simula con un alert
        alert('Anuncio publicado con éxito: ' + announcement);
        setAnnouncement('');
    };

    const getUserTypeColor = (userType: 'usuario' | 'padre-docente' | undefined) => {
        if (userType === 'padre-docente') return 'bg-blue-500';
        if (userType === 'usuario') return 'bg-gray-500';
        return 'bg-gray-300'; // Valor predeterminado
    };

    const getUserTypeLabel = (userType: 'usuario' | 'padre-docente' | undefined) => {
        if (userType === 'padre-docente') return 'Padre/Docente';
        if (userType === 'usuario') return 'Usuario';
        return 'Desconocido'; // Valor predeterminado
    };

    return (

        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="hover:bg-gray-100"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <h1 className="text-3xl font-bold text-gray-800">Mi Perfil 👤</h1>
                </div>
                <Badge variant="secondary" className="hidden md:flex">
                    Sesión activa
                </Badge>
            </div>



            {/* Bloque superior: Editar perfil (izquierda) + Trofeos/Logros (derecha) */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Datos Personales - 3/5 */}
                <div className="md:w-7/12 w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos Personales</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center md:items-start">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src={avatarUrl || user.avatar} alt={user.name} />
                                    <AvatarFallback className="text-lg">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Buscador de imágenes para avatar */}
                                <div className="mt-2 w-full flex flex-col items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setUploading(true);
                                            setTimeout(() => {
                                                setAvatarUrl(URL.createObjectURL(file));
                                                setUploading(false);
                                                alert('Avatar temporal (se pierde al recargar)');
                                            }, 1000);
                                        }}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-1"
                                        disabled={uploading}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="mr-1 h-3 w-3" />
                                        {uploading ? 'Subiendo...' : 'Cambiar'}
                                    </Button>
                                </div>

                                <div className="mt-4 w-full">
                                    {/* Datos básicos en formato compacto */}
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">Nick:</span>
                                            <span className="ml-2 text-gray-900">{user.username}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Email:</span>
                                            <span className="ml-2 text-gray-900">{user.email}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Nombre completo:</span>
                                            <span className="ml-2 text-gray-900">{user.name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium text-gray-600">Rol:</span>
                                            <Badge className={`ml-2 ${getUserTypeColor(fullUser?.user_type === 'padre-docente' ? 'padre-docente' : fullUser?.user_type === 'usuario' ? 'usuario' : undefined)}`}>
                                                {getUserTypeLabel(fullUser?.user_type === 'padre-docente' ? 'padre-docente' : fullUser?.user_type === 'usuario' ? 'usuario' : undefined)}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Centro Escolar */}
                                    <div className="mt-3">
                                        <span className="font-medium text-gray-600">Centro Escolar:</span>
                                        {schoolCenterSaved ? (
                                            <div className="flex items-center justify-between">
                                                <span className="ml-2 text-gray-900">{schoolCenter}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSchoolCenterSaved(false)}
                                                    className="text-xs h-6"
                                                >
                                                    Cambiar
                                                </Button>
                                            </div>
                                        ) : (
                                            <Input
                                                className="mt-1 h-8 text-sm"
                                                placeholder="Escribe tu centro escolar..."
                                                value={schoolCenter}
                                                onChange={(e) => setSchoolCenter(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && schoolCenter.trim()) {
                                                        setSchoolCenterSaved(true);
                                                        console.log('Centro escolar configurado (temporal):', schoolCenter.trim());
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (schoolCenter.trim()) {
                                                        setSchoolCenterSaved(true);
                                                        console.log('Centro escolar configurado (temporal):', schoolCenter.trim());
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Estadísticas en grid compacto con efectos hover */}
                                    <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
                                        <div className="text-center cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors" onClick={() => {
                                            if (userStats) {
                                                alert(`Desglose de Likes:\n• Historias: ${userStats.likes.fromStories}\n• Trofeos: ${userStats.likes.fromTrophies}\n• Concursos: ${userStats.likes.fromContests}\n• Premios Admin: ${userStats.likes.fromAdmin}\n\nTotal: ${userStats.likes.total}`);
                                            }
                                        }}>
                                            <div className="text-xl font-bold text-blue-600">
                                                {userStats?.likes.total || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Likes ❤️</div>
                                        </div>
                                        <div className="text-center p-2 rounded-lg hover:bg-green-50 transition-colors">
                                            <div className="text-xl font-bold text-green-600">
                                                {userStats?.friends || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Amigos 👥</div>
                                        </div>
                                        <div className="text-center p-2 rounded-lg hover:bg-yellow-50 transition-colors">
                                            <div className="text-xl font-bold text-yellow-600">
                                                {userStats?.trophies || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Trofeos 🏆</div>
                                        </div>
                                        <div className="text-center p-2 rounded-lg hover:bg-purple-50 transition-colors">
                                            <div className="text-xl font-bold text-purple-600">
                                                {userStats?.stories || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Historias 📚</div>
                                        </div>
                                        <div className="text-center col-span-2 p-2 rounded-lg hover:bg-red-50 transition-colors">
                                            <div className="text-xl font-bold text-red-600">
                                                #{userStats?.globalPosition || '?'}
                                            </div>
                                            <div className="text-xs text-gray-600">Ranking Global 🌟</div>
                                        </div>
                                    </div>



                                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full mt-4">
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar perfil
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Editar perfil</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="name" className="text-sm font-medium">
                                                        Nombre completo
                                                    </label>
                                                    <Input id="name" name="name" value={editForm.name} onChange={handleInputChange} placeholder="Tu nombre completo" />
                                                </div>
                                                <div>
                                                    <label htmlFor="username" className="text-sm font-medium">Nombre de usuario</label>
                                                    <Input id="username" name="username" value={editForm.username} onChange={handleInputChange} placeholder="Tu nombre de usuario" />
                                                </div>
                                                <div>
                                                    <label htmlFor="bio" className="text-sm font-medium">Biografía</label>
                                                    <Textarea id="bio" name="bio" value={editForm.bio} onChange={handleInputChange} placeholder="Cuéntanos algo sobre ti..." rows={3} />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button onClick={handleSaveProfile} className="flex-1">Guardar cambios</Button>
                                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Trofeos/Logros - 2/5 */}
                <div className="md:w-5/12 w-full">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-600" />
                                Trofeos y logros
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {userTrophies.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-xl mb-4">
                                        <Trophy className="mx-auto h-16 w-16 mb-4 text-yellow-500" />
                                        <h3 className="font-semibold text-gray-700 mb-2">¡Empieza tu colección!</h3>
                                        <p className="text-sm text-gray-600">
                                            Participa en concursos y escribe historias para ganar trofeos increíbles.
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="mt-2"
                                        onClick={() => navigate('/contests')}
                                    >
                                        Ver Concursos
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {userTrophies.map((trophy) => (
                                        <div key={trophy.id} className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow">
                                            <Trophy className="h-8 w-8 text-yellow-600 mr-3 flex-shrink-0" />
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-gray-800">{trophy.title}</h3>
                                                <p className="text-xs text-gray-600">{trophy.description}</p>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {trophy.date || 'Reciente'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Progreso hacia próximo trofeo */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-blue-700">Próximo objetivo</span>
                                    <span className="text-xs text-blue-600">3/5 historias</span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                <p className="text-xs text-blue-600 mt-1">
                                    ¡Solo 2 historias más para el trofeo "Escritor Novato"!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Panel de anuncios */}
            <div className="w-full mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                            Panel de anuncios
                            <Badge variant="secondary" className="ml-2">Demo</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Comparte algo interesante con la comunidad StoryUp..."
                                className="min-h-[100px] resize-none"
                                value={announcement}
                                onChange={(e) => setAnnouncement(e.target.value)}
                            />
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    {announcement.length}/280 caracteres
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAnnouncement('')}
                                        disabled={!announcement.trim()}
                                    >
                                        Limpiar
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handlePublishAnnouncement}
                                        disabled={!announcement.trim() || announcement.length > 280}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        📢 Publicar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sección de Chat WhatsApp-style */}
            <div className="w-full mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <MessageCircle className="w-5 h-5 text-green-600" />
                                <span>Chat Personal</span>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <Badge variant="secondary" className="text-xs">Demo</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-96 bg-gradient-to-b from-green-50 to-green-100 rounded-lg p-4 flex flex-col border">
                            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                                <div className="flex justify-start">
                                    <div className="bg-white px-4 py-2 rounded-r-lg rounded-t-lg shadow-sm max-w-xs border">
                                        <p className="text-sm">¡Hola! ¿Cómo va el proyecto StoryUp? 🚀</p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                                            <span>10:30</span>
                                            <span className="ml-2">✓</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-green-500 text-white px-4 py-2 rounded-l-lg rounded-t-lg max-w-xs shadow-sm">
                                        <p className="text-sm">¡Muy bien! Ya tenemos el dashboard funcionando perfectamente. 🎉</p>
                                        <p className="text-xs text-green-100 mt-1 flex items-center justify-end">
                                            <span>10:32</span>
                                            <span className="ml-2">✓✓</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-white px-4 py-2 rounded-r-lg rounded-t-lg shadow-sm max-w-xs border">
                                        <p className="text-sm">¡Genial! Me encanta cómo quedó el chat integrado. 💬</p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                                            <span>10:35</span>
                                            <span className="ml-2">✓✓</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs border border-yellow-200">
                                        Hoy
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 bg-white p-2 rounded-lg border">
                                <Input
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 border-0 focus-visible:ring-0"
                                />
                                <Button size="icon" className="bg-green-500 hover:bg-green-600 rounded-full">
                                    📤
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bloques exclusivos para Padres/Docentes */}
            {(fullUser?.user_type === 'padre-docente' || user?.role === 'padre-docente') && (
                <div className="w-full mt-8">
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            👨‍🏫 Panel de Padre/Docente
                            <Badge className="bg-blue-600">Privilegios Especiales</Badge>
                        </h2>
                        <p className="text-blue-700 text-sm">Herramientas exclusivas para educadores y padres</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700">
                                    📰 Crear noticias
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">
                                    Publica novedades importantes para toda la comunidad StoryUp.
                                </p>
                                <div className="space-y-2">
                                    <div className="text-xs text-gray-500">• Noticias del centro</div>
                                    <div className="text-xs text-gray-500">• Comunicados oficiales</div>
                                    <div className="text-xs text-gray-500">• Eventos especiales</div>
                                </div>
                                <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
                                    ✏️ Crear noticia
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-purple-700">
                                    🏆 Crear concursos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">
                                    Organiza concursos literarios y actividades creativas.
                                </p>
                                <div className="space-y-2">
                                    <div className="text-xs text-gray-500">• Concursos de escritura</div>
                                    <div className="text-xs text-gray-500">• Desafíos creativos</div>
                                    <div className="text-xs text-gray-500">• Premios y reconocimientos</div>
                                </div>
                                <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">
                                    🎯 Crear concurso
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-700">
                                    ⚙️ Panel de administración
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">
                                    Gestiona usuarios, configuraciones y moderación.
                                </p>
                                <div className="space-y-2">
                                    <div className="text-xs text-gray-500">• Gestión de usuarios</div>
                                    <div className="text-xs text-gray-500">• Moderación de contenido</div>
                                    <div className="text-xs text-gray-500">• Estadísticas del centro</div>
                                </div>
                                <Button className="mt-4 w-full bg-red-600 hover:bg-red-700">
                                    🛠️ Ir al panel
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Estadísticas del educador */}
                    <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-800">📊 Resumen de actividad docente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-white rounded-lg border">
                                    <div className="text-2xl font-bold text-blue-600">12</div>
                                    <div className="text-xs text-gray-600">Estudiantes activos</div>
                                </div>
                                <div className="text-center p-3 bg-white rounded-lg border">
                                    <div className="text-2xl font-bold text-green-600">8</div>
                                    <div className="text-xs text-gray-600">Concursos creados</div>
                                </div>
                                <div className="text-center p-3 bg-white rounded-lg border">
                                    <div className="text-2xl font-bold text-purple-600">45</div>
                                    <div className="text-xs text-gray-600">Historias revisadas</div>
                                </div>
                                <div className="text-center p-3 bg-white rounded-lg border">
                                    <div className="text-2xl font-bold text-orange-600">96%</div>
                                    <div className="text-xs text-gray-600">Satisfacción</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>

    );
}

