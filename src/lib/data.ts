import { Story, User, ChatMessage, News } from './types';

// Usuarios de ejemplo
export const sampleUsers: User[] = [
    {
        id: '1',
        username: 'ana_garcia',
        name: 'Ana García',
        email: 'ana@example.com',
        avatar: '/avatars/ana.jpg',
        bio: 'Estudiante de 6º de primaria. Me encantan las ciencias.',
        userType: 'user',
        school: 'Colegio San José',
        grade: '6º Primaria',
        followers: 15,
        following: 8,
        trophies: ['1', '2', '3']
    },
    {
        id: '2',
        username: 'carlos_lopez',
        name: 'Carlos López',
        email: 'carlos@example.com',
        avatar: '/avatars/carlos.jpg',
        bio: 'Estudiante de 5º de primaria. Me gusta el arte y las matemáticas.',
        userType: 'user',
        school: 'Colegio San José',
        grade: '5º Primaria',
        followers: 12,
        following: 10,
        trophies: ['1', '4']
    },
    {
        id: '3',
        username: 'prof_maria',
        name: 'Prof. María Rodríguez',
        email: 'maria@example.com',
        avatar: '/avatars/maria.jpg',
        bio: 'Profesora de ciencias naturales. Apasionada por la enseñanza.',
        userType: 'educator',
        school: 'Colegio San José',
        followers: 45,
        following: 20,
        trophies: ['5', '6', '7', '8']
    }
];

// Historias de ejemplo
export const sampleStories: Story[] = [
    {
        id: '1',
        userId: '1',
        user: sampleUsers[0],
        content: '¡Hoy aprendimos sobre el sistema solar en clase de ciencias! Fue increíble descubrir que Júpiter es tan grande que podrían caber todos los otros planetas dentro de él. 🪐✨',
        image: '/images/sistema-solar.jpg',
        likes: 24,
        isLiked: false,
        visibility: 'public',
        comments: [
            {
                id: '1',
                userId: '2',
                user: sampleUsers[1],
                content: '¡Qué interesante! No sabía eso de Júpiter',
                timestamp: new Date('2024-01-15T10:30:00')
            }
        ],
        timestamp: new Date('2024-01-15T09:00:00')
    },
    {
        id: '2',
        userId: '2',
        user: sampleUsers[1],
        content: 'Terminé mi proyecto de matemáticas sobre geometría. Construí figuras 3D con materiales reciclados. ¡El reciclaje también puede ser educativo! 📐♻️',
        image: '/images/proyecto-geometria.jpg',
        likes: 18,
        isLiked: true,
        visibility: 'public',
        comments: [],
        timestamp: new Date('2024-01-15T14:20:00')
    },
    {
        id: '3',
        userId: '3',
        user: sampleUsers[2],
        content: 'Mis estudiantes presentaron hoy sus proyectos sobre animales en peligro de extinción. Me siento muy orgullosa de su dedicación y creatividad. 🐅🦏',
        image: '/images/animales-extincion.jpg',
        likes: 32,
        isLiked: false,
        visibility: 'public',
        comments: [
            {
                id: '2',
                userId: '1',
                user: sampleUsers[0],
                content: 'Gracias por enseñarnos tanto, profesora',
                timestamp: new Date('2024-01-15T16:45:00')
            }
        ],
        timestamp: new Date('2024-01-15T16:00:00')
    }
];

// Mensajes de chat de ejemplo
export const sampleChatMessages: ChatMessage[] = [
    {
        id: '1',
        senderId: '1',
        receiverId: '2',
        content: 'Hola Carlos, ¿terminaste la tarea de matemáticas?',
        timestamp: new Date('2024-01-15T18:00:00'),
        isRead: true
    },
    {
        id: '2',
        senderId: '2',
        receiverId: '1',
        content: 'Sí, la terminé. ¿Te ayudo con algún ejercicio?',
        timestamp: new Date('2024-01-15T18:02:00'),
        isRead: true
    },
    {
        id: '3',
        senderId: '1',
        receiverId: '2',
        content: 'Perfecto, tengo dudas con el problema 7',
        timestamp: new Date('2024-01-15T18:03:00'),
        isRead: false
    }
];

// Noticias de ejemplo
export const sampleNews: News[] = [
    {
        id: '1',
        creatorId: '3',
        creator: sampleUsers[2],
        title: 'Nueva biblioteca digital disponible',
        content: 'A partir de hoy, todos los estudiantes tienen acceso a nuestra nueva biblioteca digital con más de 1000 libros.',
        timestamp: new Date('2024-01-15T08:00:00')
    },
    {
        id: '2',
        creatorId: '3',
        creator: sampleUsers[2],
        title: 'Concurso de ciencias 2024',
        content: 'Se abre la convocatoria para el concurso anual de ciencias. ¡Participen con sus mejores proyectos!',
        timestamp: new Date('2024-01-14T10:00:00')
    }
];

// Estadísticas de ejemplo
export const sampleStatistics = {
    totalStories: 145,
    totalLikes: 892,
    totalComments: 267,
    totalTrophies: 8,
    weeklyGrowth: {
        stories: 12,
        likes: 89,
        comments: 23
    },
    monthlyStats: [
        { month: 'Enero', stories: 32, likes: 145 },
        { month: 'Febrero', stories: 28, likes: 132 },
        { month: 'Marzo', stories: 35, likes: 167 },
        { month: 'Abril', stories: 41, likes: 201 },
        { month: 'Mayo', stories: 38, likes: 189 }
    ]
};

// Alias para compatibilidad con imports existentes
export const mockStories = sampleStories;
export const mockUsers = sampleUsers;

// Crear chats de ejemplo con la estructura correcta
export const mockChats = [
    {
        id: '1',
        participants: [sampleUsers[0], sampleUsers[1]],
        messages: [
            {
                id: '1',
                senderId: '1',
                receiverId: '2',
                content: 'Hola Carlos, ¿terminaste la tarea de matemáticas?',
                timestamp: new Date('2024-01-15T18:00:00'),
                isRead: true
            },
            {
                id: '2',
                senderId: '2',
                receiverId: '1',
                content: 'Sí, la terminé. ¿Te ayudo con algún ejercicio?',
                timestamp: new Date('2024-01-15T18:02:00'),
                isRead: true
            }
        ],
        lastMessage: {
            id: '2',
            senderId: '2',
            receiverId: '1',
            content: 'Sí, la terminé. ¿Te ayudo con algún ejercicio?',
            timestamp: new Date('2024-01-15T18:02:00'),
            isRead: true
        },
        createdAt: new Date('2024-01-15T17:00:00'),
        isPrivate: true
    }
];
export const mockTrophies = [
    {
        id: '1',
        name: 'Primera Historia',
        description: 'Completaste tu primera historia',
        icon: '🏆',
        color: '#fbbf24',
        earnedAt: new Date('2024-01-10T10:00:00'),
        category: 'academic' as const
    },
    {
        id: '2',
        name: 'Escritor Creativo',
        description: 'Escribiste 5 historias creativas',
        icon: '✍️',
        color: '#8b5cf6',
        earnedAt: new Date('2024-01-12T15:30:00'),
        category: 'academic' as const
    },
    {
        id: '3',
        name: 'Colaborador',
        description: 'Ayudaste a 3 compañeros con comentarios útiles',
        icon: '🤝',
        color: '#10b981',
        earnedAt: new Date('2024-01-14T09:15:00'),
        category: 'social' as const
    },
    {
        id: '4',
        name: 'Explorador',
        description: 'Leíste 20 historias de tus compañeros',
        icon: '🔍',
        color: '#3b82f6',
        earnedAt: new Date('2024-01-15T12:00:00'),
        category: 'participation' as const
    }
];