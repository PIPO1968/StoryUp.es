import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '../lib/auth';
import WhatsAppChat from '@/components/WhatsAppChat';

export default function Chat() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) {
                setCurrentUser(user);
            }
        });
    }, []);

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/feed')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-bold text-blue-600">Mensajes</h1>
                    </div>
                </div>
            </header>

            {/* WhatsApp Chat Component */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <WhatsAppChat
                    currentUser={{
                        id: currentUser.id || '1',
                        nick: currentUser.username || currentUser.name || 'usuario',
                        name: currentUser.name || currentUser.username || 'Usuario',
                        avatar: currentUser.avatar
                    }}
                />
            </div>
        </div>
    );
}