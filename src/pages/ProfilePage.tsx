import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ArrowLeft, Edit, Calendar, Trophy, Users, BookOpen, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProfilePageProps {
    user: any | null; // Ajustar el tipo según sea necesario
    onBack: () => void;
    updateProfile: (updates: Partial<any>) => Promise<void>;
}

export default function ProfilePage({ user, onBack, updateProfile }: ProfilePageProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        username: user?.username || ''
    });
    const [fullUser, setFullUser] = useState<any | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [announcement, setAnnouncement] = useState('');
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
                            bio: user.bio || '',
                            username: user.username || ''
                        });
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-8">
                        <p className="text-gray-600">Debes iniciar sesión para ver el perfil</p>
                        <Button onClick={onBack} className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                    </div>
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
                {/* Bloque superior: Editar perfil (izquierda) + Trofeos/Logros (derecha) */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Editar perfil - 3/5 */}
                    <div className="md:w-7/12 w-full">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center md:items-start">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src={avatarUrl || user.avatar} alt={user.name} />
                                        <AvatarFallback className="text-lg">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Buscador de imágenes para avatar */}
                                    <div className="mt-4 w-full flex flex-col items-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setUploading(true);
                                                // Simular subida de imagen
                                                setTimeout(() => {
                                                    setAvatarUrl(URL.createObjectURL(file));
                                                    setUploading(false);
                                                }, 1000);
                                            }}
                                        />
                                        <Button
                                            variant="outline"
                                            className="mt-2"
                                            disabled={uploading}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            {uploading ? 'Subiendo...' : 'Cambiar avatar'}
                                        </Button>
                                    </div>
                                    <div className="mt-6 w-full">
                                        <h2 className="text-2xl font-bold text-gray-900">{fullUser?.name || user.name}</h2>
                                        <p className="text-gray-600">@{fullUser?.username || user.username}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge className={getUserTypeColor(fullUser?.user_type === 'padre-docente' ? 'padre-docente' : fullUser?.user_type === 'usuario' ? 'usuario' : undefined)}>
                                                {getUserTypeLabel(fullUser?.user_type === 'padre-docente' ? 'padre-docente' : fullUser?.user_type === 'usuario' ? 'usuario' : undefined)}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                                            <Calendar className="h-4 w-4" />
                                            Se unió en {joinDate.toLocaleDateString('es-ES', {
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="mt-4">
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
        </div>
    );
}
