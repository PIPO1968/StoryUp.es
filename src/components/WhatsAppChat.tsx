import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
}

interface Contact {
    id: string;
    nick: string;
    name: string;
    avatar?: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount?: number;
    isOnline?: boolean;
}

interface WhatsAppChatProps {
    currentUser: {
        id: string;
        nick: string;
        name: string;
        avatar?: string;
    };
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ currentUser }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [newContactNick, setNewContactNick] = useState('');
    const [addContactError, setAddContactError] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Filter contacts based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredContacts(contacts);
        } else {
            const filtered = contacts.filter(contact =>
                contact.nick.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredContacts(filtered);
        }
    }, [searchTerm, contacts]);

    // Load contacts from API
    const loadContacts = async () => {
        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_nick: currentUser.nick })
            });
            const data = await response.json();
            if (response.ok) {
                setContacts(data.contacts || []);
            }
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    };

    // Load messages for selected contact
    const loadMessages = async (contactNick: string) => {
        try {
            const response = await fetch(`/api/messages?from=${currentUser.nick}&to=${contactNick}`);
            const data = await response.json();
            if (response.ok) {
                const formattedMessages = data.map((msg: any) => ({
                    id: msg.id.toString(),
                    senderId: msg.sender,
                    receiverId: msg.receiver,
                    content: msg.content,
                    timestamp: new Date(msg.created_at),
                    isRead: true
                }));
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    // Send message
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from: currentUser.nick,
                    to: selectedContact.nick,
                    content: newMessage.trim()
                })
            });

            if (response.ok) {
                const newMsg: Message = {
                    id: Date.now().toString(),
                    senderId: currentUser.nick,
                    receiverId: selectedContact.nick,
                    content: newMessage.trim(),
                    timestamp: new Date(),
                    isRead: false
                };
                setMessages(prev => [...prev, newMsg]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Add new contact
    const addContact = async () => {
        if (!newContactNick.trim()) return;
        setAddContactError('');

        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_nick: currentUser.nick,
                    contact_nick: newContactNick.trim()
                })
            });

            const data = await response.json();
            if (response.ok) {
                await loadContacts();
                setNewContactNick('');
            } else {
                setAddContactError(data.error || 'Error al añadir contacto');
            }
        } catch (error) {
            setAddContactError('Error de conexión');
        }
    };

    // Select contact and load messages
    const selectContact = (contact: Contact) => {
        setSelectedContact(contact);
        loadMessages(contact.nick);
    };

    // Initialize
    useEffect(() => {
        loadContacts();
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const messageDate = new Date(date);

        if (messageDate.toDateString() === today.toDateString()) {
            return formatTime(messageDate);
        } else {
            return messageDate.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit'
            });
        }
    };

    return (
        <Card className="w-full max-w-6xl mx-auto h-[80vh] flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-gray-50 border-r flex flex-col">
                {/* Add Contact Section */}
                <div className="p-3 border-b bg-white">
                    <div className="flex gap-2 mb-2">
                        <Input
                            value={newContactNick}
                            onChange={(e) => setNewContactNick(e.target.value)}
                            placeholder="Añadir favorito..."
                            className="flex-1"
                        />
                        <Button onClick={addContact} size="sm" variant="default">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {addContactError && (
                        <p className="text-red-500 text-sm">{addContactError}</p>
                    )}
                </div>

                {/* Search */}
                <div className="p-3 border-b bg-white">
                    <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar usuario..."
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Contacts List */}
                <ScrollArea className="flex-1">
                    {filteredContacts.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            {searchTerm ? 'No se encontraron usuarios' : 'No hay contactos'}
                        </div>
                    ) : (
                        filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => selectContact(contact)}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 ${selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={contact.avatar} />
                                    <AvatarFallback>
                                        {contact.name.charAt(0).toUpperCase() || contact.nick.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-sm truncate">
                                            {contact.name || contact.nick}
                                        </h3>
                                        {contact.lastMessageTime && (
                                            <span className="text-xs text-gray-500">
                                                {formatDate(contact.lastMessageTime)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">
                                        @{contact.nick}
                                    </p>
                                    {contact.lastMessage && (
                                        <p className="text-xs text-gray-600 truncate mt-1">
                                            {contact.lastMessage}
                                        </p>
                                    )}
                                </div>
                                {contact.unreadCount && contact.unreadCount > 0 && (
                                    <div className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {contact.unreadCount}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 bg-blue-50 border-b flex items-center px-6">
                            <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={selectedContact.avatar} />
                                <AvatarFallback>
                                    {selectedContact.name.charAt(0).toUpperCase() || selectedContact.nick.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="font-semibold">
                                    {selectedContact.name || selectedContact.nick}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    @{selectedContact.nick}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4 bg-gray-50">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.senderId === currentUser.nick ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.senderId === currentUser.nick
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-white text-gray-800 shadow-sm'
                                                }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <p
                                                className={`text-xs mt-1 ${message.senderId === currentUser.nick
                                                        ? 'text-green-100'
                                                        : 'text-gray-500'
                                                    }`}
                                            >
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="border-t bg-white p-4">
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1"
                                    autoComplete="off"
                                />
                                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center text-gray-500">
                            <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">Selecciona un contacto</p>
                            <p className="text-sm">Elige un contacto para comenzar a chatear</p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default WhatsAppChat;