import { useState, useEffect } from 'react';
import { getCurrentUser, updateUser } from '../lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';
import {
    Search,
    Plus,
    X,
    Send,
    Bold,
    Underline,
    Image,
    Video,
    Trophy,
    Calendar,
    Users,
    Shield,
    Ban,
    UserPlus
} from 'lucide-react';
import { User, Contest, News } from '@/lib/types';
import { toast } from 'sonner';

export default function EducatorProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [contestTitle, setContestTitle] = useState('');
    const [contestDescription, setContestDescription] = useState('');
    const [contestStart, setContestStart] = useState('');
    const [contestEnd, setContestEnd] = useState('');
    const [newsTitle, setNewsTitle] = useState('');
    const [newsContent, setNewsContent] = useState('');
    const [bannedWord, setBannedWord] = useState('');

    useEffect(() => {
        getCurrentUser().then(user => {
            setUser({
                id: user.id,
                username: user.username || '',
                name: user.name || '',
                avatar: user.avatar || '',
                bio: user.bio || '',
                userType: user.userType || 'user',
            });
        });
    }, []);

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const updatedUser = { ...user, avatar: e.target?.result as string };
                setUser(updatedUser);
                updateUser(updatedUser);
                toast.success('Avatar actualizado');
            };
            reader.readAsDataURL(file);
        }
    };

    const addToFavorites = () => {
        if (searchQuery && user) {
            const updatedUser = {
                ...user,
                favorites: [...(user.favorites || []), searchQuery]
            };
            setUser(updatedUser);
            updateUser(updatedUser);
            setSearchQuery('');
            toast.success('Usuario añadido a favoritos');
        }
    };

    const removeFromFavorites = (userId: string) => {
        if (user) {
            const updatedUser = {
                ...user,
                favorites: user.favorites?.filter(id => id !== userId) || []
            };
            setUser(updatedUser);
            updateUser(updatedUser);
            toast.success('Usuario eliminado de favoritos');
        }
    };

    const sendMessage = () => {
        if (chatMessage.trim() && selectedUser) {
            // Aquí se enviaría el mensaje
            setChatMessage('');
            toast.success('Mensaje enviado');
        }
    };

    const createContest = () => {
        if (contestTitle && contestDescription && contestStart && contestEnd) {
            // Aquí se crearía el concurso
            setContestTitle('');
            setContestDescription('');
            setContestStart('');
            setContestEnd('');
            toast.success('Concurso creado');
        }
    };

    const createNews = () => {
        if (newsTitle && newsContent) {
            // Aquí se crearía la noticia
            setNewsTitle('');
            setNewsContent('');
            toast.success('Noticia publicada');
        }
    };

    const addBannedWord = () => {
        if (bannedWord && user) {
            const updatedUser = {
                ...user,
                bannedWords: [...(user.bannedWords || []), bannedWord.toLowerCase()]
            };
            setUser(updatedUser);
            updateUser(updatedUser);
            setBannedWord('');
            toast.success('Palabra prohibida añadida');
        }
    };

    const removeBannedWord = (word: string) => {
        if (user) {
            const updatedUser = {
                ...user,
                bannedWords: user.bannedWords?.filter(w => w !== word) || []
            };
            setUser(updatedUser);
            updateUser(updatedUser);
            toast.success('Palabra eliminada');
        }
    };

    if (!user) {
        return <div>Acceso denegado</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Parte superior - Datos personales y Trofeos */}
                <div className="grid grid-cols-5 gap-6">
                    {/* Datos Personales - 3/5 */}
                    <div className="col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Datos Personales
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Avatar */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                                            <Button variant="outline" size="sm">
                                                <Image className="h-4 w-4 mr-2" />
                                                Cambiar Avatar
                                            </Button>
                                        </Label>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarUpload}
                                        />
                                    </div>
                                </div>

                                {/* Información básica */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Nick</Label>
                                        <Input value={user.username} readOnly />
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <Input value={user.email} readOnly />
                                    </div>
                                </div>

                                <div>
                                    <Label>Centro Escolar</Label>
                                    <Input
                                        value={user.school || ''}
                                        onChange={(e) => {
                                            const updatedUser = { ...user, school: e.target.value };
                                            setUser(updatedUser);
                                            updateUser(updatedUser);
                                        }}
                                        placeholder="Añade tu centro escolar"
                                    />
                                </div>

                                {/* Mis Favoritos */}
                                <div>
                                    <Label>Mis Favoritos (Alumnos)</Label>
                                    <div className="flex gap-2 mb-2">
                                        <Input
                                            placeholder="Buscar usuario por nick..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <Button onClick={addToFavorites} size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {user.favorites?.map((userId, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                @{userId}
                                                <X
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() => removeFromFavorites(userId)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Trofeos - 2/5 */}
                    <div className="col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5" />
                                    Mis Trofeos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                    {user.trophies.map((trophyId, index) => (
                                        <div key={index} className="text-center">
                                            <img
                                                src={`/assets/trofeo${trophyId}.png`}
                                                alt={`Trofeo ${trophyId}`}
                                                className="w-16 h-16 mx-auto mb-2"
                                            />
                                            <p className="text-xs text-gray-600">Trofeo {trophyId}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Chat tipo WhatsApp */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chat Privado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Favoritos en el chat */}
                        <div className="mb-4">
                            <Label>Favoritos</Label>
                            <ScrollArea className="h-20 w-full border rounded p-2">
                                <div className="flex gap-2">
                                    {user.favorites?.map((userId, index) => (
                                        <Button
                                            key={index}
                                            variant={selectedUser === userId ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedUser(userId)}
                                        >
                                            @{userId}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Área de mensajes */}
                        <div className="border rounded-lg p-4 h-40 mb-4 bg-gray-50">
                            <p className="text-sm text-gray-500">
                                {selectedUser ? `Conversación con @${selectedUser}` : 'Selecciona un usuario para chatear'}
                            </p>
                        </div>

                        {/* Herramientas de formato y envío */}
                        <div className="flex gap-2 mb-2">
                            <Button variant="outline" size="sm">
                                <Bold className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                                <Underline className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                                <Image className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                                <Video className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Escribe tu mensaje..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                disabled={!selectedUser}
                            />
                            <Button onClick={sendMessage} disabled={!selectedUser || !chatMessage.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Buscador de usuarios para chat */}
                        <div className="mt-4 flex gap-2">
                            <Input placeholder="Buscar usuario por nick..." />
                            <Button variant="outline" size="sm">Aceptar</Button>
                            <Button variant="outline" size="sm">Borrar</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Bloques inferiores - Solo visibles para educadores */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Crear Concurso */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Crear Concurso
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Título</Label>
                                <Input
                                    value={contestTitle}
                                    onChange={(e) => setContestTitle(e.target.value)}
                                    placeholder="Título del concurso"
                                />
                            </div>
                            <div>
                                <Label>Explicación</Label>
                                <Textarea
                                    value={contestDescription}
                                    onChange={(e) => setContestDescription(e.target.value)}
                                    placeholder="Descripción del concurso"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label>Fecha inicio</Label>
                                    <Input
                                        type="date"
                                        value={contestStart}
                                        onChange={(e) => setContestStart(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Fecha fin</Label>
                                    <Input
                                        type="date"
                                        value={contestEnd}
                                        onChange={(e) => setContestEnd(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button onClick={createContest} className="w-full">
                                Crear Concurso
                            </Button>

                            <Separator />

                            {/* Seleccionar ganador */}
                            <div className="opacity-50">
                                <Label>Seleccionar Ganador</Label>
                                <div className="flex gap-2">
                                    <Input placeholder="Usuario ganador" disabled />
                                    <Button disabled>Enviar</Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Disponible una semana después del fin del concurso
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Crear Noticia */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Crear Noticia</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Título</Label>
                                <Input
                                    value={newsTitle}
                                    onChange={(e) => setNewsTitle(e.target.value)}
                                    placeholder="Título de la noticia"
                                />
                            </div>
                            <div>
                                <Label>Contenido</Label>
                                <Textarea
                                    value={newsContent}
                                    onChange={(e) => setNewsContent(e.target.value)}
                                    placeholder="Contenido de la noticia"
                                    className="h-32"
                                />
                            </div>
                            <Button onClick={createNews} className="w-full">
                                <Send className="h-4 w-4 mr-2" />
                                Publicar Noticia
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Administrador */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Administrador
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Buscar y añadir amigos */}
                            <div>
                                <Label>Buscar Usuarios</Label>
                                <div className="flex gap-2">
                                    <Input placeholder="Buscar usuario..." />
                                    <Button size="sm">
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            {/* Palabras prohibidas */}
                            <div>
                                <Label>Palabras Prohibidas</Label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={bannedWord}
                                        onChange={(e) => setBannedWord(e.target.value)}
                                        placeholder="Nueva palabra prohibida"
                                    />
                                    <Button onClick={addBannedWord} size="sm">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                                    {user.bannedWords?.map((word, index) => (
                                        <Badge key={index} variant="destructive" className="flex items-center gap-1">
                                            {word}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() => removeBannedWord(word)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Expulsar usuarios */}
                            <div>
                                <Label>Expulsar Usuario</Label>
                                <div className="flex gap-2">
                                    <Input placeholder="Usuario a expulsar" />
                                    <Button variant="destructive" size="sm">
                                        <Ban className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}