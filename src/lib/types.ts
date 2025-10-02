export interface Story {
    id: string;
    userId: string;
    user: {
        id: string;
        username: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: Comment[];
    timestamp: Date;
    isLiked: boolean;
    isNews?: boolean; // Para noticias creadas por educadores
    visibility: 'public' | 'friends' | 'private';
}

export interface Comment {
    id: string;
    userId: string;
    user: {
        id: string;
        username: string;
    };
    content: string;
    timestamp: Date;
}

export interface Trophy {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    earnedAt: Date;
    category?: 'academic' | 'social' | 'participation' | 'behavior';
}

export interface Contest {
    id: string;
    creatorId: string;
    creator: {
        id: string;
        username: string;
    };
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    winner?: string; // ID del ganador
    isActive: boolean;
    canSelectWinner: boolean; // Se activa una semana después del fin
}

export interface News {
    id: string;
    creatorId: string;
    creator: {
        id: string;
        username: string;
    };
    title: string;
    content: string;
    timestamp: Date;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
    formatting?: {
        bold?: boolean;
        underline?: boolean;
        image?: string;
        youtubeUrl?: string;
    };
}

export interface Chat {
    id: string;
    participants: {
        id: string;
        username: string;
    }[];
    messages: ChatMessage[];
    lastMessage: ChatMessage;
    createdAt: Date;
    isPrivate: boolean; // Solo visible para los participantes
}export interface StatisticsData {
    totalStories: number;
    totalLikes: number;
    totalComments: number;
    totalTrophies: number;
    weeklyGrowth: {
        stories: number;
        likes: number;
        comments: number;
    };
    monthlyStats: Array<{
        month: string;
        stories: number;
        likes: number;
    }>;
}

export interface CreateStoryData {
    content: string;
    image?: File;
}

export interface LoginCredentials {
    email: string;
    password: string;
}