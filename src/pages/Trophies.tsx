import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TrophyPublic {
    id: number;
    image: string;
    name: string;
    condition: string;
    description: string;
    likes: number;
}

export default function Trophies() {
    const navigate = useNavigate();
    const [trophies, setTrophies] = useState<TrophyPublic[]>([]);
    useEffect(() => {
        fetch('/api/trophiesPublic')
            .then(res => res.json())
            .then(data => setTrophies(data.trophies || []));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/feed')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        <h1 className="text-xl font-bold text-blue-600">Trofeos StoryUp</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trophies.map((trophy) => (
                        <Card key={trophy.id} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex flex-col items-center">
                                    <img src={`/assets/trophies/${trophy.image}`} alt={trophy.name} className="w-16 h-16 mb-2" />
                                    <h3 className="font-semibold text-base text-center mb-1">{trophy.name}</h3>
                                    <Badge variant="outline" className="mb-2 text-xs">{trophy.likes > 0 ? `+${trophy.likes}` : trophy.likes}</Badge>
                                    <p className="text-xs text-blue-700 font-semibold text-center mb-1">{trophy.condition}</p>
                                    <p className="text-xs text-muted-foreground text-center">{trophy.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

