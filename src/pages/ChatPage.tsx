import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { WhatsAppChat } from '../components/WhatsAppChat';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ChatPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Cargando...</div>
            </div>
        );
    }

    // Adaptar los datos del usuario para WhatsAppChat
    const adaptedUser = {
        id: user.id,
        nick: user.username, // Mapear username a nick
        name: user.name || user.username,
        avatar: user.avatar
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header personalizado para el chat */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/feed')}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Volver al Feed</span>
                    </Button>
                    <h1 className="text-2xl font-bold text-blue-600">Chat</h1>
                </div>
            </div>

            {/* Contenedor del chat con padding top para compensar el header */}
            <div className="h-[calc(100vh-80px)]">
                <WhatsAppChat currentUser={adaptedUser} />
            </div>
        </div>
    );
};

export default ChatPage;