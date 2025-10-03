import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface WhatsAppChatProps {
    currentUser: {
        id: string;
        nick: string;
        name: string;
        avatar?: string;
    };
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ currentUser }) => {
    const [messages, setMessages] = useState([
        { id: '1', sender: 'Ana García', content: 'Hola, ¿cómo estás?', time: '10:30', isOwn: false },
        { id: '2', sender: currentUser.name, content: '¡Hola! Muy bien, gracias', time: '10:32', isOwn: true },
        { id: '3', sender: 'Ana García', content: '¿Cómo va el proyecto?', time: '10:35', isOwn: false }
    ]);
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: Date.now().toString(),
            sender: currentUser.name,
            content: newMessage.trim(),
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            isOwn: true
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    return (
        <div className="flex h-full bg-white rounded-lg overflow-hidden border border-gray-200">
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
                </div>
                
                <div className="p-2">
                    <div className="flex items-center p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src="/assets/logo-grande.png.png" alt="Ana García" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">Ana García</p>
                            <p className="text-sm text-gray-500">¿Cómo va el proyecto?</p>
                        </div>
                        <div className="text-xs text-gray-500">10:35</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src="/assets/logo-grande.png.png" alt="Ana García" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Ana García</p>
                            <p className="text-xs text-gray-500">En línea</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={lex }>
                                <div className={max-w-xs lg:max-w-md px-4 py-2 rounded-lg }>
                                    <p className="text-sm">{message.content}</p>
                                    <p className={	ext-xs mt-1 }>
                                        {message.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" className="bg-blue-500 hover:bg-blue-600">
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
