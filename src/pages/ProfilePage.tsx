import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Calendar, Trophy, Users, BookOpen, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface User {
    id: string
    email: string
    name: string
    username: string
    userType: 'usuario' | 'padre-docente'
    avatar?: string
    bio?: string
}

interface ProfilePageProps {
    user: User | null
    onBack: () => void
    updateProfile: (updates: Partial<User>) => Promise<void>
}

export default function ProfilePage({ user, onBack, updateProfile }: ProfilePageProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        username: user?.username || ''
    });
    const userTrophies: any[] = [];
    const joinDate = new Date();

    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.name || '',
                bio: user.bio || '',
                username: user.username || ''
            });
        }
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

    const getUserTypeLabel = (userType: string) => {
        switch (userType) {
            case 'padre-docente':
                return 'Padre/Docente';
            case 'usuario':
                return 'Estudiante';
            default:
                return userType;
        }
    };

    const getUserTypeColor = (userType: string) => {
        switch (userType) {
            case 'padre-docente':
                return 'bg-green-100 text-green-800';
            case 'usuario':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Button>
                    <h1 className="text-2xl font-bold">Mi Perfil</h1>
                </div>

                {/* Bloque superior: Editar perfil (izquierda) + Trofeos/Logros (derecha) */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Editar perfil - 3/5 */}
                    <div className="md:w-3/5 w-full">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center md:items-start">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="text-lg">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline" size="sm" className="mt-3">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Cambiar foto
                                    </Button>
                                </div>
                                <div className="mt-6">
                                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                    <p className="text-gray-600">@{user.username}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className={getUserTypeColor(user.userType)}>
                                            {getUserTypeLabel(user.userType)}
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
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={editForm.name}
                                                        onChange={handleInputChange}
                                                        placeholder="Tu nombre completo"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="username" className="text-sm font-medium">
                                                        Nombre de usuario
                                                    </label>
                                                    <Input
                                                        id="username"
                                                        name="username"
                                                        value={editForm.username}
                                                        onChange={handleInputChange}
                                                        placeholder="Tu nombre de usuario"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="bio" className="text-sm font-medium">
                                                        Biografía
                                                    </label>
                                                    <Textarea
                                                        id="bio"
                                                        name="bio"
                                                        value={editForm.bio}
                                                        onChange={handleInputChange}
                                                        placeholder="Cuéntanos algo sobre ti..."
                                                        rows={3}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button onClick={handleSaveProfile} className="flex-1">
                                                        Guardar cambios
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setIsEditDialogOpen(false)}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    {user.bio && (
                                        <p className="text-gray-700 mt-4">{user.bio}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Trofeos y Logros - 2/5 */}
                    <div className="md:w-2/5 w-full flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5" />
                                    Trofeos ({userTrophies.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {userTrophies.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Trophy className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                                        <p>Aún no has obtenido trofeos</p>
                                        <p className="text-sm mt-2">¡Escribe historias y participa para ganar trofeos!</p>
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
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Logros
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Aquí puedes mostrar logros personalizados si existen */}
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                                    <p>Aún no tienes logros especiales</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Chat debajo ocupando todo el ancho */}
                <div className="w-full mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Chat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Aquí irá el componente de chat real */}
                            <div className="text-center py-8 text-gray-500">
                                <BookOpen className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                                <p>El chat estará disponible aquí próximamente.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}