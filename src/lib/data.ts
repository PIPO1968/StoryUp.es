import { Story, User, ChatMessage, News, Trophy } from './types';

// Trophies de ejemplo
export const sampleTrophies: Trophy[] = [
    { id: '1', name: 'Primera Historia', description: 'Publicaste tu primera historia', icon: '📝', color: 'gold', earnedAt: new Date(), category: 'participation' },
    { id: '2', name: 'Científico', description: 'Historia sobre ciencias', icon: '🔬', color: 'blue', earnedAt: new Date(), category: 'academic' },
    { id: '3', name: 'Artista', description: 'Historia creativa', icon: '🎨', color: 'purple', earnedAt: new Date(), category: 'academic' },
    { id: '4', name: 'Matemático', description: 'Historia sobre matemáticas', icon: '🔢', color: 'green', earnedAt: new Date(), category: 'academic' },
    { id: '5', name: 'Educador Estrella', description: 'Profesor destacado', icon: '⭐', color: 'gold', earnedAt: new Date(), category: 'behavior' },
    { id: '6', name: 'Mentor', description: 'Guía de estudiantes', icon: '🎓', color: 'blue', earnedAt: new Date(), category: 'social' },
    { id: '7', name: 'Innovador', description: 'Métodos de enseñanza creativos', icon: '💡', color: 'yellow', earnedAt: new Date(), category: 'participation' },
    { id: '8', name: 'Colaborador', description: 'Trabajo en equipo', icon: '🤝', color: 'orange', earnedAt: new Date(), category: 'social' }
];

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
        trophies: [sampleTrophies[0], sampleTrophies[1], sampleTrophies[2]],
        joinedAt: new Date('2024-01-15')
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
        trophies: [sampleTrophies[0], sampleTrophies[3]],
        joinedAt: new Date('2024-02-01')
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
        trophies: [sampleTrophies[4], sampleTrophies[5], sampleTrophies[6], sampleTrophies[7]],
        joinedAt: new Date('2023-09-01')
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