import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth';

interface ChatMessageProps {
    message: ChatMessageType;
    senderName: string;
    senderAvatar: string;
}

export function ChatMessage({ message, senderName, senderAvatar }: ChatMessageProps) {
    const currentUser = getCurrentUser();
    const isOwnMessage = message.senderId === currentUser?.id;

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`flex items-end space-x-2 mb-4 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
            {!isOwnMessage && (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={senderAvatar} alt={senderName} />
                    <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
                </Avatar>
            )}

            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isOwnMessage
                ? 'bg-blue-500 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                </p>
            </div>
        </div>
    );
}