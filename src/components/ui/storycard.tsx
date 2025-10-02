import { useState } from 'react';
import { Heart, MessageCircle, Share2, Trophy } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Story } from '@/lib/types';

interface StoryCardProps {
    story: Story;
    onLike: (storyId: string) => void;
    onComment: (storyId: string) => void;
}

export function StoryCard({ story, onLike, onComment }: StoryCardProps) {
    const [isLiked, setIsLiked] = useState(story.isLiked);
    const [likesCount, setLikesCount] = useState(story.likes);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        onLike(story.id);
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    return (
        <Card className="w-full max-w-2xl mx-auto mb-6 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={story.user.avatar} alt={story.user.name || story.user.username} />
                        <AvatarFallback>{(story.user.name || story.user.username).charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-sm">{story.user.name || story.user.username}</h3>
                            {story.user.grade && (
                                <Badge variant="secondary" className="text-xs">
                                    {story.user.grade}
                                </Badge>
                            )}
                            {story.user.trophies && story.user.trophies.length > 0 && (
                                <Trophy className="h-4 w-4 text-yellow-500" />
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {story.user.school && `${story.user.school} • `}{formatTime(story.timestamp)}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                <p className="text-sm mb-3 leading-relaxed">{story.content}</p>
                {story.image && (
                    <div className="rounded-lg overflow-hidden">
                        <img
                            src={story.image}
                            alt="Story image"
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                        >
                            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="text-xs">{likesCount}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onComment(story.id)}
                            className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500"
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-xs">{story.comments.length}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 text-muted-foreground hover:text-green-500"
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}