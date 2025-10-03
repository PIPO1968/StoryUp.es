import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
    id: number;
    content: string;
    time: string;
    sender: 'user' | 'other';
}

const WhatsAppChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, content: "Hola, ¿cómo estás?", time: "10:30", sender: 'other' },
        { id: 2, content: "¡Muy bien! ¿Y tú?", time: "10:32", sender: 'user' },
        { id: 3, content: "Todo genial, trabajando en StoryUp.es", time: "10:35", sender: 'other' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg: Message = {
                id: messages.length + 1,
                content: newMessage,
                time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                sender: 'user'
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="h-96 bg-white rounded-lg overflow-hidden border border-gray-200">
            {/* Header del chat */}
            <div className="bg-green-500 text-white p-4 flex items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-500 font-bold">SU</span>
                </div>
                <div>
                    <p className="font-medium">StoryUp.es Chat</p>
                    <p className="text-sm opacity-90">Chat educativo</p>
                </div>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 p-4 h-64 overflow-y-auto bg-gray-50">
                <div className="space-y-3">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === 'user'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white border border-gray-200'
                                }`}>
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${message.sender === 'user'
                                        ? 'text-green-100'
                                        : 'text-gray-500'
                                    }`}>
                                    {message.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input para escribir mensaje */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe un mensaje educativo..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppChat;