import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChatMessage } from '@/components/ChatMessage';
import { getCurrentUser } from '@/lib/auth';
import { mockChats, mockUsers } from '@/lib/data';
import { Chat as ChatType, ChatMessage as ChatMessageType, User } from '@/lib/types';

export default function Chat() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [chats] = useState<ChatType[]>(mockChats);

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            navigate('/');
            return;
        }
        setCurrentUser(user);
    }, [navigate]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedChat || !currentUser) return;

        const message: ChatMessageType = {
            id: Date.now().toString(),
            senderId: currentUser.id,
            receiverId: selectedChat.participants.find(p => p.id !== currentUser.id)?.id || '',
            content: newMessage,
            timestamp: new Date(),
            isRead: false
        };

        selectedChat.messages.push(message);
        selectedChat.lastMessage = message;
        setNewMessage('');
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/feed')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-bold text-blue-600">Mensajes</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
                    {/* Chat List */}
                    <div className="md:col-span-1">
                        <Card className="h-full">
                            <CardHeader>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input placeholder="Buscar conversaciones..." className="pl-10" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-1">
                                    {chats.map((chat) => {
                                        const otherUser = chat.participants.find(p => p.id !== currentUser.id);
                                        if (!otherUser) return null;

                                        return (
                                            <div
                                                key={chat.id}
                                                onClick={() => setSelectedChat(chat)}
                                                className={`p-3 hover:bg-gray-50 cursor-pointer border-l-4 ${selectedChat?.id === chat.id ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                                                        <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-sm truncate">{otherUser.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {chat.lastMessage.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chat Messages */}
                    <div className="md:col-span-2">
                        {selectedChat ? (
                            <Card className="h-full flex flex-col">
                                <CardHeader className="border-b">
                                    <div className="flex items-center space-x-3">
                                        {(() => {
                                            const otherUser = selectedChat.participants.find(p => p.id !== currentUser.id);
                                            return otherUser ? (
                                                <>
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                                                        <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-semibold">{otherUser.name}</h3>
                                                        <p className="text-sm text-gray-500">{otherUser.school}</p>
                                                    </div>
                                                </>
                                            ) : null;
                                        })()}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 p-4 overflow-y-auto">
                                    <div className="space-y-4">
                                        {selectedChat.messages.map((message) => {
                                            const sender = selectedChat.participants.find(p => p.id === message.senderId);
                                            return sender ? (
                                                <ChatMessage
                                                    key={message.id}
                                                    message={message}
                                                    senderName={sender.name}
                                                    senderAvatar={sender.avatar}
                                                />
                                            ) : null;
                                        })}
                                    </div>
                                </CardContent>

                                <div className="p-4 border-t">
                                    <div className="flex space-x-2">
                                        <Input
                                            placeholder="Escribe un mensaje..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            className="flex-1"
                                        />
                                        <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="h-full flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <p>Selecciona una conversación para empezar a chatear</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}