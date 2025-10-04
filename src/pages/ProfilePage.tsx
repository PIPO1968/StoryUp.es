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

                        // Cargar centro escolar desde localStorage
                        const savedSchoolCenter = localStorage.getItem('storyup_school_center');
                        if (savedSchoolCenter) {
                            setSchoolCenter(savedSchoolCenter);
                            setSchoolCenterSaved(true);
                        }

                        // Cargar estadísticas del usuario
                        let stats = getUserStats(user.id || user.username);

                        // Forzar inicialización con datos reales para PIPO68
                        if (user.username === 'PIPO68') {
                            // Crear estadísticas con datos reales conocidos
                            const updatedStats: UserStats = {
                                userId: user.id || user.username,
                                friends: stats.friends || 0,
                                trophies: stats.trophies || 0,
                                stories: 1, // 1 historia creada (dato real)
                                likes: {
                                    fromStories: 1, // 1 like recibido (dato real)
                                    fromTrophies: 0,
                                    fromContests: 0,
                                    fromAdmin: 0,
                                    total: 1
                                },
                                globalPosition: 1, // Primera posición por tener datos
                                lastUpdated: new Date().toISOString()
                            };

                            // Guardar estadísticas actualizadas
                            localStorage.setItem(`storyup_user_stats_${user.id || user.username}`, JSON.stringify(updatedStats));
                            setUserStats(updatedStats);
                            console.log('Estadísticas inicializadas para PIPO68:', updatedStats);
                        } else {
                            setUserStats(stats);
                        }

                        // Verificar y restaurar lista de usuarios si está vacía
                        const existingUsers = localStorage.getItem('storyup_users');
                        if (!existingUsers || JSON.parse(existingUsers).length === 0) {
                            console.log('Restaurando lista de usuarios...');
                            const defaultUsers = [
                                { id: '1', username: 'ADMIN', name: 'Administrador', userType: 'padre-docente', email: 'admin@storyup.es' },
                                { id: '2', username: 'PIPO68', name: 'Pipo Rodriguez Rodriguez', userType: 'usuario', email: 'pipocanarias@hotmail.com' },
                                { id: '3', username: 'usuario.ejemplo', name: 'Usuario Ejemplo', userType: 'usuario', email: 'ejemplo@storyup.es' }
                            ];
                            localStorage.setItem('storyup_users', JSON.stringify(defaultUsers));
                            console.log('Lista de usuarios restaurada:', defaultUsers.length, 'usuarios');
                        }

                        // Simular lista de usuarios
                        setUsersList([user, { id: '2', name: 'Usuario Ejemplo', username: 'usuario.ejemplo', bio: 'Este es un usuario de ejemplo.', avatar: '' }]);
                    }, 1000);
                } catch (err) {
                    console.error('Error recargando datos de usuario:', err);
                }
            } else {
                // Cargar desde caché local si está disponible
                const cachedUser = localStorage.getItem('fullUser');
                if (cachedUser) {
                    const parsedUser = JSON.parse(cachedUser);
                    console.log('Usuario cargado desde caché local:', parsedUser); // Depuración
                    setFullUser(parsedUser);
                    setAvatarUrl(parsedUser.avatar || '');
                    setEditForm({
                        name: parsedUser.name || '',
                        bio: parsedUser.bio || '',
                        username: parsedUser.username || ''
                    });
                }
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
            <h1 className="text-3xl font-bold mb-4">Mi Perfil</h1>

            {/* Debug info - temporal */}
            <div className="mb-4 p-2 bg-gray-100 border rounded text-xs">
                <p>Debug - Usuario actual: {user?.username || 'NO_USERNAME'}</p>
                <p>Debug - Nombre: {user?.name || 'NO_NAME'}</p>
                <p>Debug - ID: {user?.id || 'NO_ID'}</p>
                <p>Debug - Condición botón: {user?.username === 'PIPO68' ? 'TRUE' : 'FALSE'}</p>
            </div>

            {/* Botón temporal para reinicializar estadísticas PIPO68 */}
            {user?.username === 'PIPO68' && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-2">🔧 Botón temporal para reinicializar estadísticas (PIPO68)</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            // Limpiar localStorage
                            localStorage.removeItem(`storyup_user_stats_${user.id || user.username}`);

                            // Forzar reinicialización
                            const newStats: UserStats = {
                                userId: user.id || user.username,
                                friends: 0,
                                trophies: 0,
                                stories: 1, // 1 historia creada (dato real)
                                likes: {
                                    fromStories: 1, // 1 like recibido (dato real)
                                    fromTrophies: 0,
                                    fromContests: 0,
                                    fromAdmin: 0,
                                    total: 1
                                },
                                globalPosition: 1,
                                lastUpdated: new Date().toISOString()
                            };

                            localStorage.setItem(`storyup_user_stats_${user.id || user.username}`, JSON.stringify(newStats));
                            setUserStats(newStats);
                            alert('Estadísticas reinicializadas correctamente!');
                        }}
                    >
                        🔄 Reinicializar mis estadísticas
                    </Button>
                </div>
            )}

            {/* Botón alternativo para cualquier usuario - temporal */}
            {user && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">🔧 Botones temporales para cualquier usuario</p>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                // Limpiar localStorage
                                localStorage.removeItem(`storyup_user_stats_${user.id || user.username}`);

                                // Forzar reinicialización con datos de ejemplo
                                const newStats: UserStats = {
                                    userId: user.id || user.username,
                                    friends: 0,
                                    trophies: 0,
                                    stories: 1, // 1 historia creada
                                    likes: {
                                        fromStories: 1, // 1 like recibido
                                        fromTrophies: 0,
                                        fromContests: 0,
                                        fromAdmin: 0,
                                        total: 1
                                    },
                                    globalPosition: 1,
                                    lastUpdated: new Date().toISOString()
                                };

                                localStorage.setItem(`storyup_user_stats_${user.id || user.username}`, JSON.stringify(newStats));
                                setUserStats(newStats);
                                alert('Estadísticas reinicializadas correctamente para ' + (user.username || user.name));
                            }}
                        >
                            🔄 Reinicializar estadísticas
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                // Restaurar contador de usuarios
                                const defaultUsers = [
                                    { id: '1', username: 'ADMIN', name: 'Administrador', userType: 'padre-docente', email: 'admin@storyup.es' },
                                    { id: '2', username: 'PIPO68', name: 'Pipo Rodriguez Rodriguez', userType: 'usuario', email: 'pipocanarias@hotmail.com' },
                                    { id: '3', username: 'usuario.ejemplo', name: 'Usuario Ejemplo', userType: 'usuario', email: 'ejemplo@storyup.es' },
                                    { id: '4', username: 'maria.lopez', name: 'María López', userType: 'usuario', email: 'maria@storyup.es' },
                                    { id: '5', username: 'juan.garcia', name: 'Juan García', userType: 'padre-docente', email: 'juan@storyup.es' }
                                ];
                                localStorage.setItem('storyup_users', JSON.stringify(defaultUsers));
                                alert('Contador de usuarios restaurado: ' + defaultUsers.length + ' usuarios registrados');
                                // Recargar página para actualizar contador
                                window.location.reload();
                            }}
                        >
                            👥 Restaurar contador usuarios
                        </Button>
                    </div>
                </div>
            )}

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
                                            <span className="ml-2 text-gray-900">{schoolCenter}</span>
                                        ) : (
                                            <Input
                                                className="mt-1 h-8 text-sm"
                                                placeholder="Escribe tu centro escolar..."
                                                value={schoolCenter}
                                                onChange={(e) => setSchoolCenter(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && schoolCenter.trim()) {
                                                        setSchoolCenterSaved(true);
                                                        // Aquí guardaríamos en localStorage o backend
                                                        localStorage.setItem('storyup_school_center', schoolCenter.trim());
                                                        console.log('Centro escolar guardado:', schoolCenter.trim());
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (schoolCenter.trim()) {
                                                        setSchoolCenterSaved(true);
                                                        localStorage.setItem('storyup_school_center', schoolCenter.trim());
                                                        console.log('Centro escolar guardado:', schoolCenter.trim());
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Estadísticas en grid compacto */}
                                    <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
                                        <div className="text-center cursor-pointer" onClick={() => {
                                            if (userStats) {
                                                alert(`Desglose de Likes:\n• Historias: ${userStats.likes.fromStories}\n• Trofeos: ${userStats.likes.fromTrophies}\n• Concursos: ${userStats.likes.fromContests}\n• Premios Admin: ${userStats.likes.fromAdmin}\n\nTotal: ${userStats.likes.total}`);
                                            }
                                        }}>
                                            <div className="text-xl font-bold text-blue-600">
                                                {userStats?.likes.total || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Likes</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-green-600">
                                                {userStats?.friends || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Amigos</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-yellow-600">
                                                {userStats?.trophies || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Trofeos</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-purple-600">
                                                {userStats?.stories || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Historias</div>
                                        </div>
                                        <div className="text-center col-span-2">
                                            <div className="text-xl font-bold text-red-600">
                                                {userStats?.globalPosition || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-600">Posición Global</div>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Trofeos y logros</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {userTrophies.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Trophy className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                                    <p>Aún no tienes trofeos ni logros.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {userTrophies.map((trophy) => (
                                        <div key={trophy.id} className="text-center p-4 bg-yellow-50 rounded-lg">
                                            <Trophy className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
                                            <h3 className="font-semibold">{trophy.title}</h3>
                                            <p className="text-sm text-gray-600">{trophy.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Panel de anuncios */}
            <div className="w-full mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Panel de anuncios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Escribe un anuncio público..."
                            className="mb-4"
                            value={announcement}
                            onChange={(e) => setAnnouncement(e.target.value)}
                        />
                        <Button className="w-full" onClick={handlePublishAnnouncement}>Publicar anuncio</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Sección de Chat WhatsApp-style */}
            <div className="w-full mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <MessageCircle className="w-5 h-5" />
                            <span>Chat Personal</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-96 bg-gray-50 rounded-lg p-4 flex flex-col">
                            <div className="flex-1 overflow-y-auto mb-4">
                                <div className="space-y-4">
                                    <div className="flex justify-start">
                                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm max-w-xs">
                                            <p className="text-sm">¡Hola! ¿Cómo va el proyecto StoryUp?</p>
                                            <p className="text-xs text-gray-500 mt-1">10:30</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
                                            <p className="text-sm">¡Muy bien! Ya tenemos el dashboard funcionando perfectamente.</p>
                                            <p className="text-xs text-blue-100 mt-1">10:32</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm max-w-xs">
                                            <p className="text-sm">¡Genial! Me encanta cómo quedó el chat integrado.</p>
                                            <p className="text-xs text-gray-500 mt-1">10:35</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1"
                                />
                                <Button size="icon" className="bg-blue-500 hover:bg-blue-600">
                                    <MessageCircle className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bloques exclusivos para Padres/Docentes */}
            {(fullUser?.user_type === 'padre-docente' || fullUser?.user_type === 'usuario') && (
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crear noticias</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Publica novedades para la comunidad.</p>
                            <Button className="mt-4">Crear noticia</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Crear concursos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Organiza concursos y actividades.</p>
                            <Button className="mt-4">Crear concurso</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Panel de administración</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Gestiona usuarios y configuraciones avanzadas.</p>
                            <Button className="mt-4">Ir al panel</Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>

    );
}

