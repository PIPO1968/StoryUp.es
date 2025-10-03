import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

const ChatPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) {
        return (
            
                <div className="flex items-center justify-center h-96">
                    <div>Cargando...</div>
                </div>
            
        );
    }

    return (
        
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Chat</h1>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <MessageCircle className="w-5 h-5" />
                            <span>Sistema de Mensajería</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chat Principal</h3>
                            <p className="text-gray-500 mb-4">
                                El sistema de chat principal está disponible.
                                Para una experiencia de chat más completa, visita tu perfil.
                            </p>
                            <Button
                                onClick={() => navigate('/profile')}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Ir al Chat en Perfil
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        
    );
};

export default ChatPage;

